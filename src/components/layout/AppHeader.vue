<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NAvatar } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useVideoStore } from '@/stores/video'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const videoStore = useVideoStore()

const tabRefs = ref<Record<string, HTMLElement>>({})
const indicatorStyle = ref({ left: '0px', width: '0px' })

const currentCategory = computed({
  get: () => videoStore.currentCategory,
  set: (value) => videoStore.setCategory(value)
})

const isHome = computed(() => route.name === 'Home')
const isSearchPage = computed(() => route.name === 'Search')

const updateIndicator = () => {
  nextTick(() => {
    const activeTab = tabRefs.value[currentCategory.value]
    if (activeTab) {
      const labelEl = activeTab.querySelector('.nav-tabs__label')
      if (labelEl) {
        indicatorStyle.value = {
          left: `${activeTab.offsetLeft + (activeTab.offsetWidth - labelEl.getBoundingClientRect().width) / 2}px`,
          width: `${labelEl.getBoundingClientRect().width}px`
        }
      }
    }
  })
}

function handleCategoryClick(slug: string) {
  if (slug !== currentCategory.value) {
    currentCategory.value = slug
    updateIndicator()
  }
  if (route.name !== 'Home') {
    router.push({ name: 'Home' })
  }
}

function goToSearch() {
  router.push({ name: 'Search' })
}

function handleLogout() {
  userStore.logout()
  router.push({ name: 'Home' })
}

function goToUserCenter() {
  router.push('/user')
}

watch(currentCategory, updateIndicator)
</script>

<template>
  <header class="app-header" :class="{ 'app-header--home': isHome }">
    <div class="app-header__main">
      <div class="app-header__container">
        <div class="app-header__left">
          <router-link to="/" class="app-header__logo">
            <span class="logo-text">AnimeVideo</span>
          </router-link>
        </div>

        <div class="app-header__center">
          <div class="nav-tabs">
            <button
              v-for="category in videoStore.categories"
              :key="category.slug"
              :ref="el => { if (el) tabRefs[category.slug] = el as HTMLElement }"
              :class="['nav-tabs__item', { 'nav-tabs__item--active': currentCategory === category.slug }]"
              @click="handleCategoryClick(category.slug)"
            >
              <span class="nav-tabs__label">{{ category.name }}</span>
            </button>
            <div class="nav-tabs__indicator" :style="indicatorStyle"></div>
          </div>
        </div>

        <div class="app-header__right">
          <div 
            v-if="!isSearchPage"
            class="search-box" 
            @click="goToSearch"
          >
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <ThemeToggle />

          <template v-if="userStore.isLoggedIn">
            <div class="user-avatar" @click="goToUserCenter">
              <NAvatar
                round
                :src="userStore.avatar"
                :alt="userStore.username"
                size="small"
              />
            </div>
            <span class="logout-text" @click="handleLogout">退出登录</span>
          </template>
          <template v-else>
            <button class="login-btn" @click="router.push('/login')">
              登录
            </button>
          </template>
        </div>
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
  backdrop-filter: blur(12px);
  transition: background-color var(--transition-normal);
}

.dark .app-header {
  background-color: var(--bg-color);
}

.app-header--home {
  border-bottom: none;
}

.app-header__main {
  border-bottom: none;
}

.app-header__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.app-header__left {
  display: flex;
  align-items: center;
}

.app-header__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.app-header__logo:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.app-header__center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
}

.nav-tabs__item {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
  position: relative;
}

.nav-tabs__item:hover {
  color: var(--text-color);
}

.nav-tabs__item--active {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-tabs__label {
  line-height: 1;
}

.nav-tabs__indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-box:hover {
  background-color: var(--bg-hover);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.user-avatar:hover {
  background-color: var(--bg-hover);
}

.logout-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
  line-height: 1;
}

.logout-text:hover {
  color: #ef4444;
}

.login-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

@media (max-width: 768px) {
  .app-header__center {
    display: none;
  }

  .nav-tabs__item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}
</style>
