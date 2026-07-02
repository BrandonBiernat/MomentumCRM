import dayjs from 'dayjs'
import type { ColumnDataType, TableColumn } from './types'

type ExcelType = StringConstructor | NumberConstructor | BooleanConstructor | DateConstructor

const excelType = (dt?: ColumnDataType): ExcelType => {
  switch (dt) {
    case 'number':
    case 'currency':
    case 'percent':
      return Number
    case 'date':
    case 'datetime':
    case 'relativeTime':
      return Date
    case 'boolean':
      return Boolean
    default:
      return String
  }
}

const excelFormat = (col: TableColumn<unknown>): string | undefined => {
  switch (col.dataType) {
    case 'currency':
      return '$#,##0.00'
    case 'percent':
      return '0%'
    case 'number':
      return '#,##0.######'
    case 'date':
      return 'mmm d, yyyy'
    case 'datetime':
    case 'relativeTime':
      return 'mmm d, yyyy h:mm AM/PM'
    default:
      return undefined
  }
}

const excelValue = <T,>(col: TableColumn<T>, row: T): string | number | boolean | Date | null => {
  const acc = col.accessor
  const raw = acc ? acc(row) : null
  if (raw == null || raw === '') return null

  switch (col.dataType) {
    case 'number':
    case 'currency':
    case 'percent': {
      const n = Number(raw)
      return Number.isNaN(n) ? null : n
    }
    case 'date':
    case 'datetime':
    case 'relativeTime': {
      const d = dayjs(raw as dayjs.ConfigType)
      return d.isValid() ? d.toDate() : null
    }
    case 'boolean':
      return Boolean(raw)
    default:
      return String(raw)
  }
}

export const exportTableToExcel = async <T,>(
  columns: TableColumn<T>[],
  rows: T[],
  fileName: string,
): Promise<void> => {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')

  // write-excel-file v4: option key is `columns` (was `schema`); each column is
  // `header` + a `cell()` function returning { value, type, format } per row.
  const excelColumns = columns.map((col) => ({
    header: col.header,
    width: 22,
    cell: (row: T) => ({
      type: excelType(col.dataType),
      value: excelValue(col, row),
      format: excelFormat(col as TableColumn<unknown>),
    }),
  }))

  const write = writeXlsxFile as unknown as (
    rows: T[],
    options: { columns: typeof excelColumns },
  ) => { toFile: (fileName: string) => Promise<void>; toBlob: () => Promise<Blob> }

  const outName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`
  await write(rows, { columns: excelColumns }).toFile(outName)
}
