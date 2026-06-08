// TerminalUI — interactive console supporting theme switching, neofetch spec display, audio cues, and HTML5 canvas matrix rain overlay
'use client'

import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react'
import { IconX, IconMinus, IconTerminal, IconVolume, IconVolumeOff } from '@tabler/icons-react'

interface OutputLine {
  id: number
  content: string
  type: 'output' | 'command' | 'error' | 'info' | 'success'
}

type CommandHandler = () => string[]

const STATIC_COMMANDS: Record<string, CommandHandler> = {
  help: () => [
    '┌─────────────────────────────────────────┐',
    '│             KRISHAN TERMINAL v2.2.0      │',
    '└─────────────────────────────────────────┘',
    '',
    'Available commands:',
    '  help           — Show this command listing',
    '  whoami         — Developer profile credentials',
    '  skills         — Core technical skills audit',
    '  projects       — Query active systems portfolio',
    '  neofetch       — Display system specifications',
    '  theme [name]   — Switch color theme:',
    '                   (monochrome, cyberpunk, emerald, sunset)',
    '  hack           — Penetrate client graphical interface',
    '  scan           — Audit local network ports & services',
    '  decrypt        — Decode mainframe cryptographic hash',
    '  sudo [cmd]     — Run commands with root privileges',
    '  clear          — Wipe console history logs',
    '  reset          — Restores system firewall protocols',
    '',
    'Tips: Use ↑↓ for history, TAB for autocompletion',
  ],
  whoami: () => [
    '',
    '╔══════════════════════════════════════╗',
    '║          Developer Profile           ║',
    '╚══════════════════════════════════════╝',
    '',
    '  Name    :  Krishan Kumar Jangid',
    '  Role    :  Aspiring Software Developer',
    '  Focus   :  Java Backend · Autonomous AI Agents',
    '  Status  :  🟢 Available for hire & innovation',
    '  Location:  Jaipur, Rajasthan, India',
    '  Contact :  +916376534653 · kjangidkj21@gmail.com',
    '  LinkedIn:  linkedin.com/in/krishan',
    '',
    'Building scalable microservices & autonomous workflows.',
    '',
  ],
  skills: () => [
    '',
    '── LANGUAGES & DATABASES ────────────────',
    '  ✦ Java (Core & Advanced) · Python',
    '  ✦ SQL · MongoDB',
    '',
    '── FRAMEWORKS & ARCHITECTURE ────────────',
    '  ✦ Spring Boot · Spring Security',
    '  ✦ RESTful APIs · Microservices',
    '  ✦ Clean Architecture',
    '',
    '── AI & AGENTIC SYSTEMS ──────────────────',
    '  ✦ Autonomous AI Agents',
    '  ✦ Agentic Workflows',
    '',
    '── INFRASTRUCTURE & DEV WORKSPACE ────────',
    '  ✦ Linux (RHCSA Environment)',
    '  ✦ Docker · Kubernetes · GitHub',
    '',
  ],
  projects: () => [
    '',
    '── ACTIVE SYSTEMS REGISTRY ──────────────',
    '',
    '  [1] AntiHomes — AI Smart Living',
    '      Java · Spring Boot · Microservices · MongoDB',
    '',
    '  [2] AcademiaFlow — Admin Automation',
    '      Python · Tkinter · MySQL',
    '',
    '  [3] Event Management System',
    '      Spring Boot · Spring Security · MongoDB',
    '',
    '  Run: window.open("/#projects") to inspect cards',
    '',
  ],
  clear: () => [],
}

interface TerminalUIProps {
  isOpen?: boolean
  isMaximized?: boolean
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

function MatrixRain({ isActive, isCompromised }: { isActive: boolean; isCompromised: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = (canvas.width = canvas.parentElement?.clientWidth ?? 350)
    let height = (canvas.height = canvas.parentElement?.clientHeight ?? 300)

    const columns = Math.floor(width / 10)
    const yPositions = Array(columns).fill(0)

    let animationId: number
    let lastTime = 0
    let isVisible = true  // IntersectionObserver visibility flag

    // Dynamic Frame Rate:
    // - 5 FPS for ambient (REDUCED from 10 — saves ~50% CPU in idle state)
    // - 30 FPS for active matrix
    // - 50 FPS for compromised (breach animation)
    const targetFps = isCompromised ? 50 : (isActive ? 30 : 5)
    const interval = 1000 / targetFps

    const matrix = (time: number) => {
      animationId = requestAnimationFrame(matrix)

      // Pause entirely when canvas is off-screen (terminal scrolled away)
      if (!isVisible || document.hidden) return

      const delta = time - lastTime
      if (delta < interval) return
      lastTime = time - (delta % interval)

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, width, height)

      if (isCompromised) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)'
      } else {
        ctx.fillStyle = isActive ? 'rgba(74, 222, 128, 0.9)' : 'rgba(74, 222, 128, 0.22)'
      }
      ctx.font = '10px monospace'

      yPositions.forEach((y, index) => {
        const text = String.fromCharCode(33 + Math.floor(Math.random() * 93))
        const x = index * 10
        ctx.fillText(text, x, y)

        if (y > 100 + Math.random() * 10000) {
          yPositions[index] = 0
        } else {
          yPositions[index] = y + 12
        }
      })
    }

    animationId = requestAnimationFrame(matrix)

    // IntersectionObserver: fully pause canvas rendering when terminal is off-screen.
    // Chrome cannot optimize rAF loops it doesn't know are invisible.
    const observer = new IntersectionObserver(
      (entries) => { isVisible = entries[0]?.isIntersecting ?? true },
      { threshold: 0.01 }
    )
    observer.observe(canvas)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.parentElement?.clientWidth ?? 350
      height = canvas.height = canvas.parentElement?.clientHeight ?? 300
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [isActive, isCompromised])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-10 pointer-events-none rounded-b-2xl transition-opacity duration-1000 ${
        isCompromised ? 'opacity-[0.85]' : (isActive ? 'opacity-80' : 'opacity-[0.12]')
      }`}
    />
  )
}

export function TerminalUI({
  isOpen = true,
  isMaximized = false,
  onClose,
  onMinimize,
  onMaximize,
}: TerminalUIProps) {
  const [inputValue, setInputValue] = useState('')
  const [outputLines, setOutputLines] = useState<OutputLine[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMatrixActive, setIsMatrixActive] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompromised, setIsCompromised] = useState(false)
  const [isSudoMode, setIsSudoMode] = useState(false)
  const [stats, setStats] = useState({ rtt: 14, cpu: 22 })

  const lineId = useRef(0)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Lazy-initialize or retrieve a single shared AudioContext (fixes browser leakage)
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass()
      }
    }
    return audioCtxRef.current
  }, [])

  // Synthesize terminal retro sound effects using Web Audio API (reusing the context)
  const playBeep = useCallback((freq = 800, duration = 0.05, type: OscillatorType = 'sine') => {
    if (!isSoundEnabled) return
    try {
      const ctx = getAudioContext()
      if (!ctx) return

      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch (e) {
      // Browser audio block
    }
  }, [isSoundEnabled, getAudioContext])

  // Run sequence of simulated hacker outputs with delays
  const runSequence = useCallback((
    lines: { content: string; type: OutputLine['type']; delay: number }[],
    onComplete?: () => void
  ) => {
    setIsProcessing(true)
    let currentIdx = 0

    const printNext = () => {
      if (currentIdx < lines.length) {
        const item = lines[currentIdx]
        if (item) {
          setOutputLines((prev) => [
            ...prev,
            {
              id: lineId.current++,
              content: item.content,
              type: item.type,
            },
          ])

          if (item.type === 'error') {
            playBeep(220, 0.2, 'sawtooth')
          } else if (item.type === 'success') {
            playBeep(900, 0.08, 'sine')
          } else {
            playBeep(450, 0.02, 'sine')
          }

          currentIdx++
          setTimeout(printNext, item.delay)
        }
      } else {
        setIsProcessing(false)
        if (onComplete) onComplete()
      }
    }

    printNext()
  }, [playBeep])

  // Sound preference load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminal-sound')
      if (saved === 'true') {
        setIsSoundEnabled(true)
      }
    }
  }, [])

  const toggleSound = () => {
    const nextVal = !isSoundEnabled
    setIsSoundEnabled(nextVal)
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminal-sound', String(nextVal))
    }
    if (nextVal) {
      // Confirmatory sound cue
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          const ctx = new AudioContextClass()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.frequency.setValueAtTime(600, ctx.currentTime)
          gain.gain.setValueAtTime(0.015, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.1)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.1)
        }
      } catch (e) {}
    }
  }

  // Hacker Boot Diagnostic Sequence on Mount
  useEffect(() => {
    const asciiArt = [
      '  _  __     _     _',
      ' | |/ /_ __(_)___| |__   __ _ _ __',
      " | ' /| '__| / __| '_ \\ / _` | '_ \\",
      " | . \\| |  | \\__ \\ | | | (_| | | | |",
      ' |_|\\_\\_|  |_|___/_| |_|\\__,_|_| |_|',
      ' ===================================',
      '    KRISHAN PORTFOLIO SECURE SHELL v2.2.0   ',
      ' ===================================',
      ''
    ]

    const bootLogs = [
      '⚡ INITIATING SECURE SHELL INTERFACE...',
      '📡 RESOLVING LOCALPORT ROUTERS: 127.0.0.1 -> 8080',
      '🔐 CRYPTO TUNNEL SECURED: AES_256_GCM | LATENCY: 12MS',
      '📂 ACCESSING REPOSITORY: workspace / portfolio',
      '🟢 FIREWALL PROTOCOLS DEACTIVATED SUCCESFULLY.',
      'Krishan Terminal v2.2.0 initialized 🖥️',
      "Type 'help' to audit system capabilities.",
      ''
    ]

    // Print ASCII art instantly
    setOutputLines(
      asciiArt.map((line) => ({
        id: lineId.current++,
        content: line,
        type: 'output' as const
      }))
    )

    // Then animate boot logs
    let logIdx = 0
    const interval = setInterval(() => {
      if (logIdx < bootLogs.length) {
        const line = bootLogs[logIdx]
        setOutputLines((prev) => [
          ...prev,
          {
            id: lineId.current++,
            content: line ?? '',
            type: logIdx === 4 || logIdx === 5 ? 'success' : 'info'
          }
        ])
        logIdx++
      } else {
        clearInterval(interval)
      }
    }, 90)

    return () => clearInterval(interval)
  }, [])

  // Fluctuating status metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const rttDiff = Math.floor(Math.random() * 5) - 2 // -2 to +2
        const nextRtt = Math.max(8, Math.min(35, prev.rtt + rttDiff))

        const cpuDiff = Math.floor(Math.random() * 11) - 5 // -5 to +5
        const nextCpu = Math.max(12, Math.min(88, prev.cpu + cpuDiff))

        return { rtt: nextRtt, cpu: nextCpu }
      })
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll output container
  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
  }, [outputLines])

  // Focus input on load (only on desktop to prevent mobile keyboard popups and iOS zoom bug)
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.matchMedia('(max-width: 1023px)').matches || window.matchMedia('(pointer: coarse)').matches
      if (!isMobile) {
        inputRef.current?.focus()
      }
    }
  }, [isOpen])

  const pushLines = useCallback((lines: string[], type: OutputLine['type'] = 'output') => {
    setOutputLines((prev) => [
      ...prev,
      ...lines.map((content) => ({
        id: lineId.current++,
        content,
        type,
      })),
    ])
  }, [])

  const processCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim()
      const cmd = trimmed.toLowerCase()
      if (!cmd) return

      // Sudo password trap
      if (isSudoMode) {
        pushLines([`[sudo] password for guest: **********`], 'command')
        playBeep(200, 0.25, 'sawtooth')
        pushLines([
          'Error: Access denied. guest is not in the sudoers file. This incident will be reported.'
        ], 'error')
        setIsSudoMode(false)
        return
      }

      // Exit matrix mode on any command
      if (isMatrixActive) {
        setIsMatrixActive(false)
      }

      // Echo command
      pushLines([`❯ ${trimmed}`], 'command')

      // Track history
      setHistory((h) => [trimmed, ...h].slice(0, 50))
      setHistoryIndex(-1)

      if (cmd === 'clear') {
        setOutputLines([])
        return
      }

      if (cmd === 'reset') {
        setIsCompromised(false)
        setIsMatrixActive(false)
        pushLines([
          '🛡️ RE-ESTABLISHING SYSTEM FIREWALL...',
          '🟢 SECURITY INTEGRITY RESTORED SUCCESFULLY.'
        ], 'success')
        playBeep(900, 0.12, 'sine')
        return
      }

      if (cmd.startsWith('sudo')) {
        setIsSudoMode(true)
        pushLines([`[sudo] password for guest: `], 'info')
        return
      }

      // Dynamic theme switching command
      if (cmd.startsWith('theme')) {
        const parts = cmd.split(/\s+/)
        const selectedTheme = parts[1]
        const allowedThemes = ['monochrome', 'cyberpunk', 'emerald', 'sunset']
        if (!selectedTheme) {
          pushLines([
            'Usage: theme [name]',
            'Available themes:',
            '  monochrome  — Classic violet glass layout',
            '  cyberpunk   — Neon rose & cyan styling',
            '  emerald     — Emerald green & amber details',
            '  sunset      — Tangerine & hot pink highlights'
          ], 'info')
          playBeep(600, 0.05)
        } else if (allowedThemes.includes(selectedTheme)) {
          document.documentElement.setAttribute('data-theme', selectedTheme)
          pushLines([`Theme switched to [${selectedTheme}] successfully!`], 'success')
          playBeep(1000, 0.1, 'sine')
        } else {
          pushLines([`Unknown theme: '${selectedTheme}'. Type 'theme' to list options.`], 'error')
          playBeep(250, 0.15, 'triangle')
        }
        return
      }

      // Dynamic hack matrix command
      if (cmd === 'hack') {
        const hackSequence = [
          { content: '⚙️ INITIATING CYBER-DECK PENETRATION FRAMEWORK...', type: 'info' as const, delay: 200 },
          { content: '📡 TARGET ROUTE: localhost:8080 (REST Mainframe)', type: 'info' as const, delay: 250 },
          { content: '🔐 RESOLVING SSL HANDSHAKE PROXY: BYPASSED', type: 'success' as const, delay: 300 },
          { content: '🛡️ DETECTING INTRUSION DEFENSE SHIELDS...', type: 'info' as const, delay: 200 },
          { content: '⚡ BRUTE-FORCING CREDENTIALS REGISTRY...', type: 'info' as const, delay: 450 },
          { content: '🔑 EXPLOITING BUFFER OVERFLOW AT 0x7FFF58B...', type: 'success' as const, delay: 350 },
          { content: '📥 INTRUDING SYSTEM PATHWAYS: [░░░░░░░░░░] 0%', type: 'info' as const, delay: 150 },
          { content: '📥 INTRUDING SYSTEM PATHWAYS: [████░░░░░░] 40%', type: 'info' as const, delay: 150 },
          { content: '📥 INTRUDING SYSTEM PATHWAYS: [████████░░] 80%', type: 'info' as const, delay: 150 },
          { content: '📥 INTRUDING SYSTEM PATHWAYS: [██████████] 100%', type: 'success' as const, delay: 200 },
          { content: '💾 EXFILTRATING LOCAL SOURCE CONFIGS...', type: 'info' as const, delay: 250 },
          { content: '🔓 ACCESS STATE: ROOT UNLOCKED', type: 'success' as const, delay: 200 },
          { content: '🔥 OVERRIDING GRAPHICAL SYSTEM PROTOCOLS...', type: 'error' as const, delay: 300 },
          { content: '☠️ SECURITY INTEGRITY: COMPROMISED', type: 'error' as const, delay: 100 }
        ]
        runSequence(hackSequence, () => {
          setIsCompromised(true)
          setIsMatrixActive(true)
          // Alarm chime
          playBeep(600, 0.08, 'square')
          setTimeout(() => playBeep(850, 0.08, 'square'), 80)
          setTimeout(() => playBeep(1100, 0.15, 'square'), 160)
        })
        return
      }

      // Dynamic scan port command
      if (cmd === 'scan') {
        const scanSequence = [
          { content: '🔍 INITIALIZING PORT SCANNER...', type: 'info' as const, delay: 200 },
          { content: '📡 BROADCASTING ARP REQUESTS...', type: 'info' as const, delay: 250 },
          { content: '🌐 ACTIVE COMPONENT PORTS FOUND:', type: 'success' as const, delay: 300 },
          { content: '  ▸ PORT 22   [SSH]      — STATE: OPEN (RHEL Secure Shell)', type: 'output' as const, delay: 150 },
          { content: '  ▸ PORT 80   [HTTP]     — STATE: OPEN (Auto-Redirect SSL)', type: 'output' as const, delay: 150 },
          { content: '  ▸ PORT 443  [HTTPS]    — STATE: OPEN (Next.js client node)', type: 'output' as const, delay: 150 },
          { content: '  ▸ PORT 8080 [API]      — STATE: OPEN (Spring Boot Java Engine)', type: 'output' as const, delay: 150 },
          { content: '  ▸ PORT 27017[DATABASE] — STATE: OPEN (MongoDB Portfolio Cluster)', type: 'output' as const, delay: 150 },
          { content: '💻 HOST AUDIT: 127.0.0.1 IS SECURED & ACTIVE.', type: 'success' as const, delay: 200 }
        ]
        runSequence(scanSequence, () => {
          playBeep(880, 0.1, 'sine')
        })
        return
      }

      // Dynamic decrypt command
      if (cmd === 'decrypt') {
        const decryptSequence = [
          { content: '🔑 RETRIEVING MAINFRAME SHA-256 SALTED HASH...', type: 'info' as const, delay: 200 },
          { content: '⚡ RUNNING GPU-ACCELERATED BRUTE-FORCE DECRYPT...', type: 'info' as const, delay: 400 },
          { content: '🧬 PATTERN MATCH FOUND: KRISHAN_KEY_HASH', type: 'success' as const, delay: 300 },
          { content: '🔓 DECRYPTING CREDENTIAL DATA LOGS...', type: 'info' as const, delay: 200 },
          { content: '📜 CRACKED MOTTO: "THE BEST WAY TO PREDICT THE FUTURE IS TO CODE IT."', type: 'success' as const, delay: 100 }
        ]
        runSequence(decryptSequence, () => {
          playBeep(880, 0.1, 'sine')
        })
        return
      }

      // Dynamic neofetch command
      if (cmd === 'neofetch') {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'monochrome'
        pushLines([
          '  _____ _____ ____  __  __ ___ _   _    _    _     ',
          ' |_   _| ____|  _ \\|  \\/  |_ _| \\ | |  / \\  | |    ',
          '   | | |  _| | |_) | |\\/| || ||  \\| | / _ \\ | |    ',
          '   | | | |___|  _ <| |  | || || |\\  |/ ___ \\| |___ ',
          '   |_| |_____|_| \\_\\_|  |_|___|_| \\_/_/   \\_\\_____|',
          '',
          `  DEVELOPER : Krishan Kumar Jangid`,
          `  ROLE      : Java Developer & AI Specialist`,
          `  SYSTEM    : idx-workspace-mac-v2.0`,
          `  THEME     : ${currentTheme.toUpperCase()}`,
          `  SHELL     : zsh / krishan-shell`,
          `  DATABASE  : 🟢 MongoDB Atlas (Active)`,
          `  SERVER    : 🟢 Spring Boot API Node (Port 8080)`,
          ''
        ], 'success')
        playBeep(900, 0.1, 'sine')
        return
      }

      // Handle static registry
      const handler = STATIC_COMMANDS[cmd]
      if (handler) {
        pushLines(handler(), 'output')
        playBeep(800, 0.08, 'sine')
      } else {
        pushLines(
          [`Command not resolved: '${cmd}'. Run 'help' to see catalog.`],
          'error'
         )
         playBeep(250, 0.2, 'triangle')
      }
    },
    [pushLines, isMatrixActive, isSudoMode, runSequence, playBeep]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (val.length !== inputValue.length) {
      // Play a click sound on typing, but limit it to character changes
      const clickPitch = 380 + Math.random() * 200
      playBeep(clickPitch, 0.012, 'sine')
    }
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (isProcessing) {
        e.preventDefault()
        return
      }

      if (e.key === 'Enter') {
        processCommand(inputValue)
        setInputValue('')
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (!inputValue) return
        const cmd = inputValue.trim().toLowerCase()
        const matches = ['help', 'whoami', 'skills', 'projects', 'neofetch', 'theme', 'hack', 'scan', 'decrypt', 'sudo', 'clear', 'reset'].filter(
          (c) => c.startsWith(cmd)
        )
        if (matches.length === 1 && matches[0]) {
          setInputValue(matches[0])
          playBeep(800, 0.03, 'sine')
        } else if (matches.length > 1) {
          playBeep(600, 0.05, 'triangle')
          pushLines([`Matches: ${matches.join(', ')}`], 'info')
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const nextIndex = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(nextIndex)
        setInputValue(history[nextIndex] ?? '')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = Math.max(historyIndex - 1, -1)
        setHistoryIndex(nextIndex)
        setInputValue(nextIndex === -1 ? '' : (history[nextIndex] ?? ''))
      }
    },
    [inputValue, processCommand, history, historyIndex, isProcessing, playBeep, pushLines]
  )

  const lineColorMap: Record<OutputLine['type'], string> = {
    output: 'text-[var(--terminal-green)]',
    command: 'text-white font-bold',
    error: 'text-red-400 font-medium',
    info: 'text-sky-400',
    success: 'text-accent',
  }

  // Suggest matches for autocomplete
  const getAutocompleteHint = () => {
    if (!inputValue) return ''
    const cmd = inputValue.trim().toLowerCase()
    const matches = ['help', 'whoami', 'skills', 'projects', 'neofetch', 'theme', 'hack', 'scan', 'decrypt', 'sudo', 'clear', 'reset'].filter(
      (c) => c.startsWith(cmd) && c !== cmd
    )
    return matches.length > 0 ? `Hint: try '${matches.join("' or '")}' or press TAB` : ''
  }

  if (!isOpen) return null

  return (
    <aside
      aria-label="Interactive terminal shell"
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border font-mono text-[10px] sm:text-xs shadow-2xl relative crt-effect transition-all duration-500 ${
        isCompromised
          ? 'border-red-500/35 shadow-[0_0_30px_rgba(239,68,68,0.25)] bg-neutral-950/98'
          : 'border-white/10 bg-neutral-950/98'
      }`}
    >
      {/* Matrix Overlay canvas (Always active background) */}
      <MatrixRain isActive={isMatrixActive} isCompromised={isCompromised} />

      {/* Terminal Title Bar */}
      <div className={`flex items-center justify-between border-b select-none relative z-30 transition-colors duration-500 ${
        isCompromised ? 'border-red-500/20 bg-red-950/30' : 'border-white/5 bg-[#080808]/90'
      }`}>
        {/* macOS Traffic Lights (Window Controls) */}
        <div className="flex items-center gap-2 group relative z-40 px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Close terminal"
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] transition-all active:brightness-90"
          >
            <span className="absolute text-[8px] font-bold text-[#4c0002] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none">
              ×
            </span>
          </button>
          <button
            onClick={onMinimize || onClose}
            aria-label="Minimize terminal"
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] transition-all active:brightness-90"
          >
            <span className="absolute text-[8px] font-bold text-[#5c3e00] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none -mt-[1px]">
              -
            </span>
          </button>
          <button
            onClick={onMaximize}
            aria-label="Maximize terminal"
            className="relative flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] transition-all active:brightness-90"
          >
            <span className="absolute text-[6px] font-bold text-[#024c0e] opacity-0 transition-opacity duration-150 group-hover:opacity-100 leading-none">
              ✦
            </span>
          </button>
        </div>

        {/* Centered Title */}
        <span className={`absolute left-1/2 -translate-x-1/2 text-[10px] flex items-center gap-1.5 font-bold tracking-wider transition-colors duration-500 ${
          isCompromised ? 'text-red-400' : 'text-neutral-500'
        }`}>
          <IconTerminal size={12} className={isCompromised ? 'text-red-500 animate-pulse' : 'text-accent'} />
          {isCompromised ? 'MAINFRAME // BREACHED' : 'KRISHAN // ZSH'}
        </span>

        {/* Audio Toggle Button */}
        <div className="px-4 z-40">
          <button
            onClick={toggleSound}
            className="text-neutral-500 hover:text-white transition-colors flex items-center justify-center p-1 rounded hover:bg-white/5"
            title={isSoundEnabled ? "Mute terminal sound" : "Unmute terminal sound"}
            aria-label="Toggle terminal audio"
          >
            {isSoundEnabled ? (
              <IconVolume size={14} className="text-accent animate-pulse" />
            ) : (
              <IconVolumeOff size={14} className="text-neutral-500" />
            )}
          </button>
        </div>
      </div>

      {/* Shell logs area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 leading-relaxed font-mono relative z-20"
        role="log"
        aria-live="polite"
        aria-label="Terminal outputs"
      >
        {outputLines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line ${lineColorMap[line.type]} mb-1.5 whitespace-pre-wrap break-words`}
          >
            {line.content || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Suggestion hints */}
      {getAutocompleteHint() && (
        <div className="px-4 py-1 text-[10px] text-neutral-600 bg-black/40 border-t border-white/[0.03] select-none italic relative z-20">
          {getAutocompleteHint()}
        </div>
      )}

      {/* Prompt inputs */}
      <div className={`flex items-center gap-2 border-t px-4 py-3 relative z-30 transition-colors duration-500 ${
        isCompromised ? 'border-red-500/20 bg-red-950/10' : 'border-white/5 bg-[#050505]/95'
      }`}>
        <span className={`select-none font-bold transition-colors duration-500 ${
          isCompromised ? 'text-red-500' : 'text-[var(--terminal-green)]'
        }`} aria-hidden="true">
          {isSudoMode ? '#' : '❯'}
        </span>
        <input
          ref={inputRef}
          id="terminal-input"
          type={isSudoMode ? 'password' : 'text'}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder={
            isProcessing
              ? 'RUNNING PROTOCOL...'
              : isSudoMode
                ? 'Enter password...'
                : 'Type a command...'
          }
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          className="flex-1 bg-transparent text-white placeholder-neutral-700 outline-none caret-[var(--terminal-green)] font-mono text-base sm:text-xs disabled:opacity-50"
          aria-label="Terminal input prompt"
        />
        {!isProcessing && (
          <span
            className={`h-3.5 w-1.5 animate-cursor-blink transition-colors duration-500 ${
              isCompromised ? 'bg-red-500' : 'bg-[var(--terminal-green)]'
            }`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Hacker Status Bar */}
      <div className={`border-t border-white/5 bg-[#080808]/90 px-4 py-2.5 select-none flex items-center justify-between text-[9px] font-mono uppercase tracking-widest relative z-30 transition-colors duration-500 ${
        isCompromised ? 'text-red-500/80 border-red-500/20 bg-red-950/20' : 'text-neutral-500'
      }`}>
        <div className="flex items-center gap-4">
          <span className={`flex items-center gap-1.5 font-bold ${isCompromised ? 'text-red-500' : 'text-accent'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isCompromised ? 'bg-red-500 animate-ping' : 'bg-accent animate-ping'}`} />
            {isCompromised ? 'MAIN: COMPROMISED' : 'NODE: ONLINE'}
          </span>
          <span className="hidden sm:inline">RTT: {stats.rtt}MS</span>
          <span className="hidden md:inline">CPU: {stats.cpu}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">PORT: {isCompromised ? 'OVERRIDDEN' : '8080'}</span>
          <span className={isCompromised ? 'text-red-500 font-bold' : 'text-[var(--terminal-green)]'}>
            {isCompromised ? 'ALERT: ACCESS EXPLOITED' : 'SYS: ACTIVE'}
          </span>
        </div>
      </div>
    </aside>
  )
}

export default TerminalUI
