import { storage } from './storage'
import type { ThemeMode } from '@/types'

export const themeUtils = {
  getStoredTheme(): ThemeMode {
    const stored = storage.getTheme()
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  },

  applyTheme(theme: ThemeMode): void {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    storage.setTheme(theme)
  },

  toggleTheme(current: ThemeMode): ThemeMode {
    return current === 'light' ? 'dark' : 'light'
  }
}
