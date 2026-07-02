import {
  RadioGroup as AriaRadioGroup,
  RadioField,
  RadioButton,
  Label,
  type RadioGroupProps as AriaRadioGroupProps,
} from 'react-aria-components'

export interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps extends Omit<AriaRadioGroupProps, 'children'> {
  label?: string
  options: RadioOption[]
}

export const RadioGroup = ({ label, options, ...props }: RadioGroupProps) => (
  <AriaRadioGroup {...props} className="flex flex-col gap-2">
    {label && <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Label>}
    {options.map((opt) => (
      <RadioField key={opt.value} value={opt.value} className="data-[disabled]:opacity-50">
        <RadioButton className="group flex items-center gap-2 text-sm text-slate-700 hover:cursor-pointer dark:text-slate-200">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white transition group-data-[selected]:border-brand-600 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-brand-500/40 dark:border-slate-600 dark:bg-slate-800">
            <div className="h-2 w-2 rounded-full bg-brand-600 opacity-0 transition group-data-[selected]:opacity-100" />
          </div>
          {opt.label}
        </RadioButton>
      </RadioField>
    ))}
  </AriaRadioGroup>
)
