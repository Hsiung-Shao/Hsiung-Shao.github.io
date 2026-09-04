import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  findLeaks,
  loadProtectedTerms,
  normalizeTerms,
  scanProjectContent,
  type PolicyConfig,
} from '../scripts/lib/content-policy.mjs';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(
  readFileSync(resolve(root, 'scripts/projects.config.json'), 'utf8'),
) as PolicyConfig;

/**
 * 這份測試守的是本站唯一一條不能破的規則:
 * 客戶／受保護專案的身分,不得出現在任何會被建置進網站的內容裡。
 *
 * 光是「掃描結果為空」不足以證明護欄有效——空的掃描器也永遠回傳空。
 * 所以每個掃描能力都配一個反例,證明它真的抓得到。
 */
describe('識別詞正規化', () => {
  it('一律小寫並去重', () => {
    expect(normalizeTerms(['AcmeCorp', 'acmecorp'])).toEqual(['acmecorp']);
  });

  it('把帶網域後綴的名字連同裸名一起擋下', () => {
    // 只擋 acmestudio-com 是不夠的:文章裡寫「acmestudio 的後台」一樣洩漏身分
    const terms = normalizeTerms(['acmestudio-com']);

    expect(terms).toContain('acmestudio-com');
    expect(terms).toContain('acmestudio');
  });

  it('略過空字串與空白', () => {
    expect(normalizeTerms(['', '   ', 'acmecorp'])).toEqual(['acmecorp']);
  });
});

describe('識別詞載入', () => {
  // 客戶真名不在這個 repo 裡(它是公開的),所以來源是環境變數或本機檔。
  // 這組測試不依賴本機檔存在,CI 上沒有那個檔也要能跑。
  const emptyRoot = resolve(root, 'tests');

  it('從環境變數載入(CI 由 secret 注入的路徑)', () => {
    const terms = loadProtectedTerms(emptyRoot, {}, { PROTECTED_TERMS: 'AcmeCorp,acmestudio-com' });

    expect(terms).toContain('acmecorp');
    expect(terms).toContain('acmestudio');
  });

  it('併入設定檔裡人工補充的敏感詞', () => {
    const terms = loadProtectedTerms(emptyRoot, { projects: [], forbiddenTerms: ['某某科技'] }, {});

    expect(terms).toContain('某某科技');
  });

  it('三個來源都空時回傳空陣列', () => {
    // 這不是失敗,是「保護已降級」的狀態。validate-content.mjs 必須把它講出來,
    // 而不是讓一個空的掃描器看起來跟全套一樣綠。
    expect(loadProtectedTerms(emptyRoot, { projects: [] }, {})).toEqual([]);
  });

  it('不再把 config 裡的去識別化代號當識別詞', () => {
    // 代號(protected-commerce-site 等)本來就該出現在 src/data/projects.json,
    // 拿它當識別詞會讓每次建置都誤報。
    const terms = loadProtectedTerms(
      emptyRoot,
      { projects: [{ name: 'protected-commerce-site', tier: 'protected' }] },
      {},
    );

    expect(terms).not.toContain('protected-commerce-site');
  });
});

describe('洩漏偵測', () => {
  const terms = ['acmecorp', 'acmestudio'];

  it('抓到大小寫不同的識別詞', () => {
    const hits = findLeaks('這個案子是替 AcmeCorp 做的。', terms);

    expect(hits).toHaveLength(1);
    expect(hits[0]?.term).toBe('acmecorp');
  });

  it('抓到嵌在其他字串中的識別詞', () => {
    const hits = findLeaks('部署到 acmestudio-admin.example.com', terms);

    expect(hits.map((hit) => hit.term)).toContain('acmestudio');
  });

  it('回報正確的行號', () => {
    const hits = findLeaks(['第一行', '第二行', '客戶 AcmeCorp'].join('\n'), terms);

    expect(hits[0]?.line).toBe(3);
  });

  it('抓到本機專案路徑', () => {
    const hits = findLeaks('原始碼在 D:/codeproject/web/something', []);

    expect(hits).toHaveLength(1);
    expect(hits[0]?.kind).toBe('本機專案路徑');
  });

  it('反斜線寫法的本機路徑一樣抓得到', () => {
    const hits = findLeaks('原始碼在 D:\\codeproject\\web\\something', []);

    expect(hits).toHaveLength(1);
    expect(hits[0]?.kind).toBe('本機專案路徑');
  });

  it('抓到本機使用者目錄', () => {
    const hits = findLeaks('設定檔在 C:/Users/someone/.config', []);

    expect(hits[0]?.kind).toBe('本機使用者目錄');
  });

  it('乾淨的文字不誤報', () => {
    const hits = findLeaks('這是一篇談 Astro 靜態建置的文章。', terms);

    expect(hits).toEqual([]);
  });

  it('多行中的多個洩漏全部回報,不是只回第一個', () => {
    const hits = findLeaks(['客戶 AcmeCorp', '還有 acmestudio'].join('\n'), terms);

    expect(hits).toHaveLength(2);
  });
});

describe('實際網站內容', () => {
  it('src 與 public 不含任何受保護識別詞或本機路徑', () => {
    const leaks = scanProjectContent(root, loadProtectedTerms(root, config));

    // 失敗時把命中位置全部印出來,而不是只說「預期 0 個」
    expect(
      leaks.map((leak) => `${leak.file}:${leak.line} ${leak.kind}「${leak.term}」`),
    ).toEqual([]);
  });

  it('掃描器確實讀到了檔案,不是掃了個空目錄', () => {
    // 用一個必定命中的詞反過來確認掃描範圍是活的:
    // 若掃描器因為路徑錯誤而掃不到任何檔案,上一條會假性通過。
    const leaks = scanProjectContent(root, ['astro']);

    expect(leaks.length).toBeGreaterThan(0);
  });
});
