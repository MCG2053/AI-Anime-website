<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NInput, NDropdown, NAvatar } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const searchKeyword = ref('')
const searchFocused = ref(false)

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push({ name: 'Search', query: { q: searchKeyword.value.trim() } })
  }
}

function handleLogout() {
  userStore.logout()
  router.push({ name: 'Home' })
}

const userDropdownOptions = [
  { label: '个人中心', key: 'profile' },
  { label: '我的收藏', key: 'favorites' },
  { label: '观看历史', key: 'history' },
  { type: 'divider', key: 'd1' },
  { label: '退出登录', key: 'logout' }
]

function handleUserDropdown(key: string) {
  switch (key) {
    case 'profile':
      router.push('/user')
      break
    case 'favorites':
      router.push('/user?tab=favorites')
      break
    case 'history':
      router.push('/user?tab=history')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const isHome = computed(() => route.name === 'Home')
</script>

<template>
  <header class="app-header" :class="{ 'app-header--home': isHome }">
    <div class="app-header__container">
      <div class="app-header__left">
        <router-link to="/" class="app-header__logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 4v8l6-4-6-4z"/>
            </svg>
          </div>
          <span class="logo-text">Anime Video</span>
        </router-link>
      </div>

      <div class="app-header__right">
        <div class="search-box" :class="{ 'search-box--focused': searchFocused }">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <NInput
            v-model:value="searchKeyword"
            placeholder="搜索动漫..."
            :bordered="false"
            size="small"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keyup.enter="handleSearch"
            class="search-input"
          />
          <button v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <ThemeToggle />

        <template v-if="userStore.isLoggedIn">
          <NDropdown
            :options="userDropdownOptions"
            @select="handleUserDropdown"
            placement="bottom-end"
            :show-arrow="true"
          >
            <div class="user-avatar">
              <NAvatar
                round
                :src="userStore.avatar"
                :alt="userStore.username"
                size="small"
              />
            </div>
          </NDropdown>
        </template>
        <template v-else>
          <button class="login-btn" @click="router.push('/login')">
            登录
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(12px);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.dark .app-header {
  background-color: rgba(18, 18, 18, 0.9);
}

.app-header--home {
  border-bottom: none;
}

.app-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.app-header__logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.logo-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-color);
  white-space: nowrap;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  width: 200px;
}

@media (min-width: 1024px) {
  .search-box {
    width: 280px;
  }
}

.search-box:hover {
  background-color: var(--bg-hover);
}

.search-box--focused {
  background-color: var(--bg-color);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.search-box--focused .search-icon {
  color: var(--color-primary);
}

.search-input {
  flex: 1;
}

.search-clear {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.search-clear:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.search-clear svg {
  width: 14px;
  height: 14px;
}

.user-avatar {
  cursor: pointer;
  padding: 2px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.user-avatar:hover {
  background-color: var(--bg-hover);
}

.login-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .logo-text {
    display: none;
  }

  .search-box {
    width: 150px;
  }
}
</style>
