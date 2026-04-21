import raw from './activity.json';

export interface ActivityEntry {
  date: string;
  project: string;
  tier: 'personal' | 'protected';
  summary: string;
  tags?: string[];
  link?: string;
}

export const activity = raw as ActivityEntry[];
