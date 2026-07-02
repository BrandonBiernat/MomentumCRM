import { alignItems } from './columns'
import type { ResolvedColumn } from './types'

type SortDirection = 'ascending' | 'descending'

interface ColumnHeaderProps<T> {
  column: ResolvedColumn<T>
  allowsSorting: boolean
  sortDirection?: SortDirection
}

export const ColumnHeader = <T,>({
  column,
  allowsSorting,
  sortDirection,
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
  </div>
)
