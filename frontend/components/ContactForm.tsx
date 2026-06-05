// ContactForm — controlled form with active glow borders, loader status indicators, and clean glassmorphism styling
'use client'

import { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import { postContact, type ContactRequest } from '@/lib/api'
import { ToastNotification } from './ToastNotification'
import {
  IconSend,
  IconLoader2,
  IconAlertCircle,
  IconPhone,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandLinkedin,
  IconBrandGithub
} from '@tabler/icons-react'

interface FieldErrors {
  name?: string
  email?: string
  message?: string
}

const SOCIAL_CONNECTIONS = [
  {
    name: 'Call Direct',
    icon: IconPhone,
    url: process.env.NEXT_PUBLIC_PHONE_NUMBER || 'tel:+919876543210',
    color: 'hover:text-emerald-400 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  },
  {
    name: 'WhatsApp',
    icon: IconBrandWhatsapp,
    url: process.env.NEXT_PUBLIC_WHATSAPP_LINK || 'https://wa.me/919876543210',
    color: 'hover:text-green-400 hover:border-green-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  {
    name: 'Telegram',
    icon: IconBrandTelegram,
    url: process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/yourusername',
    color: 'hover:text-cyan-400 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  },
  {
    name: 'Instagram',
    icon: IconBrandInstagram,
    url: process.env.NEXT_PUBLIC_INSTAGRAM_LINK || 'https://instagram.com/yourusername',
    color: 'hover:text-pink-400 hover:border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
  },
  {
    name: 'LinkedIn',
    icon: IconBrandLinkedin,
    url: process.env.NEXT_PUBLIC_LINKEDIN_LINK || 'https://linkedin.com/in/yourusername',
    color: 'hover:text-blue-400 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
  {
    name: 'GitHub',
    icon: IconBrandGithub,
    url: process.env.NEXT_PUBLIC_GITHUB_LINK || 'https://github.com/yourusername',
    color: 'hover:text-white hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]',
  },
]

function validateForm(data: ContactRequest): FieldErrors {
  const errors: FieldErrors = {}
  const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
  if (!data.email.trim() || !emailRegex.test(data.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.'
  }

  return errors
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactRequest>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    isVisible: boolean
    type: 'success' | 'error'
    message: string
  }>({ isVisible: false, type: 'success', message: '' })

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }, [])

  const dismissToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const fieldErrors = validateForm(formData)
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
        return
      }

      setIsSubmitting(true)

      try {
        const result = await postContact(formData)

        if (result.error) {
          setToast({ isVisible: true, type: 'error', message: result.error })
        } else {
          setToast({
            isVisible: true,
            type: 'success',
            message: result.data?.message ?? "Message successfully dispatched! I'll get back to you soon. 🚀",
          })
          setFormData({ name: '', email: '', message: '' })
        }
      } catch (err) {
        // postContact handles errors internally, this is a safety fallback
        console.error('ContactForm unexpected error:', err)
        setToast({
          isVisible: true,
          type: 'error',
          message: 'Something went wrong. Please try again.',
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData]
  )

  const inputBase =
    'w-full rounded-xl border bg-black/[0.15] px-4 py-3.5 text-sm text-white placeholder-neutral-600 outline-none transition-all duration-300 focus:bg-black/[0.3] focus:border-accent focus:ring-4 focus:ring-accent/10'

  return (
    <section id="contact" className="section-container" aria-label="Contact section">
      <ToastNotification
        isVisible={toast.isVisible}
        type={toast.type}
        message={toast.message}
        onDismiss={dismissToast}
      />

      <div className="mx-auto max-w-2xl relative">
        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-mono">
            <IconSend size={14} /> Establish connection
          </div>
          <h2 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 md:text-4xl lg:text-6xl">
            Let&apos;s Build Something
          </h2>
          <p className="text-sm text-neutral-400 font-medium md:text-base">
            Have a system in design or need consulting support? Dispatch a message directly to my nodes.
          </p>
        </div>

        {/* Form panel container */}
        <div className="glass rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl relative z-10">
          
          <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
            <div className="flex flex-col gap-6">
              
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                  FULLNAME <span className="text-red-400" aria-label="required">*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`${inputBase} ${
                    errors.name ? 'border-red-500/40 focus:border-red-500 focus:ring-red-500/10' : 'border-white/5'
                  }`}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="text-xs font-mono text-red-400 mt-1 flex items-center gap-1">
                    <IconAlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">
                  EMAIL ADDRESS <span className="text-red-400" aria-label="required">*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@domain.com"
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`${inputBase} ${
                    errors.email ? 'border-red-500/40 focus:border-red-500 focus:ring-red-500/10' : 'border-white/5'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs font-mono text-red-400 mt-1 flex items-center gap-1">
                    <IconAlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest">
                  MESSAGE BODY <span className="text-red-400" aria-label="required">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Summarize your project design parameters..."
                  required
                  rows={5}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={`${inputBase} resize-none ${
                    errors.message ? 'border-red-500/40 focus:border-red-500 focus:ring-red-500/10' : 'border-white/5'
                  }`}
                />
                <div className="flex items-start justify-between mt-1">
                  {errors.message ? (
                    <p id="message-error" role="alert" className="text-xs font-mono text-red-400 flex items-center gap-1">
                      <IconAlertCircle size={12} /> {errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-[10px] font-mono text-neutral-600">
                    {formData.message.length} / 2000
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="btn-glow flex items-center justify-center gap-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 mt-2 font-mono py-4"
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
                    DISPATCHING_PACKETS...
                  </>
                ) : (
                  <>
                    <IconSend size={16} aria-hidden="true" />
                    DISPATCH_MESSAGE
                  </>
                )}
              </button>

            </div>
          </form>

        </div>

        {/* Social Connection Nodes */}
        <div className="mt-6 glass rounded-2xl p-6 border border-white/5 shadow-2xl relative z-10">
          <p className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest text-center mb-4">
            // DIRECT SECURE NODE CHANNELS
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {SOCIAL_CONNECTIONS.map((conn) => {
              const Icon = conn.icon
              return (
                <a
                  key={conn.name}
                  href={conn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2.5 rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-xs font-mono text-neutral-400 transition-all duration-300 w-[calc(50%-6px)] sm:w-auto min-w-[120px] md:min-w-[130px] ${conn.color} hover:-translate-y-0.5 hover:bg-white/[0.02]`}
                >
                  <Icon size={16} />
                  <span>{conn.name}</span>
                </a>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}

export default ContactForm
