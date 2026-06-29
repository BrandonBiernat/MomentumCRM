import { alignItems } from './columns'
import type { ResolvedColumn } from './types'

type SortDirection = 'ascending' | 'descending'

interface ColumnHeaderProps<T> {
  column: ResolvedColumn<T>
  allowsSorting: boolean
  sortDirection?: SortDirection
  filterValue: string
  onFilterChange: (value: string) => void
}

const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()

export const ColumnHeader = <T,>({
  column,
  allowsSorting,
  sortDirection,
  filterValue,
  onFilterChange,
}: ColumnHeaderProps<T>) => (
  <div className={`flex min-w-0 flex-col gap-1.5 ${alignItems[column.align]}`}>
    <span className="flex min-w-0 items-center gap-1">
      <span className="break-words">{column.header}</span>
      {allowsSorting && (
        <svg
          viewBox="0 0 16 16"
          aria-hidden
          className={`h-3 w-3 transition ${sortDirection ? 'text-brand-600 opacity-100' : 'opacity-30'} ${sortDirection === 'descending' ? 'rotate-180' : ''}`}
        >
          <path d="M8 4l3 4H5z" fill="currentColor" />
        </svg>
      )}
    </span>
    {column.filterValue && (
      <input
        type="search"
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        onPointerDown={stop}
        onClick={stop}
        onKeyDown={stop}
        placeholder="Search…"
        aria-label={`Search ${column.header}`}
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-left text-xs font-normal normal-case tracking-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
      />
    )}
  </div>
)
