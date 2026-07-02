import { useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { Avatar, Breadcrumbs, Button, ConfirmDialog, Spinner, Tooltip, toast } from '../../components'
import {
  useArchiveCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
  usePatchCustomerMutation,
  useRestoreCustomerMutation,
} from '../../services'
import type { Customer, CustomerSource, PatchCustomerRequest } from '../../types/customer'
import { getFormErrorMessage, sourceOptions } from './components/customerFormShared'
import {
  AddressEditor,
  InlineSelectField,
  InlineText,
  PhoneEditor,
} from './components/inlineFields'
import { StatusChanger } from './components/StatusChanger'
import { TypeChanger } from './components/TypeChanger'
import { ActivityTimeline } from './components/ActivityTimeline'
import { NotesSection } from './components/NotesSection'

const DATETIME_FORMAT = 'MMM D, YYYY h:mm A'

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
        <Breadcrumbs
          items={[{ label: 'Customers', to: '/customers' }, { label: 'Not found' }]}
        />
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
  const [restore, { isLoading: restoring }] = useRestoreCustomerMutation()
  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation()
  const [patchCustomer] = usePatchCustomerMutation()
  const [confirmingArchive, setConfirmingArchive] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isBusiness = customer.type === 'Business'
  const isArchived = customer.archivedAtUtc != null

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
      setConfirmingArchive(false)
    }
  }

  const onRestore = async () => {
    try {
      await restore(customer.id).unwrap()
      toast.success(`${customer.name} was restored.`)
    } catch (err) {
      toast.error(getFormErrorMessage(err))
    }
  }

  const onDelete = async () => {
    try {
      await deleteCustomer(customer.id).unwrap()
      toast.success(`${customer.name} was permanently deleted.`)
      navigate('/customers')
    } catch {
      toast.error('Could not delete this customer.')
      setConfirmingDelete(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-4">
        <Breadcrumbs
          items={[{ label: 'Customers', to: '/customers' }, { label: customer.name }]}
        />
      </div>

      {isArchived && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
          <i className="fa-solid fa-box-archive" aria-hidden />
          <span>
            This customer was archived {dayjs(customer.archivedAtUtc).format(DATETIME_FORMAT)}. Restore it to make changes.
          </span>
        </div>
      )}

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
                <InlineText value={customer.name} onSave={saveName} ariaLabel="name" readOnly={isArchived} />
              </span>
              <TypeChanger
                value={customer.type}
                onChange={(type) => void patch({ type }).catch(() => {})}
                readOnly={isArchived}
              />
              <StatusChanger customer={customer} readOnly={isArchived} />
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
          {isArchived ? (
            <>
              <Button variant="secondary" onPress={onRestore} isPending={restoring}>
                <i className="fa-solid fa-arrow-rotate-left" aria-hidden />
                Restore
              </Button>
              <Button
                variant="destructive"
                onPress={() => setConfirmingDelete(true)}
                isDisabled={restoring}
              >
                <i className="fa-solid fa-trash" aria-hidden />
                Delete permanently
              </Button>
            </>
          ) : (
            <Tooltip content="Archive">
              <Button
                variant="ghost"
                onPress={() => setConfirmingArchive(true)}
                aria-label="Archive customer"
              >
                <i className="fa-solid fa-box-archive" aria-hidden />
              </Button>
            </Tooltip>
          )}
        </div>
      </header>

      <ConfirmDialog
        isOpen={confirmingArchive}
        onOpenChange={setConfirmingArchive}
        title="Archive customer"
        description={
          <>
            Archive <span className="font-medium text-slate-900 dark:text-slate-100">{customer.name}</span>?
            They'll be hidden from the customers list but can be restored later.
          </>
        }
        confirmLabel="Archive"
        confirmVariant="destructive"
        isPending={archiving}
        onConfirm={onArchive}
      />

      <ConfirmDialog
        isOpen={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete customer permanently"
        description={
          <>
            Permanently delete{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">{customer.name}</span>?
            This also removes all notes and activity, and can't be undone.
          </>
        }
        confirmLabel="Delete permanently"
        confirmVariant="destructive"
        isPending={deleting}
        onConfirm={onDelete}
      />

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
                  readOnly={isArchived}
                />
              </Field>
              <Field label="Phone">
                <PhoneEditor
                  phone={customer.phone}
                  onSave={(phone) => patch({ phone })}
                  readOnly={isArchived}
                />
              </Field>
              {isBusiness && (
                <Field label="Website">
                  <InlineText
                    value={customer.domain}
                    onSave={(value) => patch({ domain: value })}
                    ariaLabel="website"
                    placeholder="acme.com"
                    emptyLabel="Add website"
                    readOnly={isArchived}
                  />
                </Field>
              )}
              <Field label="Address">
                <AddressEditor
                  address={customer.address}
                  onSave={(address) => patch({ address })}
                  readOnly={isArchived}
                />
              </Field>
            </dl>
          </Card>

          <Card title="Details">
            <dl className="flex flex-col gap-4">
              <Field label="Source">
                <InlineSelectField
                  ariaLabel="Source"
                  items={sourceOptions}
                  value={customer.source}
                  onSave={(value) => patch({ source: value as CustomerSource })}
                  readOnly={isArchived}
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
          <ActivityTimeline customerId={customer.id} />
          <NotesSection customerId={customer.id} readOnly={isArchived} />
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
