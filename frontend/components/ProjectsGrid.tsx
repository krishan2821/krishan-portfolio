// ProjectsGrid — fetches projects with dynamic tag filtering and maps to ProjectCards with delay staggered entries
'use client'

import { useEffect, useState, memo } from 'react'
import { getProjects, type Project } from '@/lib/api'
import { ProjectCard } from './ProjectCard'
import { IconRefresh, IconAdjustmentsHorizontal } from '@tabler/icons-react'

export const ProjectsGrid = memo(function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getProjects(activeTag ?? undefined)
        setProjects(data)
      } catch (err) {
        setError('Failed to load projects. Showing fallbacks.')
        console.error('ProjectsGrid fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchProjects()
  }, [activeTag])

  // Get all unique tags across all projects
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).slice(0, 10)

  return (
    <section id="projects" className="section-container" aria-label="Projects section">
      
      {/* Section Header */}
      <div className="mb-12 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-mono">
          <IconAdjustmentsHorizontal size={14} /> Showcase portfolio
        </div>
        <h2 className="text-3xl font-display font-extrabold heading-gradient md:text-4xl lg:text-6xl">
          Featured Systems
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-neutral-400 font-medium md:text-base">
          Production-grade applications and distributed architecture pipelines engineered with clean code, testing, and modern deployment models.
        </p>
      </div>

      {/* Filter Options */}
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2.5" role="group" aria-label="Filter by technology tag">
          <button
            id="filter-all"
            onClick={() => setActiveTag(null)}
            className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase border transition-all duration-300 ${
              activeTag === null
                ? 'bg-accent/15 border-accent text-white shadow-[0_0_15px_var(--accent-glow)]'
                : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:border-neutral-500 hover:text-white'
            }`}
            aria-pressed={activeTag === null}
          >
            All Systems
          </button>
          
          {allTags.map((tag) => (
            <button
              key={tag}
              id={`filter-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase border transition-all duration-300 ${
                activeTag === tag
                  ? 'bg-accent/15 border-accent text-white shadow-[0_0_15px_var(--accent-glow)]'
                  : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:border-neutral-500 hover:text-white'
              }`}
              aria-pressed={activeTag === tag}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Loading projects"
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass h-[360px] animate-pulse rounded-2xl border border-white/5"
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && projects.length === 0 && (
        <div className="glass flex flex-col items-center gap-5 rounded-2xl p-16 text-center border border-white/5">
          <p className="text-neutral-400 font-mono text-sm">{error}</p>
          <button
            onClick={() => setActiveTag(activeTag)}
            className="btn-ghost flex items-center gap-2 text-xs font-semibold"
          >
            <IconRefresh size={16} aria-hidden="true" />
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="glass flex flex-col items-center gap-5 rounded-2xl p-16 text-center border border-white/5">
          <p className="text-neutral-400 font-mono text-sm">
            No active nodes matched tag: <span className="text-accent">#{activeTag}</span>
          </p>
          <button
            onClick={() => setActiveTag(null)}
            className="text-xs font-mono text-accent hover:underline underline-offset-4"
          >
            Clear Filter Query
          </button>
        </div>
      )}

      {/* Grid rendering cards */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              animationDelay={index * 80}
            />
          ))}
        </div>
      )}

    </section>
  )
})

export default ProjectsGrid
