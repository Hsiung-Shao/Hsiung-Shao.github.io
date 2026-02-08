import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { featuredProjects } from '../../data/projects';

export default function FeaturedProjects() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">精選專案</h2>
        <p className="text-[var(--color-text-secondary)]">近期的重點作品</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-cyan)] hover:underline"
        >
          查看所有專案
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
