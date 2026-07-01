import { useRef, type KeyboardEvent } from 'react'

export interface TabItem {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabItem[]
  selectedKey: string
  onSelectionChange: (key: string) => void
  bordered?: boolean
  className?: string
}

export const Tabs = ({
  tabs,
  selectedKey,
  onSelectionChange,
  bordered = true,
  className = '',
}: TabsProps) => {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const idx = tabs.findIndex((t) => t.id === selectedKey)
    const dir = e.key === 'ArrowRight' ? 1 : -1
    const next = tabs[(idx + dir + tabs.length) % tabs.length]
    onSelectionChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={onKeyDown}
      className={`flex items-center gap-1 ${bordered ? 'border-b border-slate-200' : ''} ${className}`}
    >
      {tabs.map((tab) => {
        const selected = tab.id === selectedKey
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelectionChange(tab.id)}
            className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition hover:cursor-pointer focus-visible:outline-none ${
              selected
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  selected ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
