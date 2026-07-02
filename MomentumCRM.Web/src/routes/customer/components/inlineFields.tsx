import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from 'react-aria-components'
import { Button, Form, Select, Spinner, TextField, type SelectOption } from '../../../components'
import type { Address, Phone } from '../../../types/misc'

// Small pen button used to enter edit mode. Kept separate from the value text
// so the value itself stays selectable/copyable.
const EditPen = ({ label, onPress }: { label: string; onPress?: () => void }) => (
  <button
    type="button"
    onClick={onPress}
    aria-label={label}
    className="shrink-0 opacity-0 transition hover:cursor-pointer focus-visible:opacity-100 group-hover:opacity-100"
  >
    <i className="fa-solid fa-pen text-xs text-slate-400 dark:text-slate-500" aria-hidden />
  </button>
)

const addClass = 'text-left text-slate-400 hover:cursor-pointer dark:text-slate-500'
const valueClass = 'truncate select-text text-slate-800 dark:text-slate-200'

// ---- Inline text (name, email, domain) ----

interface InlineTextProps {
  value: string | null | undefined
  onSave: (value: string | null) => Promise<void>
  ariaLabel: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  emptyLabel?: string
}

export const InlineText = ({
  value,
  onSave,
  ariaLabel,
  type = 'text',
  placeholder,
  emptyLabel = 'Add',
}: InlineTextProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const skipCommit = useRef(false)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const start = () => {
    setDraft(value ?? '')
    skipCommit.current = false
    setEditing(true)
  }

  const commit = async () => {
    if (skipCommit.current) {
      setEditing(false)
      return
    }
    const next = draft.trim()
    if (next === (value ?? '')) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await onSave(next === '' ? null : next)
      setEditing(false)
    } catch {
      // caller surfaces the error; stay in edit mode so the user can retry
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <span className="inline-flex w-full items-center gap-2">
        <input
          ref={inputRef}
          type={type}
          value={draft}
          placeholder={placeholder}
          disabled={saving}
          aria-label={ariaLabel}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              inputRef.current?.blur()
            }
            if (e.key === 'Escape') {
              skipCommit.current = true
              inputRef.current?.blur()
            }
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        {saving && <Spinner size="sm" />}
      </span>
    )
  }

  if (!value) {
    return (
      <button type="button" onClick={start} aria-label={`Add ${ariaLabel}`} className={addClass}>
        {emptyLabel}
      </button>
    )
  }

  return (
    <span className="group inline-flex max-w-full items-center gap-1.5">
      <span className={valueClass}>{value}</span>
      <EditPen label={`Edit ${ariaLabel}`} onPress={start} />
    </span>
  )
}

// ---- Inline select (type, source, status) ----

interface InlineSelectFieldProps {
  value: string
  items: SelectOption[]
  onSave: (value: string) => Promise<void>
  ariaLabel: string
}

export const InlineSelectField = ({ value, items, onSave, ariaLabel }: InlineSelectFieldProps) => {
  const [saving, setSaving] = useState(false)
  return (
    <span className="inline-flex items-center gap-2">
      <Select
        aria-label={ariaLabel}
        items={items}
        value={value}
        isDisabled={saving}
        onChange={async (key) => {
          if (key == null || key === value) return
          setSaving(true)
          try {
            await onSave(String(key))
          } catch {
            // caller surfaces the error
          } finally {
            setSaving(false)
          }
        }}
      />
      {saving && <Spinner size="sm" />}
    </span>
  )
}

// ---- Popover editors for the value objects (phone, address) ----
// The value text stays a plain selectable span; only the pen opens the popover.

const popoverClass =
  'w-72 rounded-lg border border-slate-200 bg-white p-4 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900'

const PopoverField = ({
  display,
  addLabel,
  editLabel,
  children,
}: {
  display: string | null
  addLabel: string
  editLabel: string
  children: ReactNode
}) => {
  const popover = <Popover className={popoverClass}>{children}</Popover>

  if (!display) {
    return (
      <DialogTrigger>
        <AriaButton aria-label={addLabel} className={addClass}>
          {addLabel}
        </AriaButton>
        {popover}
      </DialogTrigger>
    )
  }

  return (
    <span className="group inline-flex max-w-full items-center gap-1.5">
      <span className={valueClass}>{display}</span>
      <DialogTrigger>
        <AriaButton
          aria-label={editLabel}
          className="shrink-0 opacity-0 transition hover:cursor-pointer focus-visible:opacity-100 group-hover:opacity-100"
        >
          <i className="fa-solid fa-pen text-xs text-slate-400 dark:text-slate-500" aria-hidden />
        </AriaButton>
        {popover}
      </DialogTrigger>
    </span>
  )
}

interface PhoneEditorProps {
  phone: Phone | null
  onSave: (phone: Phone | null) => Promise<void>
}

export const PhoneEditor = ({ phone, onSave }: PhoneEditorProps) => {
  const display = phone?.number
    ? `${phone.number}${phone.extension ? ` ext. ${phone.extension}` : ''}`
    : null
  return (
    <PopoverField display={display} addLabel="Add phone" editLabel="Edit phone">
      <Dialog className="outline-none">
        {({ close }) => <PhoneForm phone={phone} onSave={onSave} onClose={close} />}
      </Dialog>
    </PopoverField>
  )
}

const PhoneForm = ({ phone, onSave, onClose }: PhoneEditorProps & { onClose: () => void }) => {
  const [saving, setSaving] = useState(false)

  const save = async (next: Phone | null) => {
    setSaving(true)
    try {
      await onSave(next)
      onClose()
    } catch {
      // caller surfaces the error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget)) as {
          number: string
          extension: string
        }
        const number = data.number.trim()
        void save(number ? { number, extension: data.extension.trim() || null } : null)
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-3">
        <div className="min-w-0">
          <TextField name="number" label="Phone" type="tel" defaultValue={phone?.number ?? ''} autoFocus />
        </div>
        <div className="min-w-0">
          <TextField name="extension" label="Ext." defaultValue={phone?.extension ?? ''} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {phone && (
          <Button variant="ghost" type="button" onPress={() => void save(null)} isDisabled={saving}>
            Remove
          </Button>
        )}
        <Button variant="secondary" type="button" onPress={onClose}>
          Cancel
        </Button>
        <Button type="submit" isPending={saving}>
          Save
        </Button>
      </div>
    </Form>
  )
}

interface AddressEditorProps {
  address: Address | null
  onSave: (address: Address | null) => Promise<void>
}

export const AddressEditor = ({ address, onSave }: AddressEditorProps) => {
  const display = address
    ? [address.street, address.city, `${address.state} ${address.postalCode}`.trim(), address.country]
        .filter((p) => p && p.trim())
        .join(', ')
    : null
  return (
    <PopoverField display={display} addLabel="Add address" editLabel="Edit address">
      <Dialog className="outline-none">
        {({ close }) => <AddressForm address={address} onSave={onSave} onClose={close} />}
      </Dialog>
    </PopoverField>
  )
}

const AddressForm = ({ address, onSave, onClose }: AddressEditorProps & { onClose: () => void }) => {
  const [saving, setSaving] = useState(false)

  const save = async (next: Address | null) => {
    setSaving(true)
    try {
      await onSave(next)
      onClose()
    } catch {
      // caller surfaces the error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
        void save({
          street: d.street.trim(),
          city: d.city.trim(),
          state: d.state.trim(),
          postalCode: d.postalCode.trim(),
          country: d.country.trim(),
        })
      }}
    >
      <TextField name="street" label="Street" defaultValue={address?.street ?? ''} autoFocus isRequired />
      <div className="grid grid-cols-2 gap-3">
        <TextField name="city" label="City" defaultValue={address?.city ?? ''} isRequired />
        <TextField name="state" label="State" defaultValue={address?.state ?? ''} isRequired />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField name="postalCode" label="Postal code" defaultValue={address?.postalCode ?? ''} isRequired />
        <TextField name="country" label="Country" defaultValue={address?.country ?? ''} isRequired />
      </div>
      <div className="flex justify-end gap-2">
        {address && (
          <Button variant="ghost" type="button" onPress={() => void save(null)} isDisabled={saving}>
            Remove
          </Button>
        )}
        <Button variant="secondary" type="button" onPress={onClose}>
          Cancel
        </Button>
        <Button type="submit" isPending={saving}>
          Save
        </Button>
      </div>
    </Form>
  )
}
