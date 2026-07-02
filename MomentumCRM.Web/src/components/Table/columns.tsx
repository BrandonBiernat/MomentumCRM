import dayjs from 'dayjs'
import relativeTimePlugin from 'dayjs/plugin/relativeTime'
import type { ReactNode } from 'react'
import type { ColumnDataType, ResolvedColumn, TableColumn } from './types'

dayjs.extend(relativeTimePlugin)

const isNumeric = (t?: ColumnDataType) => t === 'number' || t === 'currency' || t === 'percent'
const isTemporal = (t?: ColumnDataType) =>
  t === 'date' || t === 'datetime' || t === 'relativeTime'

const DATE_FORMAT = 'MMM D, YYYY'
const DATETIME_FORMAT = 'MMM D, YYYY h:mm A'

const makeFormatter = <T,>(col: TableColumn<T>): ((value: unknown) => string) => {
  const { locale } = col
  switch (col.dataType) {
    case 'number':
    case 'currency':
    case 'percent': {
      const style =
        col.dataType === 'currency' ? 'currency' : col.dataType === 'percent' ? 'percent' : undefined
      const nf = new Intl.NumberFormat(locale, {
        style,
        currency: col.dataType === 'currency' ? (col.currency ?? 'USD') : undefined,
        minimumFractionDigits: col.minimumFractionDigits,
        maximumFractionDigits: col.maximumFractionDigits ?? (col.dataType === 'percent' ? 0 : undefined),
      })
      return (v) => (v == null || v === '' || Number.isNaN(Number(v)) ? '' : nf.format(Number(v)))
    }
    case 'date':
    case 'datetime': {
      const fmt = col.dateFormat ?? (col.dataType === 'datetime' ? DATETIME_FORMAT : DATE_FORMAT)
      return (v) => {
        const d = dayjs(v as dayjs.ConfigType)
        return v != null && v !== '' && d.isValid() ? d.format(fmt) : ''
      }
    }
    case 'relativeTime': {
      return (v) => {
        const d = dayjs(v as dayjs.ConfigType)
        return v != null && v !== '' && d.isValid() ? d.fromNow() : ''
      }
    }
    case 'boolean': {
      const [t, f] = col.booleanLabels ?? ['Yes', 'No']
      return (v) => (v ? t : f)
    }
    default:
      return (v) => (v == null ? '' : String(v))
  }
}

const makeSortValue = <T,>(col: TableColumn<T>): ((item: T) => string | number) | undefined => {
  const acc = col.accessor
  if (!acc || !col.dataType) return undefined
  if (isNumeric(col.dataType)) return (item) => Number(acc(item)) || 0
  if (isTemporal(col.dataType))
    return (item) => {
      const d = dayjs(acc(item) as dayjs.ConfigType)
      return d.isValid() ? d.valueOf() : 0
    }
  if (col.dataType === 'boolean') return (item) => (acc(item) ? 1 : 0)
  return (item) => String(acc(item) ?? '').toLowerCase()
}

const linkClass = 'text-brand-600 hover:underline dark:text-brand-400'
const stopClick = (e: { stopPropagation: () => void }) => e.stopPropagation()

const makeRender = <T,>(
  col: TableColumn<T>,
  format: (value: unknown) => string,
): ((item: T) => ReactNode) => {
  if (col.render) return col.render
  const acc = col.accessor
  if (!acc) return () => null
  switch (col.dataType) {
    case 'email':
      return (item) => {
        const v = String(acc(item) ?? '')
        return v ? (
          <a href={`mailto:${v}`} className={linkClass} onClick={stopClick}>
            {v}
          </a>
        ) : null
      }
    case 'phone':
      return (item) => {
        const v = String(acc(item) ?? '')
        return v ? (
          <a href={`tel:${v.replace(/[^+\d]/g, '')}`} className={linkClass} onClick={stopClick}>
            {v}
          </a>
        ) : null
      }
    case 'link':
      return (item) => {
        const href = String(acc(item) ?? '')
        const label = col.linkLabel ? col.linkLabel(item) : href
        return href ? (
          <a href={href} target="_blank" rel="noreferrer" className={linkClass} onClick={stopClick}>
            {label}
          </a>
        ) : null
      }
    default:
      return (item) => format(acc(item))
  }
}

export const resolveColumn = <T,>(col: TableColumn<T>): ResolvedColumn<T> => {
  const format = makeFormatter(col)
  const acc = col.accessor
  const searchText = acc ? (item: T) => format(acc(item)) : undefined
  return {
    id: col.id,
    header: col.header,
    isRowHeader: col.isRowHeader,
    width: col.width,
    allowsSorting: col.allowsSorting ?? false,
    align: col.align ?? (isNumeric(col.dataType) ? 'right' : 'left'),
    render: makeRender(col, format),
    sortValue: col.sortValue ?? makeSortValue(col),
    searchText,
  }
}

export const alignText = { left: 'text-left', right: 'text-right', center: 'text-center' } as const
export const alignItems = { left: 'items-start', right: 'items-end', center: 'items-center' } as const

export const cssWidth = (w?: string | number): string | undefined =>
  w == null ? undefined : typeof w === 'number' ? `${w}px` : w

// React Aria's virtualized TableLayout only accepts number(px) | % | fr.
// Convert px/rem/em to px; pass %/fr through; otherwise leave it to fixed-layout CSS.
export const toRacWidth = (w?: string | number): number | `${number}%` | `${number}fr` | undefined => {
  if (w == null) return undefined
  if (typeof w === 'number') return w
  const s = w.trim()
  if (/^\d+(\.\d+)?%$/.test(s)) return s as `${number}%`
  if (/^\d+(\.\d+)?fr$/.test(s)) return s as `${number}fr`
  if (/^\d+(\.\d+)?px$/.test(s)) return parseFloat(s)
  const remEm = /^(\d+(\.\d+)?)(rem|em)$/.exec(s)
  if (remEm) return parseFloat(remEm[1]) * 16
  return undefined
}
