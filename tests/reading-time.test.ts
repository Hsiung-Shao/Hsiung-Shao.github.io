import { describe, expect, it } from 'vitest';

import { readingMinutes } from '../scripts/lib/reading-time.mjs';

const zh = (n: number) => '中'.repeat(n);
const enWords = (n: number) => Array.from({ length: n }, () => 'word').join(' ');

describe('閱讀時間估算', () => {
  it('純中文 800 字回傳 2 分鐘', () => {
    expect(readingMinutes(zh(800))).toBe(2);
  });

  it('中文只有 50 字時最少回傳 1 分鐘', () => {
    expect(readingMinutes(zh(50))).toBe(1);
  });

  it('英文 400 個單字依每分鐘 200 個回傳 2 分鐘', () => {
    expect(readingMinutes(enWords(400))).toBe(2);
  });

  it('程式碼區塊內的 2000 個單字不計入，回傳 1 分鐘', () => {
    const md = `${zh(400)}\n\n\`\`\`js\n${enWords(2000)}\n\`\`\`\n`;
    expect(readingMinutes(md)).toBe(1);
  });

  it('連結只算文字、網址不算，回傳 2 分鐘', () => {
    const link = '[中](https://example.com/aaaa/bbbb/cccc)';
    const md = `${zh(400)}\n\n${link.repeat(300)}`;
    expect(readingMinutes(md)).toBe(2);
  });

  it('空字串回傳 1 分鐘', () => {
    expect(readingMinutes('')).toBe(1);
  });

  it('圖片語法整個不算字，回傳 1 分鐘', () => {
    const img = '![說明文字很長很長](https://x.com/a.png)';
    const md = `${zh(400)}\n\n${img.repeat(300)}`;
    expect(readingMinutes(md)).toBe(1);
  });
});
