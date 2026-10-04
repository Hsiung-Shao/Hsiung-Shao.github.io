export interface GitHubAsset {
  name: string;
  download_count: number;
}

export interface GitHubRelease {
  tag_name: string;
  published_at: string;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets?: GitHubAsset[];
}

export interface ReleaseEntry {
  tag: string;
  publishedAt: string;
  url: string;
  body: string;
}

export interface ToolReleaseSummary {
  downloads: Record<string, number>;
  releaseCount: number;
  recent: ReleaseEntry[];
}

export const RECENT_RELEASE_COUNT: number;
export function classifyAsset(name: string, assetRules: Record<string, string>): string | null;
export function trimReleaseBody(body: string | null | undefined): string;
export function summarizeReleases(releases: GitHubRelease[], assetRules: Record<string, string>): ToolReleaseSummary;
export function mergeSnapshot<T>(previousTools: Record<string, T>, fetchedTools: Record<string, T | null>): Record<string, T>;
