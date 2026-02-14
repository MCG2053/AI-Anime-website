<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <button
    @click="themeStore.toggleTheme"
    class="theme-toggle"
    :title="themeStore.isDark ? '切换到浅色模式' : '切换到深色模式'"
  >
    <div class="theme-toggle__track">
      <div class="theme-toggle__thumb" :class="{ 'theme-toggle__thumb--dark': themeStore.isDark }">
        <svg
          v-if="themeStore.isDark"
          class="theme-toggle__icon theme-toggle__icon--sun"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
        <svg
          v-else
          class="theme-toggle__icon theme-toggle__icon--moon"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
        </svg>
      </div>
    </div>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  padding: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: transform var(--transition-fast);
}

.theme-toggle:hover {
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle__track {
  width: 44px;
  height: 24px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-full);
  padding: 2px;
  transition: background-color var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.theme-toggle__track::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary-light) 0%, transparent 100%);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.dark .theme-toggle__track::before {
  opacity: 0.3;
}

.theme-toggle__thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-hover) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.theme-toggle__thumb--dark {
  transform: translateX(20px);
  background: linear-gradient(135deg, var(--color-primary-800) 0%, var(--color-primary-700) 100%);
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
}

.theme-toggle__icon {
  width: 12px;
  height: 12px;
  transition: all var(--transition-normal);
}

.theme-toggle__icon--sun {
  color: #fbbf24;
  animation: rotateIn 0.3s ease-out;
}

.theme-toggle__icon--moon {
  color: var(--text-muted);
  animation: rotateIn 0.3s ease-out;
}

@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
}

@media (max-width: 640px) {
  .theme-toggle__track {
    width: 40px;
    height: 22px;
  }

  .theme-toggle__thumb {
    width: 18px;
    height: 18px;
  }

  .theme-toggle__thumb--dark {
    transform: translateX(18px);
  }

  .theme-toggle__icon {
    width: 10px;
    height: 10px;
  }
}
</style>
