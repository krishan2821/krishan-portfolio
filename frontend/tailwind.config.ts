// Tailwind CSS configuration with dark mode, glassmorphism utilities, and custom animations
import type { Config } from 'tailwindcss'

const config: Config = {
  /** Enable class-based dark mode toggling */
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /** Custom colour palette for the dark monochrome theme */
      colors: {
        'glass-border': 'rgba(255,255,255,0.12)',
        'glass-surface': 'rgba(255,255,255,0.06)',
        'terminal-green': '#4ade80',
        'terminal-dim': '#166534',
        'accent': '#a78bfa',
        'accent-dim': '#4c1d95',
      },
      /** Custom glassmorphism utilities */
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '24px',
      },
      /** Google Inter font as primary, JetBrains Mono for terminal */
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      /** Custom keyframe animations */
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167,139,250,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(167,139,250,0.35)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'slide-in-right': 'slide-in-right 0.5s ease-out both',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      /** Spacing / sizing tokens */
      spacing: {
        'sidebar': '64px',
        'terminal': '320px',
      },
    },
  },
  plugins: [],
}

export default config
