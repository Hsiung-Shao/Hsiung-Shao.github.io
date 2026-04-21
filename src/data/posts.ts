import raw from './posts.json';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  excerpt: string;
  body: string;
  project?: string;
}

export const posts = raw as BlogPost[];
