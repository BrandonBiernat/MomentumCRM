import { useState, type ReactNode } from 'react'
import { DialogTrigger, type Selection, type Key } from 'react-aria-components'
import logoUrl from '../assets/momentum horizontal text purple logo.png'
import {
  Badge,
  Button,
  Checkbox,
  Modal,
  RadioGroup,
  Message,
  Select,
  Spinner,
  Switch,
  Table,
  TextField,
  type TableColumn,
} from '../components'

interface CustomerRow {
  id: string
  name: string
  email: string
  type: string
  status: 'Lead' | 'Active' | 'Inactive'
}

const customers: CustomerRow[] = [
  { id: '1', name: 'Acme Corp', email: 'hello@acme.com', type: 'Business', status: 'Active' },
  { id: '2', name: 'Ada Lovelace', email: 'ada@analytical.dev', type: 'Individual', status: 'Lead' },
  { id: '3', name: 'Globex Inc', email: 'hi@globex.com', type: 'Business', status: 'Inactive' },
]

const statusColor = { Lead: 'amber', Active: 'green', Inactive: 'gray' } as const

const customerColumns: TableColumn<CustomerRow>[] = [
  {
    id: 'name',
    header: 'Name',
    isRowHeader: true,
    allowsSorting: true,
    sortValue: (c) => c.name.toLowerCase(),
    filterValue: (c) => c.name,
    render: (c) => <span className="font-medium text-slate-900">{c.name}</span>,
  },
  {
    id: 'email',
    header: 'Email',
    allowsSorting: true,
    sortValue: (c) => c.email.toLowerCase(),
    filterValue: (c) => c.email,
    render: (c) => c.email,
  },
  { id: 'type', header: 'Type', filterValue: (c) => c.type, render: (c) => c.type },
  {
    id: 'status',
    header: 'Status',
    allowsSorting: true,
    sortValue: (c) => c.status,
    filterValue: (c) => c.status,
    render: (c) => <Badge color={statusColor[c.status]}>{c.status}</Badge>,
  },
]

const statuses = ['Lead', 'Active', 'Inactive'] as const
const manyCustomers: CustomerRow[] = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  type: i % 2 ? 'Business' : 'Individual',
  status: statuses[i % 3],
}))

interface Deal {
  id: string
  company: string
  email: string
  website: string
  amount: number
  probability: number
  closeDate: string
  lastActivity: string
  won: boolean
}

const deals: Deal[] = [
  { id: '1', company: 'Acme Corp', email: 'sales@acme.com', website: 'https://acme.com', amount: 12500, probability: 0.8, closeDate: '2026-07-15', lastActivity: '2026-06-26T14:30:00Z', won: false },
  { id: '2', company: 'Globex Inc', email: 'deals@globex.com', website: 'https://globex.example', amount: 48000, probability: 0.45, closeDate: '2026-06-30', lastActivity: '2026-06-28T09:00:00Z', won: true },
  { id: '3', company: 'Initech', email: 'hi@initech.io', website: 'https://initech.io', amount: 3200.5, probability: 0.2, closeDate: '2026-08-01', lastActivity: '2026-06-20T10:00:00Z', won: false },
  { id: '4', company: 'Umbrella LLC', email: 'contact@umbrella.llc', website: 'https://umbrella.llc', amount: 96000, probability: 0.95, closeDate: '2026-07-02', lastActivity: '2026-05-30T10:00:00Z', won: true },
]

const dealColumns: TableColumn<Deal>[] = [
  { id: 'company', header: 'Company', isRowHeader: true, width: '12rem', accessor: (d) => d.company, dataType: 'text', allowsSorting: true, filterable: true },
  { id: 'email', header: 'Contact', width: '180px', accessor: (d) => d.email, dataType: 'email', filterable: true },
  { id: 'website', header: 'Website', accessor: (d) => d.website, dataType: 'link', linkLabel: (d) => d.website.replace(/^https?:\/\//, '') },
  { id: 'amount', header: 'Amount', width: 110, accessor: (d) => d.amount, dataType: 'currency', currency: 'USD', allowsSorting: true },
  { id: 'probability', header: 'Win %', width: '90px', accessor: (d) => d.probability, dataType: 'percent', allowsSorting: true },
  { id: 'closeDate', header: 'Close date', accessor: (d) => d.closeDate, dataType: 'date', allowsSorting: true },
  { id: 'lastActivity', header: 'Last activity', accessor: (d) => d.lastActivity, dataType: 'relativeTime', allowsSorting: true },
  { id: 'won', header: 'Won', width: '80px', accessor: (d) => d.won, dataType: 'boolean', booleanLabels: ['Won', 'Open'], align: 'center', allowsSorting: true },
]

const customerTypes = [
  { id: 'individual', label: 'Individual' },
  { id: 'business', label: 'Business' },
]

const customerSources = [
  { value: 'referral', label: 'Customer referral' },
  { value: 'direct', label: 'Direct' },
  { value: 'cold-outbound', label: 'Cold outbound' },
]

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
    {children}
  </section>
)

const Swatch = ({ cls, name }: { cls: string; name: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`h-12 w-12 rounded-lg ring-1 ring-black/5 ${cls}`} />
    <span className="text-[10px] text-slate-500">{name}</span>
  </div>
)

const brand = [
  { name: '50', cls: 'bg-brand-50' },
  { name: '100', cls: 'bg-brand-100' },
  { name: '200', cls: 'bg-brand-200' },
  { name: '300', cls: 'bg-brand-300' },
  { name: '400', cls: 'bg-brand-400' },
  { name: '500', cls: 'bg-brand-500' },
  { name: '600', cls: 'bg-brand-600' },
  { name: '700', cls: 'bg-brand-700' },
  { name: '800', cls: 'bg-brand-800' },
  { name: '900', cls: 'bg-brand-900' },
  { name: '950', cls: 'bg-brand-950' },
]

const accent = [
  { name: 'accent-300', cls: 'bg-accent-300' },
  { name: 'accent-400', cls: 'bg-accent-400' },
  { name: 'accent-500', cls: 'bg-accent-500' },
  { name: 'accent-600', cls: 'bg-accent-600' },
]

const SelectableTableDemo = () => {
  const [selected, setSelected] = useState<Selection>(new Set<Key>())
  const count = selected === 'all' ? customers.length : selected.size
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-500">{count} selected</p>
      <Table
        aria-label="Selectable customers"
        items={customers}
        getRowId={(c) => c.id}
        columns={customerColumns}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      />
    </div>
  )
}

export const ComponentPreview = () => (
  <div className="min-h-full bg-slate-50 text-slate-900">
    <div className="mx-auto max-w-4xl space-y-12 px-6 py-10">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <img src={logoUrl} alt="Momentum" className="h-9" />
        <span className="text-sm text-slate-500">Component preview</span>
      </header>

      <Section title="Brand palette">
        <div className="flex flex-wrap gap-2">
          {brand.map((s) => (
            <Swatch key={s.name} cls={s.cls} name={s.name} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {accent.map((s) => (
            <Swatch key={s.name} cls={s.cls} name={s.name} />
          ))}
        </div>
      </Section>

      <Section title="Button — variants">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="primary" isDisabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section title="Button — pending (isPending)">
        <div className="flex flex-wrap items-center gap-3">
          <Button isPending>Save</Button>
          <Button variant="secondary" isPending>
            Export
          </Button>
          <Button size="lg" isPending>
            Submitting
          </Button>
        </div>
      </Section>

      <Section title="Message">
        <div className="flex max-w-md flex-col gap-3">
          <Message variant="default">A neutral, default message.</Message>
          <Message variant="info">Heads up — here's some useful information.</Message>
          <Message variant="success">Your changes were saved successfully.</Message>
          <Message variant="warning">This action can't be undone.</Message>
          <Message variant="error">Invalid email or password.</Message>
          <Message variant="info" showIcon={false}>
            Without an icon.
          </Message>
        </div>
      </Section>

      <Section title="Spinner">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-end gap-5">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner size="sm" />
            Loading…
          </span>
          <div className="rounded-lg bg-brand-600 p-4">
            <Spinner className="text-white" />
          </div>
        </div>
      </Section>

      <Section title="Button — sizes">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section title="TextField">
        <div className="grid max-w-sm gap-4">
          <TextField label="Full name" placeholder="Ada Lovelace" />
          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            description="We'll never share it."
          />
          <TextField
            label="Password"
            type="password"
            placeholder="••••••••"
            errorMessage="Must be at least 8 characters."
          />
          <TextField label="Disabled" placeholder="Can't touch this" isDisabled />
        </div>
      </Section>

      <Section title="Select">
        <div className="max-w-sm">
          <Select label="Customer type" items={customerTypes} placeholder="Choose a type" />
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="flex flex-col gap-2">
          <Checkbox defaultSelected>Email opt-in</Checkbox>
          <Checkbox>Send welcome message</Checkbox>
          <Checkbox isDisabled>Disabled option</Checkbox>
        </div>
      </Section>

      <Section title="Switch">
        <div className="flex flex-col gap-3">
          <Switch defaultSelected>Active</Switch>
          <Switch>Subscribe to newsletter</Switch>
          <Switch isDisabled>Disabled</Switch>
        </div>
      </Section>

      <Section title="Radio group">
        <RadioGroup label="Source" options={customerSources} defaultValue="referral" />
      </Section>

      <Section title="Table — sortable, row click">
        <Table
          aria-label="Customers"
          items={customers}
          getRowId={(c) => c.id}
          columns={customerColumns}
          onRowAction={(c) => alert(`Row clicked: ${c.name}`)}
        />
      </Section>

      <Section title="Table — virtualized (1,000 rows)">
        <Table
          aria-label="All customers"
          items={manyCustomers}
          getRowId={(c) => c.id}
          columns={customerColumns}
          isVirtualized
          height={320}
          onRowAction={(c) => alert(`Row clicked: ${c.name}`)}
        />
      </Section>

      <Section title="Table — typed columns + global search + toolbar">
        <Table
          aria-label="Deals"
          items={deals}
          getRowId={(d) => d.id}
          columns={dealColumns}
          globalSearch
          exportFileName="deals"
          toolbar={(api) => (
            <>
              <Button variant="secondary" size="sm" onPress={() => api.exportExcel()}>
                <i className="fa-solid fa-file-excel" aria-hidden />
                Export
              </Button>
              <Button size="sm">New deal</Button>
            </>
          )}
        />
      </Section>

      <Section title="Table — selectable (multiple)">
        <SelectableTableDemo />
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-2">
          <Badge color="gray">Inactive</Badge>
          <Badge color="green">Active</Badge>
          <Badge color="amber">Lead</Badge>
          <Badge color="violet">Business</Badge>
          <Badge color="red">Churned</Badge>
        </div>
      </Section>

      <Section title="Dialog / Modal">
        <DialogTrigger>
          <Button>New customer</Button>
          <Modal title="New customer">
            {({ close }) => (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  close()
                }}
              >
                <TextField label="Name" placeholder="Acme Corp" autoFocus />
                <Select label="Type" items={customerTypes} placeholder="Choose a type" />
                <div className="mt-2 flex justify-end gap-2">
                  <Button variant="secondary" type="button" onPress={close}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            )}
          </Modal>
        </DialogTrigger>
      </Section>
    </div>
  </div>
)
