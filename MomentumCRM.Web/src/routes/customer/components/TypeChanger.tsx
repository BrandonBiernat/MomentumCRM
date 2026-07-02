import { Button as AriaButton, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'
import { Badge } from '../../../components'
import type { CustomerType } from '../../../types/customer'

const options: CustomerType[] = ['Business', 'Individual']

// Unlike status, type isn't a lifecycle — no confirm/reason. Picking a value
// just changes it immediately (the caller's PATCH is optimistic).
export const TypeChanger = ({
  value,
  onChange,
  readOnly = false,
}: {
  value: CustomerType
  onChange: (type: CustomerType) => void
  readOnly?: boolean
}) =>
  readOnly ? (
    <Badge color={value === 'Business' ? 'violet' : 'gray'}>{value}</Badge>
  ) : (
  <MenuTrigger>
    <AriaButton
      aria-label="Change type"
      className="inline-flex items-center gap-1.5 rounded-full outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/40"
    >
      <Badge color={value === 'Business' ? 'violet' : 'gray'}>{value}</Badge>
      <i className="fa-solid fa-chevron-down text-xs text-slate-400" aria-hidden />
    </AriaButton>
    <Popover className="min-w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900">
      <Menu
        className="outline-none"
        onAction={(key) => {
          if (key !== value) onChange(key as CustomerType)
        }}
      >
        {options.map((type) => (
          <MenuItem
            key={type}
            id={type}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none focus:bg-slate-100 dark:text-slate-200 dark:focus:bg-slate-800"
          >
            {type}
          </MenuItem>
        ))}
      </Menu>
    </Popover>
  </MenuTrigger>
)
