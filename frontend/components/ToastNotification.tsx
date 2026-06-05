'use client'
// ToastNotification — auto-dismissing success/error toast displayed after form actions
import { useEffect, useRef } from 'react'
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react'

export interface ToastProps {
  /** Toast visibility state */
  isVisible: boolean
  /** Toast variant controlling colour and icon */
  type: 'success' | 'error'
  /** Message text to display */
  message: string
  /** Called when the toast should be dismissed */
  onDismiss: () => void
  /** Auto-dismiss delay in ms (default 4000) */
  duration?: number
}

/** Auto-dismissing toast notification with slide-in animation and manual close. */
export function ToastNotification({
  isVisible,
  type,
  message,
  onDismiss,
  duration = 4000,
}: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /** Sets up auto-dismiss timer whenever the toast becomes visible */
  useEffect(() => {
    if (!isVisible) return

    timerRef.current = setTimeout(onDismiss, duration)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isVisible, onDismiss, duration])

  if (!isVisible) return null

  const variantStyles = {
    success: {
      container: 'border-green-500/30 bg-[#0d1f14]',
      icon: 'text-green-400',
      IconComponent: IconCheck,
    },
    error: {
      container: 'border-red-500/30 bg-[#1f0d0d]',
      icon: 'text-red-400',
      IconComponent: IconAlertCircle,
    },
  }

  const { container, icon, IconComponent } = variantStyles[type]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        fixed right-4 top-4 z-50 flex items-start gap-3 rounded-xl border px-4 py-3
        shadow-2xl backdrop-blur-md animate-slide-in-right
        md:right-6 md:top-6 md:max-w-sm
        ${container}
      `}
    >
      {/* Status icon */}
      <span className={`mt-0.5 flex-shrink-0 ${icon}`}>
        <IconComponent size={18} aria-hidden="true" />
      </span>

      {/* Message */}
      <p className="flex-1 text-sm leading-snug text-[#f0f0f0]">{message}</p>

      {/* Manual close */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-[#505050] transition-colors hover:text-[#f0f0f0]"
      >
        <IconX size={16} aria-hidden="true" />
      </button>

      {/* Progress bar */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-current opacity-30"
        style={{ animation: `shimmer ${duration}ms linear forwards`, width: '100%' }}
      />
    </div>
  )
}

export default ToastNotification
