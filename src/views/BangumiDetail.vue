<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin, NButton } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import VideoCard from '@/components/common/VideoCard.vue'
import { generateMockVideoDetail, generateMockVideos } from '@/services/mock'
import type { VideoDetail } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const video = ref<VideoDetail | null>(null)
const relatedVideos = ref<any[]>([])
const isDescExpanded = ref(false)

const videoId = computed(() => Number(route.params.id))

const truncatedDesc = computed(() => {
  if (!video.value?.description) return ''
  if (isDescExpanded.value) return video.value.description
  return video.value.description.length > 150 
    ? video.value.description.slice(0, 150) + '...' 
    : video.value.description
})

function handlePlay() {
  if (video.value && video.value.episodes.length > 0) {
    router.push(`/watch/${video.value.id}/1`)
  }
}

function handleLike() {
  console.log('Like video:', videoId.value)
}

function handleCollect() {
  console.log('Collect video:', videoId.value)
}

function handleEpisodeClick(episodeId: number) {
  router.push(`/watch/${video.value?.id}/${episodeId}`)
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    video.value = generateMockVideoDetail(videoId.value)
    relatedVideos.value = generateMockVideos(12)
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="bangumi-detail">
    <NSpin :show="loading">
      <div v-if="video" class="bangumi-detail__container">
        <div class="bangumi-detail__header">
          <div class="bangumi-detail__cover">
            <img :src="video.cover" :alt="video.title" />
          </div>
          <div class="bangumi-detail__info">
            <h1 class="bangumi-detail__title">{{ video.title }}</h1>
            
            <div class="bangumi-detail__meta">
              <span class="bangumi-detail__meta-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                {{ video.playCount }}
              </span>
              <span class="bangumi-detail__meta-item">{{ video.year }}</span>
              <span class="bangumi-detail__meta-item">{{ video.country }}</span>
              <span class="bangumi-detail__meta-item">{{ video.episode }}</span>
            </div>

            <div class="bangumi-detail__tags">
              <span v-for="tag in video.tags" :key="tag" class="bangumi-detail__tag">
                {{ tag }}
              </span>
            </div>

            <div class="bangumi-detail__stats">
              <div class="bangumi-detail__stat">
                <span class="bangumi-detail__stat-value">{{ video.likeCount }}</span>
                <span class="bangumi-detail__stat-label">点赞</span>
              </div>
              <div class="bangumi-detail__stat">
                <span class="bangumi-detail__stat-value">{{ video.collectCount }}</span>
                <span class="bangumi-detail__stat-label">收藏</span>
              </div>
            </div>

            <div class="bangumi-detail__actions">
              <NButton type="primary" size="large" @click="handlePlay">
                <template #icon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </template>
                立即播放
              </NButton>
              <NButton size="large" @click="handleLike">
                <template #icon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </template>
                点赞
              </NButton>
              <NButton size="large" @click="handleCollect">
                <template #icon>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                </template>
                收藏
              </NButton>
            </div>
          </div>
        </div>

        <div class="bangumi-detail__content">
          <div class="bangumi-detail__main">
            <div class="bangumi-detail__section">
              <h2 class="bangumi-detail__section-title">简介</h2>
              <p class="bangumi-detail__desc" @click="isDescExpanded = !isDescExpanded">
                {{ truncatedDesc }}
                <span v-if="video.description.length > 150" class="bangumi-detail__desc-toggle">
                  {{ isDescExpanded ? '收起' : '展开' }}
                </span>
              </p>
            </div>

            <div class="bangumi-detail__section">
              <h2 class="bangumi-detail__section-title">选集</h2>
              <div class="bangumi-detail__episodes">
                <button
                  v-for="episode in video.episodes"
                  :key="episode.id"
                  class="bangumi-detail__episode"
                  @click="handleEpisodeClick(episode.id)"
                >
                  {{ episode.title }}
                </button>
              </div>
            </div>
          </div>

          <div class="bangumi-detail__sidebar">
            <h2 class="bangumi-detail__section-title">相关推荐</h2>
            <div class="bangumi-detail__related">
              <VideoCard
                v-for="v in relatedVideos"
                :key="v.id"
                :video="v"
              />
            </div>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.bangumi-detail {
  min-height: calc(100vh - 64px);
  background-color: var(--bg-color);
}

.bangumi-detail__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.bangumi-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.bangumi-detail__cover {
  flex-shrink: 0;
  width: 280px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.bangumi-detail__cover img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.bangumi-detail__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.bangumi-detail__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
}

.bangumi-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.bangumi-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.bangumi-detail__meta-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.bangumi-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.bangumi-detail__tag {
  padding: 4px 12px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bangumi-detail__tag:hover {
  background-color: var(--color-primary);
  color: white;
}

.bangumi-detail__stats {
  display: flex;
  gap: var(--spacing-xl);
}

.bangumi-detail__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bangumi-detail__stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-color);
}

.bangumi-detail__stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.bangumi-detail__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: auto;
}

.bangumi-detail__content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-xl);
}

.bangumi-detail__main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.bangumi-detail__section {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.bangumi-detail__section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.bangumi-detail__desc {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.8;
  cursor: pointer;
}

.bangumi-detail__desc-toggle {
  color: var(--color-primary);
  margin-left: var(--spacing-xs);
}

.bangumi-detail__episodes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-sm);
}

.bangumi-detail__episode {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bangumi-detail__episode:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.bangumi-detail__sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.bangumi-detail__related {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 1024px) {
  .bangumi-detail__content {
    grid-template-columns: 1fr;
  }

  .bangumi-detail__sidebar {
    order: -1;
  }

  .bangumi-detail__related {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .bangumi-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .bangumi-detail__cover {
    width: 200px;
  }

  .bangumi-detail__meta {
    justify-content: center;
  }

  .bangumi-detail__tags {
    justify-content: center;
  }

  .bangumi-detail__stats {
    justify-content: center;
  }

  .bangumi-detail__actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .bangumi-detail__related {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
