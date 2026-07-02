import { useEffect } from 'react'
import { useAppSelector } from '../store'
import { selectTheme } from '../store/slices/settingsSlice'

// Toggles the `.dark` class on <html> to match the user's theme preference.
// 'System' follows the OS and reacts live to prefers-color-scheme changes.
export const useApplyTheme = () => {
  const theme = useAppSelector(selectTheme)

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const dark = theme === 'Dark' || (theme === 'System' && media.matches)
      root.classList.toggle('dark', dark)
    }

    apply()

    if (theme === 'System') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }
  }, [theme])
}
