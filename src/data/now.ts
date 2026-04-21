import raw from './now.json';

export interface NowState {
  updated: string;
  focus: string;
  projects: { name: string; tier: 'personal' | 'protected'; status: string }[];
}

export const now = raw as NowState;
