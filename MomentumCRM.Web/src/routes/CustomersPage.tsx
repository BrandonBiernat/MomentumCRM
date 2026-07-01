import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  Spinner,
  Switch,
  Table,
  Tabs,
  type TabItem,
  type TableColumn,
} from '../components'
import { useGetCustomerSummaryQuery, useGetCustomersQuery } from '../services'
import type { Customer, CustomerStatus } from '../types/customer'

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
    filterable: true,
    render: (c) => (
      <Link to={c.id} className="font-medium text-brand-600 hover:underline">
        {c.name}
      </Link>
    ),
  },
  {
      id: 'email',
      header: 'Email',
      accessor: (c) => c.email,
      dataType: 'email',
      filterable: true,
      allowsSorting: true,
  },
  {
    id: 'phone',
    header: 'Phone',
    accessor: (c) => c.phone?.number,
    dataType: 'phone',
    filterable: true,
    allowsSorting: true,
  },
  {
    id: 'type',
    header: 'Type',
    accessor: (c) => c.type,
    dataType: 'text',
    allowsSorting: true,
    filterable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessor: (c) => c.status,
    allowsSorting: true,
    filterable: true,
    align: 'center',
    render: (c) => <Badge color={statusColor[c.status]}>{c.status}</Badge>,
  },
  {
    id: 'createdAtUtc',
    header: 'Created',
    accessor: (c) => c.createdAtUtc,
    dataType: 'date',
    allowsSorting: true,
    filterable: true,
    align: 'center',
  },
]

export const CustomersPage = () => {
  const [tab, setTab] = useState('all')
  const [showArchived, setShowArchived] = useState(false)

  const { data: customers, isLoading } = useGetCustomersQuery({
    status: tabStatus[tab],
    archived: showArchived,
  })
  const { data: summary } = useGetCustomerSummaryQuery({ archived: showArchived })

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
        <h1 className="text-xl font-semibold text-slate-900">Customers</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <i className="fa-solid fa-filter" aria-hidden />
            Filter
          </Button>
          <Button size="sm">
            <i className="fa-solid fa-plus" aria-hidden />
            Add customer
          </Button>
        </div>
      </div>

      <div className="mb-3 flex items-end justify-between border-b border-slate-200">
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
            columns={columns}
            aria-label="Customers"
            items={customers ?? []}
            isVirtualized={true}
            getRowId={(c) => c.id}
          />
        )}
      </div>
    </div>
  )
}
