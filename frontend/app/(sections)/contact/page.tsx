// Contact section route — renders the ContactForm for standalone navigation
import { ContactForm } from '@/components/ContactForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch to discuss your next full-stack project — I reply within 24 hours.',
}

/** Standalone contact section page for direct navigation to /#contact. */
export default function ContactPage() {
  return <ContactForm />
}
