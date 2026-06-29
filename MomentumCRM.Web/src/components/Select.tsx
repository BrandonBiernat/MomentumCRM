import {
  Select as AriaSelect,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  type SelectProps as AriaSelectProps,
  type Key,
} from 'react-aria-components'

export interface SelectOption {
  id: Key
  label: string
}

interface SelectProps extends Omit<AriaSelectProps<SelectOption>, 'children'> {
  label?: string
  items: SelectOption[]
  placeholder?: string
}

export const Select = ({ label, items, placeholder = 'Select…', ...props }: SelectProps) => (
  <AriaSelect {...props} placeholder={placeholder} className="flex flex-col gap-1.5">
    {label && <Label className="text-sm font-medium text-slate-700">{label}</Label>}
    <Button className="group flex items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none hover:cursor-pointer hover:border-slate-400 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/30">
      <SelectValue className="data-[placeholder]:text-slate-400" />
      <svg
        viewBox="0 0 20 20"
        aria-hidden
        className="ml-2 h-4 w-4 text-slate-400 transition-transform duration-200 group-aria-expanded:rotate-180"
      >
        <path
          d="M6 8l4 4 4-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
    <Popover className="w-(--trigger-width) rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
      <ListBox items={items} className="outline-none">
        {(item: SelectOption) => (
          <ListBoxItem
            id={item.id}
            textValue={item.label}
            className="flex select-none items-center rounded-md px-3 py-1.5 text-sm text-slate-700 outline-none hover:cursor-pointer focus:bg-slate-100 selected:bg-brand-50 selected:text-brand-700"
          >
            {item.label}
          </ListBoxItem>
        )}
      </ListBox>
    </Popover>
  </AriaSelect>
)
