import raw from './posts.json';
import multistreamGuide from './guides/multistream-hub-guide.md?raw';
import pobToolsGuide from './guides/pobtools-installation-guide.md?raw';
import poeMarketGuide from './guides/poe-market-zh-guide.md?raw';
import awakenedGuide from './guides/awakened-poe-trade-zh-tw-guide.md?raw';
import minecraftGuide from './guides/minecraft-mod-translation-guide.md?raw';

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
};

export const posts = (raw as BlogPost[]).map(post => ({
  ...post,
  body: guideBodies[post.slug] ?? post.body,
}));
