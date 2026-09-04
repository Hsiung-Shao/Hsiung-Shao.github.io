export interface PolicyProject {
  name: string;
  path?: string;
  tier: string;
  status?: string;
  contentPolicy?: string;
}

export interface PolicyConfig {
  /** loadProtectedTerms 不讀這欄——代號不是識別詞。保留是為了描述整份設定檔。 */
  projects?: PolicyProject[];
  forbiddenTerms?: string[];
  maxCommitsPerRun?: number;
}

export interface Leak {
  term: string;
  line: number;
  kind: string;
}

export interface FileLeak extends Leak {
  file: string;
}

export declare const SCANNED_DIRS: string[];

export declare const LOCAL_TERMS_FILE: string;

export declare function normalizeTerms(rawTerms: string[]): string[];

export declare function loadProtectedTerms(
  root: string,
  config?: PolicyConfig,
  env?: Record<string, string | undefined>,
): string[];

export declare function findLeaks(text: string, terms: string[]): Leak[];

export declare function listTextFiles(dir: string): string[];

export declare function scanProjectContent(
  root: string,
  terms: string[],
  dirs?: string[],
): FileLeak[];

export declare function formatLeaks(leaks: FileLeak[]): string[];
