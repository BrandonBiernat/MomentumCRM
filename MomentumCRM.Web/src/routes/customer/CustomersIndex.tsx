import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogTrigger, Popover } from 'react-aria-components'
import {
  Badge,
  Button,
  Checkbox,
  Modal,
  RadioGroup,
  Spinner,
  Switch,
  Table,
  Tabs,
  type TabItem,
  type TableColumn,
  type TableRef,
} from '../../components'
import { useGetCustomerSummaryQuery, useGetCustomersQuery } from '../../services'
import type { Customer, CustomerStatus, CustomerType } from '../../types/customer'
import { CreateCustomerForm } from './components/CreateCustomerForm'

const statusColor: Record<CustomerStatus, 'amber' | 'violet' | 'green' | 'gray'> = {
  Lead: 'amber',
  Prospect: 'violet',
  Active: 'green',
  Inactive: 'gray',
}

const tabStatus: Record<string, CustomerStatus | undefined> = {
  all: undefined,
  leads: 'Lead',
  prospects: 'Prospect',
  active: 'Active',
  inactive: 'Inactive',
}

const columns: TableColumn<Customer>[] = [
  {
    id: 'name',
    header: 'Name',
    isRowHeader: true,
    accessor: (c) => c.name,
    dataType: 'text',
    allowsSorting: true,
    render: (c) => (
      <Link to={c.id} className="font-medium text-brand-600 hover:underline dark:text-brand-400">
        {c.name}
      </Link>
    ),
  },
  {
      id: 'email',
      header: 'Email',
      accessor: (c) => c.email,
      dataType: 'email',
      allowsSorting: true,
  },
  {
    id: 'phone',
    header: 'Phone',
    accessor: (c) => c.phone?.number,
    dataType: 'phone',
    allowsSorting: true,
  },
  {
    id: 'type',
    header: 'Type',
    accessor: (c) => c.type,
    dataType: 'text',
    allowsSorting: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (c) => c.status,
    allowsSorting: true,
    align: 'center',
    render: (c) => <Badge color={statusColor[c.status]}>{c.status}</Badge>,
  },
  {
    id: 'createdAtUtc',
    header: 'Created',
    accessor: (c) => c.createdAtUtc,
    dataType: 'date',
    allowsSorting: true,
    align: 'center',
  },
]

const typeOptions = [
  { value: 'all', label: 'All' },
  { value: 'Business', label: 'Business' },
  { value: 'Individual', label: 'Individual' },
]

export const CustomersIndex = () => {
  const [tab, setTab] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [typeFilter, setTypeFilter] = useState<CustomerType | 'all'>('all')
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const tableRef = useRef<TableRef>(null)

  const { data: customers, isLoading } = useGetCustomersQuery({
    status: tabStatus[tab],
    archived: showArchived,
  })
  const { data: summary } = useGetCustomerSummaryQuery({ archived: showArchived })

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.has(c.id)),
    [hiddenColumns],
  )

  const items = useMemo(() => {
    const base = customers ?? []
    return typeFilter === 'all' ? base : base.filter((c) => c.type === typeFilter)
  }, [customers, typeFilter])

  const toggleColumn = (id: string, visible: boolean) =>
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (visible) next.delete(id)
      else next.add(id)
      return next
    })

  const filtersActive = typeFilter !== 'all' || hiddenColumns.size > 0

  const tabs = useMemo<TabItem[]>(
    () => [
      { id: 'all', label: 'All', count: summary?.all },
      { id: 'leads', label: 'Leads', count: summary?.lead },
      { id: 'prospects', label: 'Prospects', count: summary?.prospect },
      { id: 'active', label: 'Active', count: summary?.active },
      { id: 'inactive', label: 'Inactive', count: summary?.inactive },
    ],
    [summary],
  )

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Customers</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => tableRef.current?.exportExcel('customers')}
          >
            <i className="fa-solid fa-file-excel" aria-hidden />
            Export
          </Button>
          <DialogTrigger>
            <Button variant="secondary" size="sm">
              <i className="fa-solid fa-filter" aria-hidden />
              Filter
              {filtersActive && <span className="h-2 w-2 rounded-full bg-brand-600" />}
            </Button>
            <Popover
              placement="bottom end"
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900"
            >
              <Dialog className="flex w-56 flex-col gap-4 outline-none">
                <RadioGroup
                  label="Type"
                  options={typeOptions}
                  value={typeFilter}
                  onChange={(v) => setTypeFilter(v as CustomerType | 'all')}
                />
                <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Columns</p>
                  {columns.map((col) => (
                    <Checkbox
                      key={col.id}
                      isSelected={col.isRowHeader || !hiddenColumns.has(col.id)}
                      isDisabled={col.isRowHeader}
                      onChange={(selected) => toggleColumn(col.id, selected)}
                    >
                      {col.header}
                    </Checkbox>
                  ))}
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
          <DialogTrigger>
            <Button size="sm">
              <i className="fa-solid fa-plus" aria-hidden />
              Add customer
            </Button>
            <Modal title="Add customer">
              {({ close }) => <CreateCustomerForm onClose={close} />}
            </Modal>
          </DialogTrigger>
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between border-b border-slate-200 dark:border-slate-800">
        <Tabs tabs={tabs} selectedKey={tab} onSelectionChange={setTab} bordered={false} />
        <div className="pb-2">
          <Switch isSelected={showArchived} onChange={setShowArchived}>
            Show archived
          </Switch>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table
            ref={tableRef}
            columns={visibleColumns}
            aria-label="Customers"
            items={items}
            isVirtualized={true}
            getRowId={(c) => c.id}
          />
        )}
      </div>
    </div>
  )
}
