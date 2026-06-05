// ProjectCard — glassmorphic card representing individual projects, featuring tilt effects and tag color-coding
'use client'

import Image from 'next/image'
import { IconBrandGithub, IconExternalLink, IconGitPullRequest } from '@tabler/icons-react'
import type { Project } from '@/lib/api'

interface ProjectCardProps {
  project: Project
  animationDelay?: number
}

function getTagColorClass(tag: string): string {
  const t = tag.toLowerCase()
  if (t.includes('spring') || t.includes('java')) return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
  if (t.includes('next.js') || t.includes('react')) return 'text-purple-400 bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10'
  if (t.includes('mongo')) return 'text-teal-400 bg-teal-500/5 border-teal-500/20 hover:bg-teal-500/10'
  if (t === 'kafka') return 'text-orange-400 bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10'
  if (t === 'redis') return 'text-rose-400 bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10'
  if (t === 'docker') return 'text-sky-400 bg-sky-500/5 border-sky-500/20 hover:bg-sky-500/10'
  if (t === 'websockets' || t.includes('socket')) return 'text-cyan-400 bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10'
  if (t === 'typescript') return 'text-blue-400 bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10'
  return 'text-neutral-400 bg-neutral-500/5 border-white/5 hover:bg-neutral-500/10'
}

export function ProjectCard({ project, animationDelay = 0 }: ProjectCardProps) {
  const { title, description, tags, githubUrl, archImageUrl } = project

  return (
    <article
      className="
        glass rounded-2xl p-5 flex flex-col overflow-hidden relative group/card
        border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
        hover:border-accent hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.6),0_0_20px_var(--accent-glow)]
        animate-fade-in-up
      "
      style={{ animationDelay: `${animationDelay}ms` }}
      aria-label={`Project: ${title}`}
    >
      {/* Visual Accent Top Bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* Cover Image/Geometric Fallback */}
      <div className="relative mb-5 h-48 w-full overflow-hidden rounded-xl border border-white/5 shadow-inner">
        {archImageUrl ? (
          <Image
            src={archImageUrl}
            alt={`${title} architecture diagram`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover/card:scale-105"
          />
        ) : (
          /* Premium Geometric CSS wireframe asset */
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#060606] flex items-center justify-center overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute h-24 w-24 rounded-full bg-accent opacity-10 blur-xl group-hover/card:scale-150 transition-transform duration-700" />

            {/* Grid overlay */}
            <div className="absolute inset-0 mesh-grid opacity-30" />
            
            {/* Tech core badge */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-neutral-600 shadow-inner group-hover/card:border-accent/40 group-hover/card:text-accent transition-colors duration-300">
              <IconGitPullRequest size={28} className="transition-transform duration-500 group-hover/card:rotate-12" />
            </div>

            {/* Glowing card border overlay */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] font-bold tracking-widest text-neutral-600 group-hover/card:text-neutral-400 uppercase">
              NODE // {title.split(' ')[0]}
            </div>
          </div>
        )}
        
        {/* Hover overlay sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            background:
              'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.03) 60%, transparent 80%)',
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="flex flex-1 flex-col gap-4">
        
        {/* Title */}
        <h3 className="text-lg font-bold font-display tracking-tight text-white group-hover/card:text-accent transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed text-neutral-400 font-medium">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1" aria-label="Technology tags">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wider border uppercase transition-colors duration-300 font-mono ${getTagColorClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link Row */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/5 mt-auto">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-500 transition-colors duration-300 hover:text-white"
            aria-label={`View ${title} source on GitHub`}
          >
            <IconBrandGithub size={16} aria-hidden="true" />
            SRC_CODE
          </a>
          
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs font-mono font-bold text-accent transition-all duration-300 hover:gap-1.5 hover:text-white"
            aria-label={`Open ${title} live demo`}
          >
            LIVE_DEMO
            <IconExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

      </div>
    </article>
  )
}

export default ProjectCard
