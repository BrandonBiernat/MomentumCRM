import type { ReactNode } from 'react'
import { CheckboxField, CheckboxButton, type CheckboxFieldProps } from 'react-aria-components'

interface CheckboxProps extends Omit<CheckboxFieldProps, 'children'> {
  children?: ReactNode
}

export const Checkbox = ({ children, ...props }: CheckboxProps) => (
  <CheckboxField {...props}>
    <CheckboxButton className="group flex items-center gap-2 text-sm text-slate-700 hover:cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 dark:text-slate-200">
      <div className="flex h-4 w-4 items-center justify-center rounded border border-slate-300 bg-white transition group-data-[selected]:border-brand-600 group-data-[selected]:bg-brand-600 group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-brand-500/40 dark:border-slate-600 dark:bg-slate-800">
        <svg
          viewBox="0 0 14 14"
          aria-hidden
          className="h-3 w-3 fill-none stroke-white stroke-[2.5] opacity-0 group-data-[selected]:opacity-100"
        >
          <path d="M2 7l3.5 3.5L12 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {children}
    </CheckboxButton>
  </CheckboxField>
)
