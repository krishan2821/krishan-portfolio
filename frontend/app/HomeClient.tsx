// HomeClient — full client-only page component (no SSR to avoid hydration mismatch)
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { HeroSection } from '@/components/HeroSection'
import { TerminalUI } from '@/components/TerminalUI'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { ExperienceSection } from '@/components/ExperienceSection'
import { ContactForm } from '@/components/ContactForm'
import { Navbar } from '@/components/Navbar'
import { IconTerminal2 } from '@tabler/icons-react'

function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.25 }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}

const SECTION_IDS = ['hero', 'projects', 'experience', 'contact']

export default function HomeClient() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false)
  const [mounted, setMounted] = useState(false)

  const activeSection = useActiveSection(SECTION_IDS)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isTransitioningRef = useRef(false)

  // Open terminal on desktop by default after mount, and close it if width drops below desktop threshold
  useEffect(() => {
    setMounted(true)
    let wasDesktop = window.innerWidth >= 1024
    if (wasDesktop) {
      setIsTerminalOpen(true)
    }

    const handleResize = () => {
      const isDesktopNow = window.innerWidth >= 1024
      if (wasDesktop && !isDesktopNow) {
        setIsTerminalOpen(false)
      }
      wasDesktop = isDesktopNow
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Lock body scroll when terminal is open on mobile
  useEffect(() => {
    if (!mounted) return
    const isMobile = window.innerWidth < 1024
    if (isMobile && isTerminalOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isTerminalOpen, mounted])

  // CSS-only blob float animation (replaces JS parallax)
  // Blobs now animate via @keyframes in globals.css — compositor thread handles this,
  // completely bypassing JS main thread during scroll. Chrome stays smooth.
  // Performant direct DOM scroll tracking (Bypasses React re-renders & layout thrashing)
  useEffect(() => {
    if (!mounted) return
    const progressBar = document.getElementById('scroll-progress-bar')
    
    let totalScroll = document.documentElement.scrollHeight - window.innerHeight
    let scrollTimeout: number | null = null

    const handleResize = () => {
      totalScroll = document.documentElement.scrollHeight - window.innerHeight
    }

    const handleScroll = () => {
      if (scrollTimeout) return

      scrollTimeout = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        if (totalScroll > 0 && progressBar) {
          progressBar.style.transform = `scaleX(${currentScrollY / totalScroll})`
        }
        scrollTimeout = null
      })
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout)
    }
  }, [mounted])

  // Advanced mouse-reactive particle constellation animation
  // Optimized for Chrome/Brave: prefers-reduced-motion check, HiDPI scaling,
  // reduced O(n²) connection radius, tab visibility pause
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Skip entire animation if user prefers reduced motion (also saves battery)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isScrolledOut = false
    let isTabHidden = false
    const isInputFocused = { current: false }

    // Mouse state — tracks position and click ripples
    const mouse = { x: -9999, y: -9999 }
    const REPEL_RADIUS = 140      // particles flee within this distance
    const CONNECT_RADIUS = 120    // REDUCED from 160: fewer O(n²) pairs to check
    const MOUSE_CONNECT_RADIUS = 200  // REDUCED from 220

    // Ripple rings spawned on click
    const ripples: Array<{ x: number; y: number; r: number; alpha: number }> = []

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const handleMouseLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const handleClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, alpha: 0.8 })
    }
    // Tab visibility: pause animation when tab is hidden (Chrome throttles anyway,
    // but being explicit ensures zero CPU waste when background)
    const handleVisibilityChange = () => {
      isTabHidden = document.hidden
    }
    const handleFocusIn = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        isInputFocused.current = true
      }
    }
    const handleFocusOut = () => {
      isInputFocused.current = false
    }

    // Also pause canvas on ANY pointer interaction (click, hover activate, touchstart)
    // This frees the GPU for CSS transitions and layout during user interactions
    let pointerPauseTimer: ReturnType<typeof setTimeout> | null = null
    const pauseForPointer = () => {
      isInputFocused.current = true
      if (pointerPauseTimer) clearTimeout(pointerPauseTimer)
      pointerPauseTimer = setTimeout(() => {
        isInputFocused.current = false
        pointerPauseTimer = null
      }, 150)  // Resume 150ms after last pointer event
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('click', handleClick)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)
    // Pause canvas on any pointer/touch interaction to free GPU for CSS transitions
    window.addEventListener('pointerdown', pauseForPointer)
    window.addEventListener('touchstart', pauseForPointer, { passive: true })

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const handleScroll = () => {
      isScrolledOut = window.scrollY > window.innerHeight
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Particle color palette — violet, cyan, emerald, white
    const COLORS = [
      { r: 167, g: 139, b: 250 },  // violet #a78bfa
      { r: 6, g: 182, b: 212 },  // cyan   #06b6d4
      { r: 74, g: 222, b: 128 },  // emerald #4ade80
      { r: 255, g: 255, b: 255 },  // white
      { r: 255, g: 255, b: 255 },  // white (higher weight)
    ]

    const dprScale = window.devicePixelRatio > 1.5 ? 0.7 : 1
    const particleCount = Math.min(
      Math.floor((width * height) / 24000 * dprScale),
      22  // Hard cap reduced to 22 for extreme performance optimization
    )

    interface Particle {
      x: number; y: number
      vx: number; vy: number
      baseVx: number; baseVy: number
      radius: number
      color: { r: number; g: number; b: number }
      alpha: number
      pulse: number      // phase for size pulse
      pulseSpeed: number
      mouseDistSq?: number
    }

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]!
      const spd = (Math.random() - 0.5) * 0.5
      const vx = spd, vy = (Math.random() - 0.5) * 0.5
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx, vy,
        baseVx: vx, baseVy: vy,
        radius: Math.random() * 2.2 + 0.8,
        color,
        alpha: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      })
    }

    let lastTime = 0
    const fpsInterval = 1000 / 40 // Capped at 40 FPS for ultra-efficient render

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw)

      // Pause rendering if scrolled out of view, tab hidden, inputs focused, or panel transitioning
      if (isScrolledOut || isTabHidden || document.hidden || isInputFocused.current || isTransitioningRef.current) {
        return
      }

      const elapsed = timestamp - lastTime
      if (elapsed < fpsInterval) return

      lastTime = timestamp - (elapsed % fpsInterval)

      ctx.clearRect(0, 0, width, height)

      // ── 1. Draw cursor glow aura ─────────────────────────────────────────
      if (mouse.x > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, REPEL_RADIUS)
        grad.addColorStop(0, 'rgba(167,139,250,0.07)')
        grad.addColorStop(0.5, 'rgba(6,182,212,0.03)')
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, REPEL_RADIUS, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // ── 2. Update & draw particles ────────────────────────────────────
      particles.forEach((p) => {
        // Pulse radius
        p.pulse += p.pulseSpeed
        const displayR = p.radius + Math.sin(p.pulse) * 0.5

        // Mouse repulsion force
        const mdx = p.x - mouse.x
        const mdy = p.y - mouse.y
        const mdistSq = mdx * mdx + mdy * mdy
        p.mouseDistSq = mdistSq
        const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS
        let mdist = 9999

        if (mdistSq < REPEL_RADIUS_SQ && mdistSq > 0) {
          mdist = Math.sqrt(mdistSq)
          const force = (REPEL_RADIUS - mdist) / REPEL_RADIUS
          const angle = Math.atan2(mdy, mdx)
          p.vx += Math.cos(angle) * force * 0.8
          p.vy += Math.sin(angle) * force * 0.8
        }

        // Dampen back to base velocity gently
        p.vx += (p.baseVx - p.vx) * 0.02
        p.vy += (p.baseVy - p.vy) * 0.02

        // Speed cap
        const speedSq = p.vx * p.vx + p.vy * p.vy
        if (speedSq > 16) {
          const speed = Math.sqrt(speedSq)
          p.vx = (p.vx / speed) * 4
          p.vy = (p.vy / speed) * 4
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap around
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Proximity to mouse boost alpha + glow
        if (mdist === 9999) {
          mdist = Math.sqrt(mdistSq)
        }
        const mouseProx = Math.max(0, 1 - mdist / MOUSE_CONNECT_RADIUS)
        const alpha = Math.min(1, p.alpha + mouseProx * 0.5)

        // Outer glow on close particles (Optimized to square fillRect)
        if (mouseProx > 0.3) {
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${mouseProx * 0.12})`
          const glowSize = displayR * 5
          ctx.fillRect(p.x - glowSize / 2, p.y - glowSize / 2, glowSize, glowSize)
        }

        // Main dot (Optimized to square fillRect)
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`
        const dotSize = displayR * 2
        ctx.fillRect(p.x - dotSize / 2, p.y - dotSize / 2, dotSize, dotSize)
      })

      const CONNECT_RADIUS_SQ = CONNECT_RADIUS * CONNECT_RADIUS
      const MOUSE_CONNECT_RADIUS_SQ = MOUSE_CONNECT_RADIUS * MOUSE_CONNECT_RADIUS

      // ── 3. Draw particle-to-particle connections ────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i]!, pj = particles[j]!
          const dx = pi.x - pj.x
          const dy = pi.y - pj.y
          const distSq = dx * dx + dy * dy

          if (distSq < CONNECT_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            const t = 1 - dist / CONNECT_RADIUS
            // Check if either particle is near mouse for color boost (using cached mouseDistSq)
            const miDistSq = pi.mouseDistSq ?? 999999
            const mjDistSq = pj.mouseDistSq ?? 999999
            const nearMouse = Math.min(miDistSq, mjDistSq) < MOUSE_CONNECT_RADIUS_SQ

            if (nearMouse) {
              // Colored glowing line near mouse
              const c = pi.color
              ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${t * 0.4})`
              ctx.lineWidth = t * 1.5
            } else {
              ctx.strokeStyle = `rgba(255,255,255,${t * 0.06})`
              ctx.lineWidth = 0.5
            }

            ctx.beginPath()
            ctx.moveTo(pi.x, pi.y)
            ctx.lineTo(pj.x, pj.y)
            ctx.stroke()
          }
        }
      }

      // ── 4. Draw mouse → particle connections ───────────────────────
      if (mouse.x > 0) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < MOUSE_CONNECT_RADIUS_SQ) {
            const dist = Math.sqrt(distSq)
            const t = 1 - dist / MOUSE_CONNECT_RADIUS
            const c = p.color
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${t * 0.5})`
            ctx.lineWidth = t * 1.2
            ctx.stroke()
          }
        })

        // Mouse dot
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(167,139,250,0.8)'
        ctx.fill()
      }

      // ── 5. Animate click ripples ───────────────────────────────────
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rpl = ripples[i]!
        rpl.r += 4
        rpl.alpha -= 0.02
        if (rpl.alpha <= 0) { ripples.splice(i, 1); continue }

        ctx.beginPath()
        ctx.arc(rpl.x, rpl.y, rpl.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(167,139,250,${rpl.alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Second ring (cyan)
        ctx.beginPath()
        ctx.arc(rpl.x, rpl.y, rpl.r * 0.6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6,182,212,${rpl.alpha * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

    }

    draw(0)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
      window.removeEventListener('pointerdown', pauseForPointer)
      window.removeEventListener('touchstart', pauseForPointer)
      if (pointerPauseTimer) clearTimeout(pointerPauseTimer)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted])

  // Scroll reveal IntersectionObserver handler
  // will-change is set dynamically: only while element is actively animating
  // (set on enter, removed after transition ends). This prevents Chrome from
  // keeping too many elements as promoted GPU layers simultaneously.
  useEffect(() => {
    if (!mounted) return
    const revealElements = document.querySelectorAll('.reveal-on-scroll')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            // Set will-change just before the transition starts
            el.classList.add('is-revealing')
            el.classList.add('revealed')
            // Remove will-change after animation completes (0.9s from CSS)
            setTimeout(() => {
              el.classList.remove('is-revealing')
            }, 950)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    revealElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [mounted])

  const toggleTerminal = useCallback(() => {
    isTransitioningRef.current = true
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 600)
    setIsTerminalOpen((prev) => !prev)
  }, [])
  const closeTerminal = useCallback(() => {
    isTransitioningRef.current = true
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 600)
    setIsTerminalOpen(false)
  }, [])
  const toggleMaximizeTerminal = useCallback(() => {
    isTransitioningRef.current = true
    setTimeout(() => {
      isTransitioningRef.current = false
    }, 600)
    setIsTerminalMaximized((prev) => !prev)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative bg-[#030303] overflow-x-hidden">
      {/* ── Scroll Progress Bar ───────────────────────────────────────── */}
      <div 
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] z-50 origin-left transition-transform duration-75 shadow-[0_0_8px_var(--accent)]" 
        style={{ transform: 'scaleX(0)' }} 
      />

      {/* ── Background Cinematic Assets ───────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Dynamic Canvas Particles */}
        <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

        {/* Mesh grid layout pattern (CSS-only, no JS parallax) */}
        <div 
          id="bg-mesh"
          className="absolute inset-0 mesh-grid opacity-60" 
        />

        {/* Floating gradient blur blobs — CSS @keyframes float animation.
            Removed JS parallax transform: Chrome re-blurs filter:blur on every
            scroll event. CSS keyframes run on compositor thread (no re-blur). */}
        <div 
          id="blob-1"
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#a78bfa] blob-glow blob-float-1 opacity-[0.06]" 
        />
        <div 
          id="blob-2"
          className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-[#06b6d4] blob-glow blob-float-2 opacity-[0.05]" 
        />
        <div 
          id="blob-3"
          className="absolute -right-20 bottom-10 h-[500px] w-[500px] rounded-full bg-accent blob-glow blob-float-3 opacity-[0.04]" 
        />
      </div>

      {/* Navigation */}
      <Navbar activeSection={activeSection} isTerminalOpen={isTerminalOpen} onToggleTerminal={toggleTerminal} />

      {/* ── Desktop split-pane layout ─────────────────────────────────── */}
      <div className="lg:pl-[68px] relative z-10">
        <div className="flex min-h-screen">
          {/* Left collapsible pane — TerminalUI (desktop, fixed layout) */}
          <aside
            aria-label="Terminal panel"
            className={`
              hidden lg:flex lg:flex-col fixed left-[68px] top-0 h-screen p-5 z-20
              transition-all duration-500 ease-in-out
              ${isTerminalOpen ? (isTerminalMaximized ? 'w-[750px]' : 'w-[380px]') : 'w-0 opacity-0 overflow-hidden p-0'}
            `}
          >
            <TerminalUI
              isOpen={true}
              isMaximized={isTerminalMaximized}
              onClose={closeTerminal}
              onMinimize={closeTerminal}
              onMaximize={toggleMaximizeTerminal}
            />
          </aside>

          {/* Right main content pane */}
          <main
            id="main-content"
            className={`
              flex-1 min-w-0 pb-24 lg:pb-0 transition-all duration-500 ease-in-out
              ${isTerminalOpen ? (isTerminalMaximized ? 'lg:pl-[750px]' : 'lg:pl-[380px]') : 'lg:pl-0'}
            `}
            aria-label="Main content"
          >
            {/* Hero Section */}
            <div className="reveal-on-scroll">
              <HeroSection onOpenTerminal={toggleTerminal} />
            </div>

            {/* Divider */}
            <div aria-hidden="true" className="mx-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Projects Section */}
            <div className="reveal-on-scroll">
              <ProjectsGrid />
            </div>

            {/* Divider */}
            <div aria-hidden="true" className="mx-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Experience Section */}
            <div className="reveal-on-scroll">
              <ExperienceSection />
            </div>

            {/* Divider */}
            <div aria-hidden="true" className="mx-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Contact Section */}
            <div className="reveal-on-scroll">
              <ContactForm />
            </div>

            {/* Footer */}
            <footer className="px-12 py-12 text-center text-xs font-mono text-neutral-600 border-t border-white/5">
              <p>
                Built with{' '}
                <span className="text-[#a78bfa] hover:underline cursor-pointer">Next.js 14</span> &amp;{' '}
                <span className="text-emerald-400 hover:underline cursor-pointer">Spring Boot 3</span> — Deployed as PWA
              </p>
              <p className="mt-2 text-[10px] text-neutral-700">© {new Date().getFullYear()} Krishan Kumar Jangid. All rights reserved.</p>
            </footer>
          </main>
        </div>
      </div>

      {/* ── Mobile terminal overlay ──────────────────────────────────── */}
      {isTerminalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Terminal overlay"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-md lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTerminal()
          }}
        >
          <div className={`w-full max-w-full min-w-0 p-4 transform transition-all duration-300 ${isTerminalMaximized ? 'h-[92vh]' : 'h-[75vh]'}`}>
            <TerminalUI
              isOpen={true}
              isMaximized={isTerminalMaximized}
              onClose={closeTerminal}
              onMinimize={closeTerminal}
              onMaximize={toggleMaximizeTerminal}
            />
          </div>
        </div>
      )}

      {/* Mobile floating terminal toggle button (shows if terminal closed) */}
      {!isTerminalOpen && (
        <button
          id="mobile-terminal-toggle"
          onClick={toggleTerminal}
          aria-label="Open terminal"
          className="
            fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center
            rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95
            btn-glow text-white lg:hidden
          "
        >
          <IconTerminal2 size={24} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
