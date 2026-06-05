// HeroSection — full-viewport landing page with typewriter animation, stats dashboard, and mock code editor
'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandInstagram,
  IconTerminal2,
  IconArrowDown,
  IconFolder,
  IconBrandTypescript,
  IconCoffee,
} from '@tabler/icons-react'

const TYPEWRITER_STRINGS = [
  'Java Backend Developer',
  'AI Agent Engineer',
  'Microservices Builder',
  'Linux Administrator',
  'Agentic Workflow Creator',
]

const JAVA_CODE = `package com.portfolio.controller;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {
  
  private final ProjectService projectService;
  
  @GetMapping
  public ResponseEntity<List<ProjectDTO>> getProjects(
    @RequestParam(required = false) String tag
  ) {
    var data = projectService.getAllByTag(tag);
    return ResponseEntity.ok(data);
  }
}`;

const TSX_CODE = `// components/ProjectsGrid.tsx
import { getProjects, type Project } from '@/lib/api'

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  
  useEffect(() => {
    getProjects().then(setProjects).catch(console.error)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-6">
      {projects.map(p => <Card key={p.id} project={p} />)}
    </div>
  )
}`;

interface HeroSectionProps {
  onOpenTerminal?: () => void
}

export function HeroSection({ onOpenTerminal }: HeroSectionProps) {
  const [displayText, setDisplayText] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState<'java' | 'tsx'>('java')

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = TYPEWRITER_STRINGS[phraseIndex] ?? ''
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.slice(0, charIndex + 1))
          setCharIndex((c) => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentPhrase.slice(0, charIndex - 1))
          setCharIndex((c) => c - 1)
        } else {
          setIsDeleting(false)
          setPhraseIndex((i) => (i + 1) % TYPEWRITER_STRINGS.length)
        }
      }
    }, isDeleting ? 40 : 80)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  const scrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-6 lg:px-16"
      aria-label="Hero section"
    >
      <div className="relative z-10 w-full max-w-screen-2xl grid grid-cols-1 gap-12 lg:grid-cols-12 items-center py-20 lg:py-0">
        
        {/* Left Side: Cinematic Copy */}
        <div className="flex flex-col gap-6 text-left lg:col-span-7">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/5 border border-white/5 px-4 py-1.5 text-xs text-neutral-400 font-mono tracking-wide shadow-inner">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ade80]" />
            ACTIVE WORKSPACE ENVIRONMENT
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-display font-extrabold leading-[1.1] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neutral-500 md:text-5xl lg:text-6xl xl:text-7xl">
              Hey, I&apos;m{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-[var(--accent)] to-white font-black tracking-tight drop-shadow-[0_0_12px_var(--accent-glow)] px-1">
                Krishan
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-80 shadow-[0_0_10px_var(--accent)] animate-pulse z-20" />
              </span>
              , a <br />
              <span className="gradient-text transition-all duration-500" aria-live="polite">
                {displayText}
              </span>
              <span
                className="ml-1.5 inline-block h-[0.9em] w-1 animate-cursor-blink bg-accent align-middle"
                aria-hidden="true"
              />
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-neutral-400 font-medium md:text-base lg:text-lg">
              Aspiring Software Developer specializing in <span className="text-white hover:text-accent cursor-pointer transition-colors">Java Backend Development</span> and <span className="text-white hover:text-emerald-400 cursor-pointer transition-colors">Autonomous AI Agents</span>. Experienced in building Microservices and managing secure RHEL Linux systems.
            </p>
          </div>

          {/* Core Metrics Dashboard */}
          <div className="grid grid-cols-3 gap-4 py-4 max-w-lg border-y border-white/5 font-mono text-center lg:text-left shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] bg-white/[0.01] p-4 rounded-xl border border-white/5">
            <div>
              <div className="text-xl lg:text-2xl font-bold font-display text-white">2025</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">B.Tech CSE</div>
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold font-display text-white">RHCSA</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Red Hat Admin</div>
            </div>
            <div>
              <div className="text-xl lg:text-2xl font-bold font-display text-white">Agentic</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">AI Workflows</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="cta-view-projects"
              onClick={scrollToProjects}
              className="btn-glow text-sm md:text-base font-semibold"
              aria-label="Scroll to projects section"
            >
              Explore Projects
              <IconArrowDown size={18} className="ml-2 inline animate-bounce" aria-hidden="true" />
            </button>

            <button
              id="cta-open-terminal"
              onClick={onOpenTerminal}
              className="btn-ghost flex items-center gap-2 text-sm md:text-base font-semibold"
              aria-label="Toggle interactive terminal shell"
            >
              <IconTerminal2 size={18} aria-hidden="true" className="text-accent animate-pulse" />
              Open Console
            </button>
          </div>

          {/* Social Links */}
          <nav className="flex flex-wrap items-center gap-4 pt-4" aria-label="Social connections">
            {[
              { href: process.env.NEXT_PUBLIC_GITHUB_LINK || 'https://github.com', label: 'GitHub', Icon: IconBrandGithub },
              { href: process.env.NEXT_PUBLIC_LINKEDIN_LINK || 'https://linkedin.com/in/krishan', label: 'LinkedIn', Icon: IconBrandLinkedin },
              { href: process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/yourusername', label: 'Telegram', Icon: IconBrandTelegram },
              { href: process.env.NEXT_PUBLIC_INSTAGRAM_LINK || 'https://instagram.com/yourusername', label: 'Instagram', Icon: IconBrandInstagram },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass glass-hover flex h-11 w-11 items-center justify-center rounded-xl text-neutral-500 hover:text-white hover:scale-105 active:scale-95"
              >
                <Icon size={22} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side: Interactive Mock Code Editor (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5 relative w-full">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-var(--gradient-start) to-var(--gradient-end) opacity-5 blur-2xl pointer-events-none" />
          
          <div className="glass rounded-2xl shadow-2xl border border-white/15 overflow-hidden backdrop-blur-xl relative">
            
            {/* Editor title bar */}
            <div className="flex items-center justify-between bg-black/60 px-4 py-3 border-b border-white/5 select-none relative">
              {/* macOS Traffic Lights (Window Controls) */}
              <div className="flex items-center gap-2 group relative z-10">
                <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] transition-all">
                  <span className="absolute text-[8px] font-bold text-[#4c0002] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none">
                    ×
                  </span>
                </div>
                <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] transition-all">
                  <span className="absolute text-[8px] font-bold text-[#5c3e00] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none -mt-[1px]">
                    -
                  </span>
                </div>
                <div className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] transition-all">
                  <span className="absolute text-[6px] font-bold text-[#024c0e] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none">
                    ✦
                  </span>
                </div>
              </div>

              {/* Centered Title */}
              <span className="absolute left-1/2 -translate-x-1/2 text-xs font-mono text-neutral-500 flex items-center gap-1.5">
                <IconFolder size={14} className="text-accent" /> workspace / portfolio
              </span>

              {/* Spacer */}
              <div className="w-12 h-3" />
            </div>

            {/* Tab selector */}
            <div className="flex bg-black/30 border-b border-white/5 font-mono text-xs text-neutral-400">
              <button
                onClick={() => setActiveTab('java')}
                className={`px-4 py-2.5 flex items-center gap-1.5 border-r border-white/5 transition-colors ${
                  activeTab === 'java' ? 'bg-neutral-900/60 text-emerald-400 font-bold border-t-2 border-t-emerald-400' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <IconCoffee size={14} className="text-emerald-500" />
                ProjectController.java
              </button>
              <button
                onClick={() => setActiveTab('tsx')}
                className={`px-4 py-2.5 flex items-center gap-1.5 border-r border-white/5 transition-colors ${
                  activeTab === 'tsx' ? 'bg-neutral-900/60 text-sky-400 font-bold border-t-2 border-t-sky-400' : 'hover:bg-neutral-950 hover:text-white'
                }`}
              >
                <IconBrandTypescript size={14} className="text-sky-500" />
                ProjectsGrid.tsx
              </button>
            </div>

            {/* Editor window body */}
            <div className="p-5 font-mono text-xs leading-relaxed overflow-x-auto h-72 bg-neutral-950/60 select-text">
              <div className="text-neutral-400 font-mono">
                <div className="w-full">
                  {activeTab === 'java' ? (
                    JAVA_CODE.split('\n').map((line, idx) => (
                      <div key={idx} className="table-row">
                        <span className="table-cell text-right text-neutral-700 select-none pr-4 w-6">{idx + 1}</span>
                        <span
                          className="table-cell whitespace-pre text-left"
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/(@RestController|@RequestMapping|@GetMapping|@RequiredArgsConstructor)/g, '<span class="text-violet-400">$1</span>')
                              .replace(/(package|public|class|private|final|var|return)/g, '<span class="text-pink-400">$1</span>')
                              .replace(/(".*")/g, '<span class="text-emerald-400">$1</span>')
                              .replace(/(ProjectController|ResponseEntity|List|ProjectDTO|String)/g, '<span class="text-amber-300">$1</span>')
                              .replace(/(\/\/.*)/g, '<span class="text-neutral-600">$1</span>')
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    TSX_CODE.split('\n').map((line, idx) => (
                      <div key={idx} className="table-row">
                        <span className="table-cell text-right text-neutral-700 select-none pr-4 w-6">{idx + 1}</span>
                        <span
                          className="table-cell whitespace-pre text-left"
                          dangerouslySetInnerHTML={{
                            __html: line
                              .replace(/(import|export|function|const|let|async|await|return)/g, '<span class="text-pink-400">$1</span>')
                              .replace(/(".*"|'.*')/g, '<span class="text-emerald-400">$1</span>')
                              .replace(/(ProjectsGrid|Project|useEffect|useState|console)/g, '<span class="text-amber-300">$1</span>')
                          }}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Editor status line */}
            <div className="bg-black/60 px-4 py-2 border-t border-white/5 font-mono text-[10px] text-neutral-600 flex justify-between select-none">
              <span>Ln {activeTab === 'java' ? '12, Col 28' : '15, Col 12'}</span>
              <span>UTF-8</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Live Sync Active
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-600"
      >
        <span className="text-[9px] uppercase tracking-[0.2em] font-mono">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-neutral-600 to-transparent animate-bounce" />
      </div>
    </section>
  )
}

export default HeroSection
