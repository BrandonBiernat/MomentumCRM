import { type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { Avatar, Badge, Button, Spinner, toast, type SelectOption } from '../../components'
import {
  useArchiveCustomerMutation,
  useGetCustomerByIdQuery,
  usePatchCustomerMutation,
} from '../../services'
import type {
  Customer,
  CustomerSource,
  CustomerStatus,
  CustomerType,
  PatchCustomerRequest,
} from '../../types/customer'
import { getFormErrorMessage, sourceOptions, typeOptions } from './components/customerFormShared'
import {
  AddressEditor,
  InlineSelectField,
  InlineText,
  PhoneEditor,
} from './components/inlineFields'

const DATETIME_FORMAT = 'MMM D, YYYY h:mm A'

const statusColor: Record<CustomerStatus, 'amber' | 'violet' | 'green' | 'gray'> = {
  Lead: 'amber',
  Prospect: 'violet',
  Active: 'green',
  Inactive: 'gray',
}

const statusOptions: SelectOption[] = [
  { id: 'Lead', label: 'Lead' },
  { id: 'Prospect', label: 'Prospect' },
  { id: 'Active', label: 'Active' },
  { id: 'Inactive', label: 'Inactive' },
]

const BackLink = () => (
  <Link
    to="/customers"
    className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
  >
    <i className="fa-solid fa-arrow-left" aria-hidden />
    Customers
  </Link>
)

export const CustomerPage = () => {
  const { id = '' } = useParams()
  const { data: customer, isLoading, isError } = useGetCustomerByIdQuery(id, { skip: !id })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !customer) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <BackLink />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Customer not found</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            It may have been archived or removed.
          </p>
        </div>
      </div>
    )
  }

  return <CustomerView customer={customer} />
}

const CustomerView = ({ customer }: { customer: Customer }) => {
  const navigate = useNavigate()
  const [archive, { isLoading: archiving }] = useArchiveCustomerMutation()
  const [patchCustomer] = usePatchCustomerMutation()
  const isBusiness = customer.type === 'Business'

  const patch = async (body: PatchCustomerRequest) => {
    try {
      await patchCustomer({ id: customer.id, body }).unwrap()
    } catch (err) {
      toast.error(getFormErrorMessage(err))
      throw err
    }
  }

  const saveName = async (value: string | null) => {
    if (!value) {
      toast.error('Name is required.')
      throw new Error('Name is required')
    }
    await patch({ name: value })
  }

  const onArchive = async () => {
    try {
      await archive(customer.id).unwrap()
      toast.success(`${customer.name} was archived.`)
      navigate('/customers')
    } catch {
      toast.error('Could not archive this customer.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-4">
        <BackLink />
      </div>

      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            name={customer.name}
            size="xl"
            shape={isBusiness ? 'square' : 'circle'}
            fallbackIcon={isBusiness ? 'fa-building' : 'fa-user'}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                <InlineText value={customer.name} onSave={saveName} ariaLabel="name" />
              </span>
              <Badge color={isBusiness ? 'violet' : 'gray'}>{customer.type}</Badge>
              <Badge color={statusColor[customer.status]}>{customer.status}</Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              {isBusiness ? (
                <>
                  {customer.domain && (
                    <a
                      href={`https://${customer.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 hover:underline dark:text-brand-400"
                    >
                      {customer.domain}
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden />
                    </a>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <i className="fa-solid fa-user-group text-xs" aria-hidden />
                    0 contacts
                  </span>
                </>
              ) : (
                <>
                  {customer.email && (
                    <a href={`mailto:${customer.email}`} className="hover:underline">
                      {customer.email}
                    </a>
                  )}
                  {customer.phone?.number && <span>{customer.phone.number}</span>}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="w-40">
            <InlineSelectField
              ariaLabel="Status"
              items={statusOptions}
              value={customer.status}
              onSave={(value) => patch({ status: value as CustomerStatus })}
            />
          </div>
          <Button variant="ghost" onPress={onArchive} isPending={archiving} aria-label="Archive customer">
            <i className="fa-solid fa-box-archive" aria-hidden />
          </Button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card title="Contact">
            <dl className="flex flex-col gap-4">
              <Field label="Email">
                <InlineText
                  value={customer.email}
                  onSave={(value) => patch({ email: value })}
                  ariaLabel="email"
                  type="email"
                  placeholder="hello@acme.com"
                  emptyLabel="Add email"
                />
              </Field>
              <Field label="Phone">
                <PhoneEditor phone={customer.phone} onSave={(phone) => patch({ phone })} />
              </Field>
              {isBusiness && (
                <Field label="Website">
                  <InlineText
                    value={customer.domain}
                    onSave={(value) => patch({ domain: value })}
                    ariaLabel="website"
                    placeholder="acme.com"
                    emptyLabel="Add website"
                  />
                </Field>
              )}
              <Field label="Address">
                <AddressEditor address={customer.address} onSave={(address) => patch({ address })} />
              </Field>
            </dl>
          </Card>

          <Card title="Details">
            <dl className="flex flex-col gap-4">
              <Field label="Type">
                <InlineSelectField
                  ariaLabel="Type"
                  items={typeOptions}
                  value={customer.type}
                  onSave={(value) => patch({ type: value as CustomerType })}
                />
              </Field>
              <Field label="Source">
                <InlineSelectField
                  ariaLabel="Source"
                  items={sourceOptions}
                  value={customer.source}
                  onSave={(value) => patch({ source: value as CustomerSource })}
                />
              </Field>
              <Field label="Created">{dayjs(customer.createdAtUtc).format(DATETIME_FORMAT)}</Field>
              {customer.updatedAtUtc && (
                <Field label="Updated">{dayjs(customer.updatedAtUtc).format(DATETIME_FORMAT)}</Field>
              )}
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <EmptySection
            title="Activity"
            icon="fa-wave-square"
            hint="Calls, emails, and status changes will show up here."
          />
          <EmptySection
            title="Notes"
            icon="fa-note-sticky"
            hint="Jot down anything worth remembering about this customer."
          />
          {isBusiness && (
            <EmptySection
              title="Contacts"
              icon="fa-user-group"
              hint="People who work at this company will be listed here."
            />
          )}
        </div>
      </div>
    </div>
  )
}

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
    {children}
  </section>
)

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </dt>
    <dd className="text-sm text-slate-800 dark:text-slate-200">{children}</dd>
  </div>
)

const EmptySection = ({ title, icon, hint }: { title: string; icon: string; hint: string }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
      <i className={`fa-solid ${icon} text-xl text-slate-300 dark:text-slate-600`} aria-hidden />
      <p className="text-sm text-slate-400 dark:text-slate-500">{hint}</p>
    </div>
  </section>
)
