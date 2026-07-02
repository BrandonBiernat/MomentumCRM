type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
type AvatarShape = 'circle' | 'square'

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-2xl',
}

const shapes: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-xl',
}

const initials = (name?: string): string =>
  name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('')
    : ''

interface AvatarProps {
  name?: string
  src?: string
  size?: AvatarSize
  shape?: AvatarShape
  fallbackIcon?: string
  className?: string
}

export const Avatar = ({
  name,
  src,
  size = 'md',
  shape = 'circle',
  fallbackIcon = 'fa-user',
  className = '',
}: AvatarProps) => {
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden ${shapes[shape]} ${sizes[size]} ${className}`

  if (src) {
    return <img src={src} alt={name ?? 'User'} className={`${base} object-cover`} />
  }

  const text = initials(name)
  return (
    <span
      className={`${base} bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-200`}
      aria-hidden
    >
      {text || <i className={`fa-solid ${fallbackIcon}`} />}
    </span>
  )
}
