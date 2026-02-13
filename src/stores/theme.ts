import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeMode } from '@/types'
import { themeUtils } from '@/utils/theme'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(themeUtils.getStoredTheme())

  const isDark = computed(() => mode.value === 'dark')

  function setTheme(newMode: ThemeMode) {
    mode.value = newMode
    themeUtils.applyTheme(newMode)
  }

  function toggleTheme() {
    const newMode = themeUtils.toggleTheme(mode.value)
    setTheme(newMode)
  }

  function initTheme() {
    themeUtils.applyTheme(mode.value)
  }

  return {
    mode,
    isDark,
    setTheme,
    toggleTheme,
    initTheme
  }
})
