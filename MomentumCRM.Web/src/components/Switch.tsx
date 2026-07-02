import type { ReactNode } from 'react'
import { SwitchField, SwitchButton, type SwitchFieldProps } from 'react-aria-components'

interface SwitchProps extends Omit<SwitchFieldProps, 'children'> {
  children?: ReactNode
}

export const Switch = ({ children, ...props }: SwitchProps) => (
  <SwitchField {...props}>
    <SwitchButton className="group flex items-center gap-2.5 text-sm text-slate-700 hover:cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:text-slate-200">
      <div className="flex h-5 w-9 items-center rounded-full bg-slate-300 p-0.5 transition-colors group-data-[selected]:bg-brand-600 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-brand-500/40 group-data-[focus-visible]:ring-offset-1 dark:bg-slate-600 dark:group-data-[focus-visible]:ring-offset-slate-900">
        <div className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform group-data-[selected]:translate-x-4" />
      </div>
      {children}
    </SwitchButton>
  </SwitchField>
)
