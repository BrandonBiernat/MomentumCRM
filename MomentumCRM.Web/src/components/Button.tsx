import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition outline-none hover:cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 pressed:bg-brand-700 focus-visible:ring-brand-600',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 pressed:bg-slate-100 focus-visible:ring-brand-600',
  ghost:
    'text-slate-700 hover:bg-slate-100 pressed:bg-slate-200 focus-visible:ring-slate-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-500 pressed:bg-red-700 focus-visible:ring-red-600',
}

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
}

interface ButtonProps extends Omit<AriaButtonProps, 'className'> {
  variant?: Variant
  size?: Size
  className?: string
}

export const Button = ({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  return (
    <AriaButton {...props} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} />
  )
}
