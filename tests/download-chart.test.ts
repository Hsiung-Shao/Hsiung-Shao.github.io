import { describe, expect, it } from 'vitest';

import { buildDailyBars } from '../scripts/lib/download-chart.mjs';

const DAY = 86_400_000;

function addDays(date: string, n: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);
}

function diffDays(a: string, b: string) {
  return Math.round((Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / DAY);
}

describe('每日新增圖', () => {
  it('每日新增圖跳日時合併成一根', () => {
    const entries = [
      { date: '2026-10-10', full: 100 },
      { date: '2026-10-11', full: 110 },
      { date: '2026-10-14', full: 140 },
    ];
    const result = buildDailyBars(entries, 'full', { days: 30, today: '2026-10-14' })!;
    expect(result.bars).toHaveLength(2);

    const [first, second] = result.bars;
    expect(first.average).toBe(10);
    expect(second).toMatchObject({ prevDate: '2026-10-11', date: '2026-10-14', span: 3, gain: 30, average: 10, width: 3 });
    expect(first.height).toBe(1);
    expect(second.height).toBe(1);
    expect(result.total).toBe(40);
  });

  it('x 與 slots 以天為單位,從第一根的前一天起算', () => {
    const entries = [
      { date: '2026-10-10', full: 100 },
      { date: '2026-10-11', full: 110 },
      { date: '2026-10-14', full: 140 },
    ];
    const result = buildDailyBars(entries, 'full', { days: 30, today: '2026-10-14' })!;
    expect(result.bars.map(b => b.x)).toEqual([0, 1]);
    expect(result.bars[0].width).toBe(1);
    expect(result.slots).toBe(4);
  });

  it('height 以最大日均為 1 按比例縮放,日均為負時當 0', () => {
    const entries = [
      { date: '2026-10-01', full: 100 },
      { date: '2026-10-02', full: 120 },
      { date: '2026-10-03', full: 130 },
      { date: '2026-10-04', full: 125 },
    ];
    const bars = buildDailyBars(entries, 'full', { days: 30, today: '2026-10-04' })!.bars;
    expect(bars.map(b => b.height)).toEqual([1, 0.5, 0]);
  });

  it('全部日均為 0 時 height 為 0 而不是 NaN', () => {
    const entries = [
      { date: '2026-10-01', full: 100 },
      { date: '2026-10-02', full: 100 },
      { date: '2026-10-03', full: 100 },
    ];
    const bars = buildDailyBars(entries, 'full', { days: 30, today: '2026-10-03' })!.bars;
    expect(bars.map(b => b.height)).toEqual([0, 0]);
  });

  it('每日新增圖只取近 30 天', () => {
    const start = '2026-09-01';
    const entries = Array.from({ length: 40 }, (_, i) => ({ date: addDays(start, i), full: 1000 + i }));
    const today = entries[entries.length - 1].date;
    const result = buildDailyBars(entries, 'full', { days: 30, today })!;
    const cutoff = addDays(today, -30);

    expect(result.bars.length).toBeGreaterThan(0);
    expect(result.bars.length).toBeLessThanOrEqual(30);
    expect(result.bars.every(b => diffDays(b.date, cutoff) > 0)).toBe(true);
    expect(result.bars.every(b => b.x >= 0)).toBe(true);
    expect(result.slots).toBeLessThanOrEqual(30);
  });

  it('跨出窗口左緣的合併 bar 截齊在起點,width 只算起點之後的天數', () => {
    // 窗口起點 = 10-14 - 5 = 10-09;最後兩筆之間跳日,第一根的前一筆(10-05)在窗口外
    const entries = [
      { date: '2026-10-05', full: 100 },
      { date: '2026-10-11', full: 160 },
      { date: '2026-10-14', full: 190 },
    ];
    const result = buildDailyBars(entries, 'full', { days: 5, today: '2026-10-14' })!;
    const first = result.bars[0];
    expect(first.date).toBe('2026-10-11');
    expect(first.span).toBe(6);
    expect(first.x).toBe(0);
    expect(first.width).toBe(2);
    expect(result.bars[1].x).toBe(2);
    expect(result.slots).toBe(5);
  });

  it('不足兩筆時回傳 null', () => {
    expect(buildDailyBars([], 'full', { days: 30, today: '2026-10-14' })).toBeNull();
    expect(buildDailyBars([{ date: '2026-10-14', full: 1 }], 'full', { days: 30, today: '2026-10-14' })).toBeNull();
  });

  it('缺欄位的紀錄略過', () => {
    const entries = [
      { date: '2026-10-10', full: 100 },
      { date: '2026-10-11', users: 7000 },
      { date: '2026-10-12', full: 120 },
    ];
    const result = buildDailyBars(entries, 'full', { days: 30, today: '2026-10-12' })!;
    expect(result.bars).toHaveLength(1);
    expect(result.bars[0]).toMatchObject({ prevDate: '2026-10-10', date: '2026-10-12', span: 2, gain: 20, average: 10 });
  });

  it('只剩一筆有欄位時回傳 null', () => {
    const entries = [
      { date: '2026-10-10', full: 100 },
      { date: '2026-10-11', users: 7000 },
    ];
    expect(buildDailyBars(entries, 'full', { days: 30, today: '2026-10-11' })).toBeNull();
  });
});
