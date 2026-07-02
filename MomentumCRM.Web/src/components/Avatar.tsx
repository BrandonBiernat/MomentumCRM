type AvatarSize = 'sm' | 'md' | 'lg'

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
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
  className?: string
}

export const Avatar = ({ name, src, size = 'md', className = '' }: AvatarProps) => {
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${sizes[size]} ${className}`

  if (src) {
    return <img src={src} alt={name ?? 'User'} className={`${base} object-cover`} />
  }

  const text = initials(name)
  return (
    <span
      className={`${base} bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-200`}
      aria-hidden
    >
      {text || <i className="fa-solid fa-user" />}
    </span>
  )
}
