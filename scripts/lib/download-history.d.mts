export interface HistoryEntry {
  date: string;
  [key: string]: string | number;
}

export function taipeiDate(now?: Date): string;
export function upsertDay(entries: HistoryEntry[] | undefined, date: string, values: Record<string, number>): HistoryEntry[];
export function recentGain(entries: HistoryEntry[] | undefined, key: string, days: number, today: string): number | null;
export function parseChromeUsersCsv(text: string): { date: string; users: number }[];
