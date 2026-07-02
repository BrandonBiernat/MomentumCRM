import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  Table as AriaTable,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Virtualizer,
  TableLayout,
  type Key,
  type Selection,
  type SortDescriptor,
} from 'react-aria-components'
import { Checkbox } from '../Checkbox'
import { ColumnHeader } from './ColumnHeader'
import { TableToolbar } from './TableToolbar'
import { resolveColumn, alignText, cssWidth, toRacWidth } from './columns'
import { exportTableToExcel } from './tableExport'
import type { TableColumn, TableToolbarApi } from './types'

interface TableProps<T> {
  'aria-label': string
  columns: TableColumn<T>[]
  items: T[]
  getRowId: (item: T) => Key
  selectionMode?: 'none' | 'single' | 'multiple'
  selectedKeys?: Selection
  onSelectionChange?: (keys: Selection) => void
  onRowAction?: (item: T) => void
  globalSearch?: boolean
  toolbar?: ReactNode | ((api: TableToolbarApi<T>) => ReactNode)
  exportFileName?: string
  isVirtualized?: boolean
  height?: number | string
  rowHeight?: number
}

// React Aria's Column/Row/Cell must stay rendered inline here — the table
// collection system detects them by identity, so they can't be wrapped in
// custom components. Sub-components are used only for non-collection parts
// (header content, toolbar) and pure logic (./columns, ./tableExport).
export const Table = <T,>({
  columns,
  items,
  getRowId,
  selectionMode = 'none',
  onRowAction,
  globalSearch = false,
  toolbar,
  exportFileName = 'export',
  isVirtualized = false,
  height,
  rowHeight = 44,
  ...props
}: TableProps<T>) => {
  // Virtualized without an explicit height → fill the parent container.
  const fill = isVirtualized && height == null

  const [sort, setSort] = useState<SortDescriptor>()
  const [query, setQuery] = useState('')

  const resolved = useMemo(() => columns.map(resolveColumn), [columns])

  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase()
    const searched = q
      ? items.filter((item) => resolved.some((c) => c.searchText?.(item).toLowerCase().includes(q)))
      : items

    const col = sort && resolved.find((c) => c.id === sort.column)
    if (!col?.sortValue) return searched
    const dir = sort?.direction === 'descending' ? -1 : 1
    return [...searched].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      return (av < bv ? -1 : av > bv ? 1 : 0) * dir
    })
  }, [items, resolved, sort, query])

  const exportExcel = useCallback(
    (fileName?: string) => {
      exportTableToExcel(columns, displayed, fileName ?? exportFileName).catch(console.error)
    },
    [columns, displayed, exportFileName],
  )

  const toolbarContent =
    typeof toolbar === 'function' ? toolbar({ rows: displayed, exportExcel }) : toolbar

  const table = (
    <AriaTable
      {...props}
      key={resolved.map((c) => c.id).join('|')}
      selectionMode={selectionMode}
      sortDescriptor={sort}
      onSortChange={setSort}
      className={`w-full border-collapse text-left text-sm ${isVirtualized ? 'overflow-auto' : 'table-fixed'} ${fill ? 'min-h-0 flex-1' : ''}`}
      style={isVirtualized && !fill ? { height } : undefined}
    >
      <TableHeader className="bg-slate-100 dark:bg-slate-800">
        {selectionMode !== 'none' && (
          <Column id="__selection" className="w-12 border-b border-slate-300 bg-slate-100 px-4 py-2.5 align-top dark:border-slate-700 dark:bg-slate-800">
            {selectionMode === 'multiple' ? (
              <Checkbox slot="selection" />
            ) : (
              <span className="sr-only">Select</span>
            )}
          </Column>
        )}
        {resolved.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            isRowHeader={col.isRowHeader}
            allowsSorting={col.allowsSorting}
            textValue={col.header}
            width={toRacWidth(col.width)}
            style={!isVirtualized && col.width != null ? { width: cssWidth(col.width) } : undefined}
            className={`border-b border-slate-300 bg-slate-100 px-4 py-2.5 align-top text-xs font-semibold uppercase tracking-wider text-slate-600 outline-none data-[allows-sorting]:cursor-pointer data-[allows-sorting]:hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:data-[allows-sorting]:hover:text-slate-100 ${alignText[col.align]}`}
          >
            {({ allowsSorting, sortDirection }) => (
              <ColumnHeader
                column={col}
                allowsSorting={allowsSorting}
                sortDirection={sortDirection}
              />
            )}
          </Column>
        ))}
      </TableHeader>
      <TableBody
        items={displayed}
        dependencies={[resolved]}
        renderEmptyState={() => <EmptyState />}
      >
        {(item) => (
          <Row
            id={getRowId(item)}
            dependencies={[resolved]}
            onAction={onRowAction ? () => onRowAction(item) : undefined}
            className={`border-t border-slate-200 outline-none transition-colors focus-visible:bg-slate-100 selected:bg-brand-50 dark:border-slate-800 dark:focus-visible:bg-slate-800 dark:selected:bg-brand-950 ${onRowAction ? 'cursor-pointer' : ''}`}
          >
            {selectionMode !== 'none' && (
              <Cell className="w-12 px-4 py-3">
                <Checkbox slot="selection" />
              </Cell>
            )}
            {resolved.map((col) => (
              <Cell
                key={col.id}
                className={`px-4 py-3 align-top text-slate-700 outline-none break-words whitespace-normal dark:text-slate-300 ${alignText[col.align]}`}
              >
                {col.render(item)}
              </Cell>
            ))}
          </Row>
        )}
      </TableBody>
    </AriaTable>
  )

  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 ${fill ? 'flex h-full flex-col' : ''}`}
    >
      {(globalSearch || toolbarContent) && (
        <TableToolbar
          globalSearch={globalSearch}
          query={query}
          onQueryChange={setQuery}
          resultCount={displayed.length}
        >
          {toolbarContent}
        </TableToolbar>
      )}
      {isVirtualized ? (
        <Virtualizer
          layout={TableLayout}
          layoutOptions={{ rowHeight, headingHeight: 37 }}
        >
          {table}
        </Virtualizer>
      ) : (
        table
      )}
    </div>
  )
}

const EmptyState = () => (
  <div className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No results</div>
)
