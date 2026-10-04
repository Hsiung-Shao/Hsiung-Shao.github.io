export interface LogRangeSelection {
  range: string;
  resetBaseline: boolean;
}

export function selectLogRange(
  sinceSha: string | undefined,
  maxCount: number,
  isBaselineUsable: (sha: string) => boolean,
  head?: string,
): LogRangeSelection;
