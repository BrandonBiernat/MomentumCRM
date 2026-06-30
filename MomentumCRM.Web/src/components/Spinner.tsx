type SpinnerSize = 'sm' | 'md' | 'lg'

const sizes: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-9',
}

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => (
  <div role="status" aria-label="Loading" className={`spinner text-brand-600 ${sizes[size]} ${className}`} />
)
