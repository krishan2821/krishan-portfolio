// Hero section route — wraps the HeroSection component for standalone navigation
import { HeroSection } from '@/components/HeroSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Full-stack developer portfolio landing page with animated typewriter and CTA buttons.',
}

/** Standalone hero section page for direct navigation to /#hero. */
export default function HeroPage() {
  return <HeroSection />
}
