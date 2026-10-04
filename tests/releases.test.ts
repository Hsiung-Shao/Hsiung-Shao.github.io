import { describe, expect, it } from 'vitest';

import poeTools from '../src/data/poe-tools.json';
import {
  classifyAsset,
  mergeSnapshot,
  summarizeReleases,
  trimReleaseBody,
  type GitHubRelease,
} from '../scripts/lib/releases.mjs';

// 直接用正式設定檔的規則,檔名取自實際 Release——設定改壞時這裡會先紅。
const rulesFor = (projectId: string) => {
  const tool = poeTools.tools.find(candidate => candidate.projectId === projectId);
  if (!tool) throw new Error(`missing ${projectId}`);
  return Object.fromEntries(Object.entries(tool.assets).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
};

const release = (overrides: Partial<GitHubRelease>): GitHubRelease => ({
  tag_name: 'v1.0.0',
  published_at: '2026-10-01T00:00:00Z',
  html_url: 'https://github.com/example/repo/releases/tag/v1.0.0',
  body: '',
  draft: false,
  prerelease: false,
  assets: [],
  ...overrides,
});

describe('下載數的資產分類', () => {
  it('PobTools 完整包與更新包分開計,manifest 與雜湊檔不計', () => {
    const rules = rulesFor('pobtools');
    expect(classifyAsset('PobTools-1.7.8.zip', rules)).toBe('full');
    expect(classifyAsset('PobTools-Translations-0.18.0.zip', rules)).toBe('full');
    expect(classifyAsset('PobTools-update-1.7.8.zip', rules)).toBe('update');
    expect(classifyAsset('PobTools-manifest-v1.7.8.json', rules)).toBeNull();
    expect(classifyAsset('PobTools-manifest-v1.7.8.json.sig', rules)).toBeNull();
    expect(classifyAsset('SHA256SUMS-1.7.8.txt', rules)).toBeNull();
    expect(classifyAsset('PobTools-Data-16.zip', rules)).toBe('data');
    expect(classifyAsset('PobTools-manifest-data-16.json', rules)).toBeNull();
  });

  it('ExileAppraiser 安裝版與免安裝版合計,更新檢查檔不計', () => {
    const rules = rulesFor('exile-appraiser');
    expect(classifyAsset('ExileAppraiser-Setup-0.1.2.exe', rules)).toBe('combined');
    expect(classifyAsset('ExileAppraiser-0.1.2-portable.exe', rules)).toBe('combined');
    expect(classifyAsset('ExileAppraiser-Setup-0.1.2.exe.blockmap', rules)).toBeNull();
    expect(classifyAsset('latest.yml', rules)).toBeNull();
  });

  it('Poe Market zh 只計 Chrome 與 Firefox 手動安裝包', () => {
    const rules = rulesFor('poe-market-translate');
    expect(classifyAsset('poe-market-zh-329.5.14.zip', rules)).toBe('manual');
    expect(classifyAsset('poe-market-zh-329.5.14-firefox.zip', rules)).toBe('manual');
  });
});

describe('Release 彙總', () => {
  it('prerelease 的下載照算但不列進版本清單,draft 完全排除,版本由新到舊', () => {
    const summary = summarizeReleases([
      release({ tag_name: 'v1.0.0', published_at: '2026-09-01T00:00:00Z', assets: [{ name: 'PobTools-1.0.0.zip', download_count: 10 }] }),
      release({ tag_name: 'data-16', prerelease: true, assets: [
        { name: 'PobTools-Data-16.zip', download_count: 40 },
        { name: 'PobTools-manifest-data-16.json', download_count: 999 },
      ] }),
      release({ tag_name: 'v2.0.0-draft', draft: true, assets: [{ name: 'PobTools-2.0.0.zip', download_count: 999 }] }),
      release({ tag_name: 'v1.1.0', published_at: '2026-09-10T00:00:00Z', assets: [
        { name: 'PobTools-1.1.0.zip', download_count: 5 },
        { name: 'PobTools-update-1.1.0.zip', download_count: 7 },
      ] }),
    ], rulesFor('pobtools'));

    expect(summary.downloads).toEqual({ full: 15, update: 7, data: 40 });
    expect(summary.releaseCount).toBe(2);
    expect(summary.recent.map(entry => entry.tag)).toEqual(['v1.1.0', 'v1.0.0']);
  });

  it('沒有任何符合的資產時,計數是 0 而不是缺欄位', () => {
    expect(summarizeReleases([], rulesFor('pobtools')).downloads).toEqual({ full: 0, update: 0, data: 0 });
  });
});

describe('更新內容裁切', () => {
  it('保留修正/新增/調整,裁掉 SHA-256 與安裝區塊', () => {
    const body = [
      '## 修正', '', '- 修好一個錯', '',
      '## SHA-256', '', '```', 'abc123', '```', '',
      '## 調整', '', '- 改一個設定', '',
      '## 安裝', '', '手動安裝步驟', 'SHA256(Chrome):`deadbeef`',
    ].join('\r\n');

    const trimmed = trimReleaseBody(body);
    expect(trimmed).toContain('修好一個錯');
    expect(trimmed).toContain('改一個設定');
    expect(trimmed).not.toContain('abc123');
    expect(trimmed).not.toContain('手動安裝步驟');
    expect(trimmed).not.toContain('deadbeef');
  });

  it('「・」行首符號轉成 markdown 清單', () => {
    expect(trimReleaseBody('## 新增\n\n・**甲**:說明\n・**乙**:說明')).toBe('## 新增\n\n- **甲**:說明\n- **乙**:說明');
  });

  it('空內文回傳空字串', () => {
    expect(trimReleaseBody(null)).toBe('');
  });
});

describe('快照合併', () => {
  it('抓取失敗的工具保留舊資料,成功的覆蓋', () => {
    const merged = mergeSnapshot(
      { a: { n: 1 }, b: { n: 2 } },
      { a: null, b: { n: 3 }, c: { n: 4 } },
    );
    expect(merged).toEqual({ a: { n: 1 }, b: { n: 3 }, c: { n: 4 } });
  });
});
