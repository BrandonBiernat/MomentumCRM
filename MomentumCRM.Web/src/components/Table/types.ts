import type { ReactNode } from 'react'

export type ColumnDataType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'relativeTime'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'link'

export interface TableColumn<T> {
  id: string
  header: string
  isRowHeader?: boolean
  width?: string | number
  accessor?: (item: T) => unknown
  dataType?: ColumnDataType
  align?: 'left' | 'right' | 'center'
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  dateFormat?: string
  booleanLabels?: [trueLabel: string, falseLabel: string]
  linkLabel?: (item: T) => string
  allowsSorting?: boolean
  sortValue?: (item: T) => string | number
  render?: (item: T) => ReactNode
}

export interface ResolvedColumn<T> {
  id: string
  header: string
  isRowHeader?: boolean
  width?: string | number
  allowsSorting: boolean
  align: 'left' | 'right' | 'center'
  render: (item: T) => ReactNode
  sortValue?: (item: T) => string | number
  searchText?: (item: T) => string
}

export interface TableToolbarApi<T> {
  rows: T[]
  exportExcel: (fileName?: string) => void
}
