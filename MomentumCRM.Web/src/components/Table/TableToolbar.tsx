import type { ReactNode } from 'react'

interface TableToolbarProps {
  globalSearch: boolean
  query: string
  onQueryChange: (query: string) => void
  resultCount: number
  children?: ReactNode
}

export const TableToolbar = ({
  globalSearch,
  query,
  onQueryChange,
  resultCount,
  children,
}: TableToolbarProps) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-2">
      {globalSearch && (
        <div className="relative w-64 max-w-full">
          <svg
            viewBox="0 0 20 20"
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          >
            <path
              d="M9 3a6 6 0 104.47 10.03l3.25 3.25 1.06-1.06-3.25-3.25A6 6 0 009 3zm0 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"
              fill="currentColor"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search…"
            aria-label="Search all columns"
            className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      )}
      {globalSearch && query.trim() && (
        <span className="shrink-0 text-xs text-slate-400">{resultCount} results</span>
      )}
    </div>
    {children && <div className="flex items-center gap-2">{children}</div>}
  </div>
)
