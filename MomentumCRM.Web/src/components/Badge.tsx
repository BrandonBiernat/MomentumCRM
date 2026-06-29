import type { ReactNode } from 'react'

type BadgeColor = 'gray' | 'green' | 'amber' | 'violet' | 'red'

const colors: Record<BadgeColor, string> = {
  gray: 'bg-slate-100 text-slate-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  violet: 'bg-brand-100 text-brand-700',
  red: 'bg-red-100 text-red-700',
}

export const Badge = ({ color = 'gray', children }: { color?: BadgeColor; children: ReactNode }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[color]}`}
  >
    {children}
  </span>
)
