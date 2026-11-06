import type { HistoryEntry } from './download-history.mjs';

export interface ChartBar {
  prevDate: string;
  date: string;
  span: number;
  gain: number;
  average: number;
  /** 以天為單位,距離圖表起點 */
  x: number;
  /** 以天為單位 */
  width: number;
  /** 0~1,相對最大日均 */
  height: number;
}

export function buildDailyBars(
  entries: HistoryEntry[] | undefined,
  key: string,
  options: { days: number; today: string },
): { slots: number; bars: ChartBar[]; total: number } | null;
