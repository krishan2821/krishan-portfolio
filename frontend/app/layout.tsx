// Root layout — configures PWA meta tags, global fonts, and the dark-mode HTML shell
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'

/** Google Inter for body text — Variable font for optimal performance */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

/** Google Space Grotesk for cinematic titles and headings */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

/** JetBrains Mono for terminal / code blocks */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

/** SEO metadata including PWA-specific tags */
export const metadata: Metadata = {
  title: {
    default: 'Krishan Kumar Jangid — Java Backend & AI Agent Developer',
    template: '%s | Krishan Kumar Jangid',
  },
  description:
    'Aspiring Software Developer specializing in Java Backend Development and Autonomous AI Agents. Professional portfolio built with Next.js 14, Spring Boot 3, and MongoDB.',
  keywords: ['portfolio', 'Java', 'Spring Boot', 'MongoDB', 'AI Agents', 'RHCSA', 'microservices', 'developer'],
  authors: [{ name: 'Krishan Kumar Jangid' }],
  creator: 'Krishan Kumar Jangid',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Krishan',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Krishan Kumar Jangid — Portfolio',
    description: 'Java Backend & Autonomous AI Agent Developer Portfolio',
    siteName: 'Krishan Kumar Jangid Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishan Kumar Jangid — Portfolio',
    description: 'Java Backend & Autonomous AI Agent Developer Portfolio',
  },
}

/** Viewport config for PWA theme colouring */
export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

/** Root layout wrapping every page with dark HTML shell */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#080808] text-[#f0f0f0] antialiased noise-overlay">
        {children}
      </body>
    </html>
  )
}
