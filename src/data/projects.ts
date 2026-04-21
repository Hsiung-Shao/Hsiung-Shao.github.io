import rawProjects from './projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  category: 'backend' | 'fullstack' | 'frontend' | 'tool';
  highlights: string[];
  link?: string;
}

export const projects = rawProjects as Project[];

export const featuredProjects = projects.slice(0, 3);
