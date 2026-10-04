import raw from './posts.json';
import multistreamGuide from './guides/multistream-hub-guide.md?raw';
import pobToolsGuide from './guides/pobtools-installation-guide.md?raw';
import poeMarketGuide from './guides/poe-market-zh-guide.md?raw';
import awakenedGuide from './guides/awakened-poe-trade-zh-tw-guide.md?raw';
import minecraftGuide from './guides/minecraft-mod-translation-guide.md?raw';
import exileAppraiserGuide from './guides/exile-appraiser-guide.md?raw';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  excerpt: string;
  body: string;
  type?: 'engineering' | 'case-study' | 'retrospective' | 'guide';
  visibility?: 'public' | 'protected';
  project?: string;
}

const guideBodies: Record<string, string> = {
  'multistream-hub-guide': multistreamGuide,
  'pobtools-installation-guide': pobToolsGuide,
  'poe-market-zh-guide': poeMarketGuide,
  'awakened-poe-trade-zh-tw-guide': awakenedGuide,
  'minecraft-mod-translation-guide': minecraftGuide,
  'exile-appraiser-guide': exileAppraiserGuide,
};

// 一般文章的內文放在 articles/<slug>.md,檔名就是 slug;寫 markdown 不用處理 JSON 字串跳脫。
const articleBodies = Object.fromEntries(
  Object.entries(import.meta.glob<string>('./articles/*.md', { query: '?raw', import: 'default', eager: true }))
    .map(([path, body]) => [path.replace(/^\.\/articles\/|\.md$/g, ''), body]),
);

export const posts = (raw as BlogPost[]).map(post => ({
  ...post,
  body: guideBodies[post.slug] ?? articleBodies[post.slug] ?? post.body,
}));

// 開發伺服器上連草稿一起顯示,方便發佈前預覽;正式建置只輸出已發佈的文章。
export const visiblePosts = posts.filter(post => import.meta.env.DEV || !post.draft);
