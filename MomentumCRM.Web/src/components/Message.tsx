import type { ReactNode } from 'react'

export type MessageVariant = 'default' | 'info' | 'success' | 'warning' | 'error'

// Shared by Message and Toast so both stay visually in sync.
export const messageVariants: Record<MessageVariant, { box: string; icon: string }> = {
  default: { box: 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200', icon: 'fa-circle-info text-slate-400' },
  info: { box: 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-300', icon: 'fa-circle-info text-brand-500' },
  success: { box: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300', icon: 'fa-circle-check text-green-500' },
  warning: { box: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300', icon: 'fa-triangle-exclamation text-amber-500' },
  error: { box: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300', icon: 'fa-circle-exclamation text-red-500' },
}

interface MessageProps {
  variant?: MessageVariant
  children: ReactNode
  className?: string
  showIcon?: boolean
}

export const Message = ({ variant = 'default', children, className = '', showIcon = true }: MessageProps) => {
  const styles = messageVariants[variant]
  const assertive = variant === 'error' || variant === 'warning'

  return (
    <div
      role={assertive ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${styles.box} ${className}`}
    >
      {showIcon && <i className={`fa-solid ${styles.icon} mt-0.5 shrink-0`} aria-hidden />}
      <span className="min-w-0">{children}</span>
    </div>
  )
}
