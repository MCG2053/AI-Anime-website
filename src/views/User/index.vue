<script setup lang="ts">
import { ref, computed } from 'vue'
import { NEmpty } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { generateMockVideos } from '@/services/mock'
import VideoCard from '@/components/common/VideoCard.vue'
import type { Video } from '@/types'

const userStore = useUserStore()

const user = computed(() => userStore.user)

const activeTab = ref('watching')

const stats = ref({
  watching: 12,
  completed: 86,
  history: 234
})

const userVideos = ref<Video[]>(generateMockVideos(12))
const favorites = ref<Video[]>(generateMockVideos(8))
const history = ref<Video[]>(generateMockVideos(6))

const tabs = [
  { key: 'watching', label: '正在追', icon: 'play' },
  { key: 'completed', label: '已追完', icon: 'check' },
  { key: 'history', label: '历史', icon: 'history' }
]
</script>

<template>
  <div class="user-space">
    <div class="user-space__main">
      <div class="user-space__header">
        <div class="user-space__avatar-wrapper">
          <img
            :src="user?.avatar"
            :alt="user?.username"
            class="user-space__avatar"
          />
        </div>

        <div class="user-space__info">
          <h1 class="user-space__username">{{ user?.username }}</h1>
          <p class="user-space__sign">这个人很懒，什么都没写~</p>
        </div>

        <div class="user-space__stats">
          <div class="user-space__stat-item">
            <span class="user-space__stat-value">{{ stats.watching }}</span>
            <span class="user-space__stat-label">正在追</span>
          </div>
          <div class="user-space__stat-item">
            <span class="user-space__stat-value">{{ stats.completed }}</span>
            <span class="user-space__stat-label">已追完</span>
          </div>
          <div class="user-space__stat-item">
            <span class="user-space__stat-value">{{ stats.history }}</span>
            <span class="user-space__stat-label">历史</span>
          </div>
        </div>
      </div>

      <div class="user-space__nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['user-space__nav-item', { 'user-space__nav-item--active': activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <svg v-if="tab.icon === 'play'" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else-if="tab.icon === 'check'" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg v-else-if="tab.icon === 'history'" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
          </svg>
          {{ tab.label }}
        </button>
      </div>

      <div class="user-space__content">
        <template v-if="activeTab === 'watching'">
          <div class="user-space__section-header">
            <h2 class="user-space__section-title">正在追</h2>
            <span class="user-space__section-count">共 {{ userVideos.length }} 部</span>
          </div>
          <div v-if="userVideos.length > 0" class="user-space__video-grid">
            <VideoCard
              v-for="video in userVideos"
              :key="video.id"
              :video="video"
            />
          </div>
          <NEmpty v-else description="暂无追番" class="user-space__empty" />
        </template>

        <template v-else-if="activeTab === 'completed'">
          <div class="user-space__section-header">
            <h2 class="user-space__section-title">已追完</h2>
            <span class="user-space__section-count">{{ favorites.length }} 部</span>
          </div>
          <div v-if="favorites.length > 0" class="user-space__video-grid">
            <VideoCard
              v-for="video in favorites"
              :key="video.id"
              :video="video"
            />
          </div>
          <NEmpty v-else description="暂无已追完的番剧" class="user-space__empty" />
        </template>

        <template v-else-if="activeTab === 'history'">
          <div class="user-space__section-header">
            <h2 class="user-space__section-title">观看历史</h2>
            <button class="user-space__clear-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              清空历史
            </button>
          </div>
          <div v-if="history.length > 0" class="user-space__video-grid">
            <VideoCard
              v-for="video in history"
              :key="video.id"
              :video="video"
            />
          </div>
          <NEmpty v-else description="暂无观看记录" class="user-space__empty" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-space {
  min-height: calc(100vh - 60px);
  background-color: var(--bg-color);
  padding: var(--spacing-lg) 0;
}

.user-space__main {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  padding-bottom: var(--spacing-2xl);
  box-shadow: inset 0 4px 24px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-lg);
}

.dark .user-space__main {
  box-shadow: inset 0 4px 32px rgba(0, 0, 0, 0.4);
}

.user-space__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: transparent;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.user-space__avatar-wrapper {
  position: relative;
  flex-shrink: 0;
  padding: 3px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
}

.user-space__avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  object-fit: cover;
  display: block;
}

.user-space__info {
  flex: 1;
  min-width: 0;
}

.user-space__username {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--spacing-xs) 0;
}

.user-space__sign {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.user-space__stats {
  display: flex;
  gap: var(--spacing-xl);
  padding: 0 var(--spacing-lg);
}

.user-space__stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.user-space__stat-item:hover {
  opacity: 0.8;
}

.user-space__stat-value {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-space__stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.user-space__nav {
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background-color: transparent;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
}

.user-space__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-space__nav-item:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.user-space__nav-item--active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  color: #ec4899;
}

.user-space__content {
  background-color: transparent;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.user-space__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.user-space__section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.user-space__section-count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.user-space__clear-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  background-color: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-space__clear-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
}

.user-space__video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

@media (min-width: 640px) {
  .user-space__video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .user-space__video-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .user-space__video-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1280px) {
  .user-space__video-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.user-space__empty {
  padding: var(--spacing-2xl);
}

@media (max-width: 768px) {
  .user-space {
    padding: var(--spacing-md) 0;
  }

  .user-space__main {
    padding: var(--spacing-md);
    padding-bottom: var(--spacing-xl);
    margin: 0 var(--spacing-md);
    border-radius: var(--radius-md);
  }

  .user-space__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-space__avatar-wrapper {
    padding: 2px;
  }

  .user-space__avatar {
    width: 64px;
    height: 64px;
  }

  .user-space__stats {
    padding: var(--spacing-md) 0;
  }

  .user-space__nav {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
