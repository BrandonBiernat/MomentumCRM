import { useEffect, useRef, useState } from 'react'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent)

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  hotkey?: string
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
  hotkey = 'k',
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [typed, setTyped] = useState(false)
  const hasText = value !== undefined ? value.length > 0 : typed

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [hotkey])

  return (
    <div className={`relative ${className}`}>
      <i
        className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => {
          setTyped(e.target.value.length > 0)
          onChange?.(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') inputRef.current?.blur()
        }}
        placeholder={placeholder}
        aria-label="Search"
        className={`w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 text-sm text-slate-800 outline-none placeholder:text-slate-400 hover:bg-white focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/30 ${hasText ? 'pr-3' : 'pr-14'}`}
      />
      {!hasText && (
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400 sm:block">
          {isMac ? '⌘' : 'Ctrl+'}
          {hotkey.toUpperCase()}
        </kbd>
      )}
    </div>
  )
}
