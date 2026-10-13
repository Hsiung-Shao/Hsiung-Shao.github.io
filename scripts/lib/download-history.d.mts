export interface HistoryEntry {
  date: string;
  // 各工具欄位不同,同一份歷史裡某些天可能缺某欄
  [key: string]: string | number | undefined;
}

export function taipeiDate(now?: Date): string;
export function upsertDay(entries: HistoryEntry[] | undefined, date: string, values: Record<string, number>): HistoryEntry[];
export function recentGain(entries: HistoryEntry[] | undefined, key: string, days: number, today: string): number | null;
export interface DayGain {
  date: string;
  prevDate: string;
  gain: number;
  span: number;
}
export function dailyGains(entries: HistoryEntry[] | undefined, key: string, days: number, today: string): DayGain[];
export function latestDelta(entries: HistoryEntry[] | undefined, key: string): DayGain | null;
export function parseChromeUsersCsv(text: string): { date: string; users: number }[];
