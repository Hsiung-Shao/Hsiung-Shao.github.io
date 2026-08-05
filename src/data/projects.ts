import rawProjects from './projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: 'backend' | 'fullstack' | 'frontend' | 'tool';
  status: 'active' | 'maintained' | 'paused' | 'archived' | 'client';
  visibility: 'public' | 'protected';
  featured: boolean;
  highlights: string[];
  articles: string[];
  link?: string;
}

export const projects = rawProjects as Project[];

export const featuredProjects = projects.filter(project => project.featured);
