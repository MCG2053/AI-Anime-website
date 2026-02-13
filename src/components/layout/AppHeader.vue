<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NInput, NButton, NDropdown, NAvatar, NSpace } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { useVideoStore } from '@/stores/video'
import ThemeToggle from '@/components/theme/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const userStore = useUserStore()
const videoStore = useVideoStore()

const searchKeyword = ref('')

const activeCategory = computed(() => videoStore.currentCategory)

function handleCategoryClick(slug: string) {
  videoStore.setCategory(slug)
  router.push({ name: 'Home', query: { category: slug } })
}

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
</script>

<template>
  <header class="app-header sticky top-0 z-50 bg-[var(--bg-color)] border-b border-[var(--border-color)] shadow-sm">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <div class="flex items-center gap-8">
        <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-primary-500">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 4v8l6-4-6-4z"/>
          </svg>
          <span>Anime Video</span>
        </router-link>

        <nav class="hidden md:flex items-center gap-1">
          <button
            v-for="category in videoStore.categories"
            :key="category.slug"
            @click="handleCategoryClick(category.slug)"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              activeCategory === category.slug
                ? 'bg-primary-500 text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            ]"
          >
            {{ category.name }}
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center">
          <NInput
            v-model:value="searchKeyword"
            placeholder="搜索动漫..."
            clearable
            @keyup.enter="handleSearch"
            class="w-48 lg:w-64"
          >
            <template #suffix>
              <button @click="handleSearch" class="text-[var(--text-muted)] hover:text-primary-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </button>
            </template>
          </NInput>
        </div>

        <ThemeToggle />

        <template v-if="userStore.isLoggedIn">
          <NDropdown
            :options="userDropdownOptions"
            @select="handleUserDropdown"
            placement="bottom-end"
          >
            <NAvatar
              round
              :src="userStore.avatar"
              :alt="userStore.username"
              class="cursor-pointer"
            />
          </NDropdown>
        </template>
        <template v-else>
          <NButton
            type="primary"
            @click="router.push('/login')"
            size="small"
          >
            登录
          </NButton>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  backdrop-filter: blur(8px);
  background-color: rgba(var(--bg-color), 0.9);
}
</style>
