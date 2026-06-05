// Navbar — responsive navigation layout, fixed sidebar on desktop (collapsible), bottom bar on mobile
'use client'

import { useCallback } from 'react'
import {
  IconHome2,
  IconTerminal2,
  IconBriefcase,
  IconMail,
  IconFileDescription,
  IconAward,
} from '@tabler/icons-react'

interface NavItemConfig {
  id: string
  label: string
  href: string
  iconName: 'home' | 'terminal' | 'briefcase' | 'mail' | 'file' | 'award'
  isExternal?: boolean
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'nav-home', label: 'Home', href: '#hero', iconName: 'home' },
  { id: 'nav-projects', label: 'Projects', href: '#projects', iconName: 'briefcase' },
  { id: 'nav-experience', label: 'Experience', href: '#experience', iconName: 'award' },
  { id: 'nav-contact', label: 'Contact', href: '#contact', iconName: 'mail' },
  { id: 'nav-terminal', label: 'Terminal', href: '#terminal', iconName: 'terminal' },
  { id: 'nav-resume', label: 'Resume', href: '/resume.pdf', iconName: 'file', isExternal: true },
]

function NavIcon({ name }: { name: NavItemConfig['iconName'] }) {
  switch (name) {
    case 'home': return <IconHome2 size={20} aria-hidden="true" />
    case 'terminal': return <IconTerminal2 size={20} aria-hidden="true" />
    case 'briefcase': return <IconBriefcase size={20} aria-hidden="true" />
    case 'mail': return <IconMail size={20} aria-hidden="true" />
    case 'file': return <IconFileDescription size={20} aria-hidden="true" />
    case 'award': return <IconAward size={20} aria-hidden="true" />
  }
}

interface NavbarProps {
  activeSection?: string
  isTerminalOpen?: boolean
  onToggleTerminal?: () => void
}

export function Navbar({ activeSection = 'hero', isTerminalOpen = false, onToggleTerminal }: NavbarProps) {
  const isActive = useCallback(
    (href: string) => href === `#${activeSection}`,
    [activeSection]
  )

  const handleNav = useCallback((href: string, isExternal?: boolean) => {
    if (isExternal) return
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* ── Desktop: Fixed Left Sidebar ─────────────────────────────── */}
      <nav
        aria-label="Desktop navigation sidebar"
        className="
          fixed left-0 top-0 z-40 hidden h-full w-[68px] flex-col items-center border-r border-white/5
          bg-[#050505]/70 py-6 backdrop-blur-xl transition-all duration-300 hover:w-52 group/nav lg:flex
          shadow-[20px_0_40px_rgba(0,0,0,0.8)]
        "
      >
        {/* Profile Avatar with Accent Glow */}
        <div className="relative mb-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover/nav:scale-110 border border-white/10 group-hover/nav:border-accent/40 shadow-lg group-hover/nav:shadow-[0_0_15px_var(--accent-glow)] overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-tr from-var(--gradient-start) to-var(--gradient-end) opacity-20 blur-sm z-0" />
          <img 
            src="/images/profile.jpg" 
            alt="Krishan Kumar" 
            className="h-full w-full object-cover relative z-10 transition-transform duration-500 group-hover/nav:scale-115"
          />
        </div>

        {/* Nav items */}
        <ul className="flex flex-1 flex-col gap-2 px-3 w-full" role="list">
          {NAV_ITEMS.map((item) => {
            const active = item.id === 'nav-terminal' ? isTerminalOpen : isActive(item.href)
            return (
              <li key={item.id} className="relative">
                <a
                  id={item.id}
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  onClick={(e) => {
                    if (item.id === 'nav-terminal') {
                      e.preventDefault()
                      onToggleTerminal?.()
                    } else if (!item.isExternal) {
                      e.preventDefault()
                      handleNav(item.href, item.isExternal)
                    }
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`
                    flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold
                    transition-all duration-300 w-full overflow-hidden relative
                    ${
                      active
                        ? 'bg-white/10 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)]'
                        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className={`flex-shrink-0 transition-transform duration-300 ${active ? 'scale-110 text-accent' : ''}`}>
                    <NavIcon name={item.iconName} />
                  </span>
                  <span
                    className="whitespace-nowrap transition-all duration-300 opacity-0 w-0 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:w-auto group-hover/nav:pointer-events-auto"
                  >
                    {item.label}
                  </span>
                  
                  {/* Glowing active indicator line */}
                  {active && (
                    <div 
                      aria-hidden="true" 
                      className="absolute left-0 top-1/4 h-1/2 w-0.5 rounded-r bg-gradient-to-b from-var(--gradient-start) to-var(--gradient-end) shadow-[0_0_8px_var(--accent)]" 
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Info label */}
        <div
          aria-hidden="true"
          className="mt-auto text-[9px] font-mono tracking-wider text-neutral-600 transition-opacity duration-300 group-hover/nav:text-neutral-400"
        >
          v2.0.0
        </div>
      </nav>

      {/* ── Mobile: Fixed Bottom Bar ─────────────────────────────────── */}
      <nav
        aria-label="Mobile navigation bar"
        className="
          fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/5 
          bg-[#050505]/80 px-3 py-2.5 backdrop-blur-xl lg:hidden shadow-[0_-10px_35px_rgba(0,0,0,0.8)]
        "
      >
        {NAV_ITEMS.map((item) => {
          const active = item.id === 'nav-terminal' ? isTerminalOpen : isActive(item.href)
          return (
            <a
              key={item.id}
              id={`${item.id}-mobile`}
              href={item.href}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (item.id === 'nav-terminal') {
                  e.preventDefault()
                  onToggleTerminal?.()
                } else if (!item.isExternal) {
                  e.preventDefault()
                  handleNav(item.href, item.isExternal)
                }
              }}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
              className={`
                flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-300
                ${
                  active
                    ? 'bg-white/10 text-white shadow-[0_0_12px_-3px_rgba(255,255,255,0.08)]'
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className={active ? 'text-accent' : ''}><NavIcon name={item.iconName} /></span>
              <span className="mt-1 text-[9px] font-medium leading-none tracking-wide">{item.label}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}

export default Navbar
