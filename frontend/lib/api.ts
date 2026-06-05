// Centralised API client — all fetch() calls to the Spring Boot backend live here
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080'

/** Shape of a project returned from the API */
export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl: string
  archImageUrl: string
  createdAt: string
}

/** Shape of the contact form POST body */
export interface ContactRequest {
  name: string
  email: string
  message: string
}

/** API success/error response envelope */
export interface ApiResponse<T> {
  data?: T
  error?: string
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 'mock-1',
    title: 'AntiHomes — AI Smart Living',
    description: 'Integrated Living-as-a-Service (LaaS) microservices platform automating room renting, laundry, and food mess. Built with Spring Boot, MongoDB Atlas, and autonomous AI agents for automated operational logic.',
    tags: ['Java', 'Spring Boot', 'Microservices', 'MongoDB', 'AI Agents'],
    githubUrl: 'https://github.com',
    archImageUrl: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-2',
    title: 'AcademiaFlow — Student Management',
    description: 'Desktop administrative portal automating school workflow tasks. Engineered with Python, Tkinter UI, and MySQL database caching. Implemented robust role-based data privacy controls.',
    tags: ['Python', 'MySQL', 'SQL Connector'],
    githubUrl: 'https://github.com',
    archImageUrl: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-3',
    title: 'Event Management System',
    description: 'Spring Boot platform hosting custom event sign-ups, registrations, and attendance telemetry. Implemented role-based access authentication with Spring Security and Spring Data MongoDB.',
    tags: ['Spring Boot', 'Spring Security', 'MongoDB', 'REST APIs'],
    githubUrl: 'https://github.com',
    archImageUrl: '',
    createdAt: new Date().toISOString()
  }
]

/**
 * Fetches all projects, optionally filtered by technology tag. Falls back to mock projects if the backend is down.
 *
 * @param tag optional tag to filter by (e.g. "Next.js")
 * @returns array of {@link Project} objects
 */
export async function getProjects(tag?: string): Promise<Project[]> {
  try {
    const url = new URL(`${API_BASE}/api/v1/projects`)
    if (tag) url.searchParams.set('tag', tag)

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 2500) // Fast timeout for immediate fallback

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // ISR — revalidate every 60 seconds
      signal: controller.signal
    })
    clearTimeout(id)

    if (!res.ok) {
      console.warn(`Backend responded with error: ${res.status}. Falling back to mock projects.`)
      return getFilteredMocks(tag)
    }

    const data = await res.json() as Project[]
    return data.length > 0 ? data : getFilteredMocks(tag)
  } catch (err) {
    console.warn('Backend connection failed. Displaying local mock projects.', err)
    return getFilteredMocks(tag)
  }
}

function getFilteredMocks(tag?: string): Project[] {
  if (!tag) return MOCK_PROJECTS
  return MOCK_PROJECTS.filter(p =>
    p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

/**
 * Submits a contact form via the Next.js API route (which proxies to Spring Boot
 * and falls back to a local handler if the backend is unavailable).
 *
 * @param data the contact form payload
 * @returns API response envelope with success message or error
 */
export async function postContact(
  data: ContactRequest
): Promise<ApiResponse<{ message: string }>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const json = await res.json()

    if (!res.ok) {
      return { error: json.error ?? `Server error (${res.status}). Please try again.` }
    }

    return { data: json }
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: 'Request timed out. Please check your connection and try again.' }
    }
    return { error: 'Could not send message. Please try again.' }
  }
}


