<script setup lang="ts">
import { computed } from 'vue'
import { NTabs, NTabPane, NCard, NAvatar, NButton, NEmpty } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { generateMockVideos } from '@/services/mock'
import VideoCard from '@/components/video/VideoCard.vue'

const userStore = useUserStore()

const user = computed(() => userStore.user)
const favorites = computed(() => generateMockVideos(6))
const history = computed(() => generateMockVideos(4))
</script>

<template>
  <div class="user-center-page">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <NCard class="mb-6">
        <div class="flex items-center gap-4">
          <NAvatar
            :src="user?.avatar"
            :alt="user?.username"
            :size="80"
            round
          />
          <div>
            <h2 class="text-xl font-bold">{{ user?.username }}</h2>
            <p class="text-sm text-[var(--text-muted)]">{{ user?.email }}</p>
            <p class="text-xs text-[var(--text-muted)] mt-1">
              注册时间: {{ new Date(user?.createdAt || '').toLocaleDateString() }}
            </p>
          </div>
        </div>
      </NCard>

      <NTabs type="line" animated>
        <NTabPane name="favorites" tab="我的收藏">
          <div v-if="favorites.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4">
            <VideoCard
              v-for="video in favorites"
              :key="video.id"
              :video="video"
            />
          </div>
          <NEmpty v-else description="暂无收藏" class="py-12" />
        </NTabPane>
        <NTabPane name="history" tab="观看历史">
          <div v-if="history.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-4">
            <VideoCard
              v-for="video in history"
              :key="video.id"
              :video="video"
            />
          </div>
          <NEmpty v-else description="暂无观看记录" class="py-12" />
        </NTabPane>
        <NTabPane name="settings" tab="账号设置">
          <div class="py-4">
            <p class="text-[var(--text-muted)]">账号设置功能开发中...</p>
          </div>
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>
