import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../data/projects';

const categoryColors: Record<string, string> = {
  backend: '#6366f1',
  fullstack: '#8b5cf6',
  frontend: '#22d3ee',
  tool: '#10b981',
};

const categoryLabels: Record<string, string> = {
  backend: 'Backend',
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  tool: 'Tool',
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColors[project.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] backdrop-blur-sm overflow-hidden hover:border-[var(--color-accent-indigo)]/50 transition-all duration-300"
    >
      {/* Category badge */}
      <div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {categoryLabels[project.category]}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 pr-20">
          {project.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="px-2 py-1 text-xs rounded-md bg-[var(--color-bg-primary)]/60 text-[var(--color-text-secondary)] border border-[var(--color-card-border)]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium transition-colors"
            style={{ color }}
          >
            {expanded ? '收起詳情 ▲' : '展開詳情 ▼'}
          </button>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-cyan)] hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[var(--color-card-border)]">
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                  {project.longDescription}
                </p>
                <ul className="space-y-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
    </motion.div>
  );
}
