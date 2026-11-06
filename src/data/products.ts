import type { ImageMetadata } from 'astro';
import rawProducts from './products.json';
import poeTools from './poe-tools.json';
import releaseSnapshot from './releases.json';
import type { ToolReleaseSummary } from '../../scripts/lib/releases.mjs';

export interface ProductSection {
  id: string;
  kicker?: string;
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  cards?: { tag?: string; title: string; body: string }[];
  bullets?: string[];
  steps?: string[];
  table?: { columns: string[]; rows: string[][] };
}

export interface ProductStatSource {
  source: 'downloads' | 'manual' | 'static' | 'releases' | 'songs';
  key?: string;
  value?: string;
  label: string;
}

export interface Song {
  title: string;
  date: string;
  youtubeId: string;
  tag: string;
}

export interface Product {
  slug: string;
  projectId: string;
  name: string;
  accent: string;
  release?: boolean;
  hero: { kicker: string; title: string; titleKey?: string; lede: string; chips?: string[]; image?: string; imageAlt?: string; wide?: boolean };
  ctas: { label: string; href: string; primary?: boolean }[];
  stats: ProductStatSource[];
  sections: ProductSection[];
  songs?: Song[];
  limits: string[];
  links?: { label: string; href: string }[];
  closing: string;
  disclaimer: string;
}

export const products = rawProducts as Product[];

type Snapshot = ToolReleaseSummary & { fetchedAt: string };
const snapshots = releaseSnapshot.tools as Record<string, Snapshot>;
const tools = poeTools.tools as { projectId: string; manual?: Record<string, { value: number | null; asOf: string | null }> }[];

export const snapshotFor = (projectId: string): Snapshot | undefined => snapshots[projectId];

export const formatCount = (value: number | null | undefined) => (typeof value === 'number' ? value.toLocaleString('zh-TW') : null);

const taipeiDay = (iso: string) => new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' });
export const snapshotDate = (projectId: string) => {
  const snapshot = snapshotFor(projectId);
  return snapshot ? taipeiDay(snapshot.fetchedAt) : null;
};
export const releaseDate = (iso: string) => taipeiDay(iso);

export interface ResolvedStat {
  value: string | null;
  label: string;
}

/** 數字口徑和 /downloads 一致:下載數取 releases 快照、人工數字標上日期,取不到時顯示「待更新」 */
export function resolveStats(product: Product): ResolvedStat[] {
  const snapshot = snapshotFor(product.projectId);
  const manual = tools.find(tool => tool.projectId === product.projectId)?.manual ?? {};
  return product.stats.map(stat => {
    switch (stat.source) {
      case 'downloads':
        return { value: formatCount(snapshot?.downloads[stat.key!]), label: stat.label };
      case 'manual': {
        const entry = manual[stat.key!];
        return { value: formatCount(entry?.value), label: entry?.asOf ? `${stat.label}（${entry.asOf.slice(5)}）` : stat.label };
      }
      case 'releases':
        return { value: formatCount(snapshot?.releaseCount), label: stat.label };
      case 'songs':
        return { value: formatCount(product.songs?.length ?? 0), label: stat.label };
      default:
        return { value: stat.value ?? null, label: stat.label };
    }
  });
}

// 截圖放在 src/assets/products/<slug>/,交給 astro:assets 轉檔。副檔名要和 scripts/lib/products.mjs 一致
const imageModules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/products/**/*.{png,jpg,webp}', { eager: true });
export const productImages: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => [path.replace('/src/assets/products/', ''), module.default]),
);

export function imageFor(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  const image = productImages[path];
  if (!image) throw new Error(`找不到截圖 src/assets/products/${path}`);
  return image;
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
