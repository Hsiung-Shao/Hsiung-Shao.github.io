import { describe, expect, it } from 'vitest';

import {
  dailyGains,
  latestDelta,
  parseChromeUsersCsv,
  recentGain,
  taipeiDate,
  upsertDay,
} from '../scripts/lib/download-history.mjs';

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

describe('每日新增', () => {
  it('連續兩天回傳單日新增', () => {
    const entries = [
      { date: '2026-10-12', full: 100 },
      { date: '2026-10-13', full: 130 },
    ];
    expect(dailyGains(entries, 'full', 30, '2026-10-13')).toEqual([
      { date: '2026-10-13', prevDate: '2026-10-12', gain: 30, span: 1 },
    ]);
  });

  it('缺日合併成一筆並標記天數', () => {
    const entries = [
      { date: '2026-10-09', full: 100 },
      { date: '2026-10-12', full: 190 },
    ];
    expect(dailyGains(entries, 'full', 30, '2026-10-13')).toEqual([
      { date: '2026-10-12', prevDate: '2026-10-09', gain: 90, span: 3 },
    ]);
  });

  it('只取近 N 天內的差值', () => {
    // cutoff = 2026-09-13;09-10 那筆差值落在範圍外應被排除
    const entries = [
      { date: '2026-09-03', full: 10 },
      { date: '2026-09-10', full: 20 },
      { date: '2026-09-20', full: 40 },
      { date: '2026-10-13', full: 100 },
    ];
    const gains = dailyGains(entries, 'full', 30, '2026-10-13');
    expect(gains.map(g => g.date)).toEqual(['2026-09-20', '2026-10-13']);
    expect(gains.every(g => g.date >= '2026-09-13')).toBe(true);
    // 範圍外的紀錄仍是範圍內第一筆的前一筆基準
    expect(gains[0]).toEqual({ date: '2026-09-20', prevDate: '2026-09-10', gain: 20, span: 10 });
    expect(gains.at(-1)).toEqual({ date: '2026-10-13', prevDate: '2026-09-20', gain: 60, span: 23 });
  });

  it('缺欄位的紀錄略過', () => {
    const entries = [
      { date: '2026-10-10', full: 100 },
      { date: '2026-10-11', users: 7000 },
      { date: '2026-10-12', full: 150 },
    ];
    expect(dailyGains(entries, 'full', 30, '2026-10-12')).toEqual([
      { date: '2026-10-12', prevDate: '2026-10-10', gain: 50, span: 2 },
    ]);
  });

  it('不足兩筆回傳空陣列', () => {
    expect(dailyGains([{ date: '2026-10-12', full: 100 }], 'full', 30, '2026-10-13')).toEqual([]);
  });

  it('較前日取最後兩筆差與間隔', () => {
    const entries = [
      { date: '2026-10-10', full: 1 },
      { date: '2026-10-11', full: 100 },
      { date: '2026-10-13', full: 140 },
    ];
    expect(latestDelta(entries, 'full')).toEqual({
      date: '2026-10-13',
      prevDate: '2026-10-11',
      gain: 40,
      span: 2,
    });
    expect(latestDelta([{ date: '2026-10-13', full: 140 }], 'full')).toBeNull();
  });

  it('使用者數下降保留負值', () => {
    const entries = [
      { date: '2026-10-01', users: 7266 },
      { date: '2026-10-08', users: 7100 },
    ];
    expect(latestDelta(entries, 'users')?.gain).toBe(-166);
  });
});
