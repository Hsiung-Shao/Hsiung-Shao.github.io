import { describe, expect, it } from 'vitest';

import { parseChromeUsersCsv, recentGain, taipeiDate, upsertDay } from '../scripts/lib/download-history.mjs';

describe('下載數歷史', () => {
  it('台灣時間早上 8 點記成當天,不是 UTC 的前一天', () => {
    expect(taipeiDate(new Date('2026-10-05T00:00:00Z'))).toBe('2026-10-05');
    expect(taipeiDate(new Date('2026-10-04T15:59:00Z'))).toBe('2026-10-04');
  });

  it('同一天重寫是冪等的,並保留其他欄位', () => {
    const once = upsertDay([{ date: '2026-10-01', users: 7193 }], '2026-10-01', { manual: 629 });
    const twice = upsertDay(once, '2026-10-01', { manual: 629 });
    expect(twice).toEqual([{ date: '2026-10-01', users: 7193, manual: 629 }]);
  });

  it('新的一天依日期插入,不修改傳入的陣列', () => {
    const original = [{ date: '2026-10-05', full: 2 }];
    const next = upsertDay(original, '2026-10-04', { full: 1 });
    expect(next.map(entry => entry.date)).toEqual(['2026-10-04', '2026-10-05']);
    expect(original).toHaveLength(1);
  });

  it('近 N 天新增 = 最後一筆減掉 N 天前最近的一筆', () => {
    const entries = [
      { date: '2026-09-25', full: 100 },
      { date: '2026-09-28', full: 130 },
      { date: '2026-10-05', full: 200 },
    ];
    expect(recentGain(entries, 'full', 7, '2026-10-05')).toBe(70);
  });

  it('資料不足兩筆時回傳 null,讓頁面顯示累積中', () => {
    expect(recentGain([{ date: '2026-10-04', full: 10 }], 'full', 7, '2026-10-04')).toBeNull();
    expect(recentGain([{ date: '2026-10-04', users: 1 }], 'full', 7, '2026-10-04')).toBeNull();
  });
});

describe('Chrome 每週使用者 CSV', () => {
  it('日期補零、0 值缺口略過、標題列忽略', () => {
    const csv = '每週使用者人數\r\n日期,每週使用者人數\r\n2026/9/3,5268\r\n2026/9/23,0\r\n2026/10/1,7193\r\n';
    expect(parseChromeUsersCsv(csv)).toEqual([
      { date: '2026-09-03', users: 5268 },
      { date: '2026-10-01', users: 7193 },
    ]);
  });
});
