// Projects section route — renders the full ProjectsGrid for standalone navigation
import { ProjectsGrid } from '@/components/ProjectsGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore production-grade full-stack projects built with Next.js, Spring Boot, and MongoDB.',
}

/** Standalone projects section page for direct navigation to /#projects. */
export default function ProjectsPage() {
  return <ProjectsGrid />
}
