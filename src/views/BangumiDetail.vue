<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useAnimeListStore } from '@/stores/animeList'
import VideoCard from '@/components/common/VideoCard.vue'
import { generateMockVideoDetail, generateMockVideos } from '@/services/mock'
import type { VideoDetail } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const animeListStore = useAnimeListStore()

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

const animeStatus = computed(() => {
  if (!video.value) return null
  return animeListStore.getAnimeStatus(video.value.id)
})

const isWatching = computed(() => animeStatus.value === 'watching')
const isCompleted = computed(() => animeStatus.value === 'completed')

function handlePlay() {
  if (video.value && video.value.episodes.length > 0) {
    router.push(`/watch/${video.value.id}/1`)
  }
}

async function handleWatching() {
  if (!video.value) return
  if (!userStore.isLoggedIn) {
    console.log('Please login first')
    return
  }
  
  if (isWatching.value) {
    await animeListStore.removeAnime(video.value.id)
  } else {
    await animeListStore.addToWatching(video.value)
  }
}

async function handleCompleted() {
  if (!video.value) return
  if (!userStore.isLoggedIn) {
    console.log('Please login first')
    return
  }
  
  if (isCompleted.value) {
    await animeListStore.removeAnime(video.value.id)
  } else {
    await animeListStore.addToCompleted(video.value)
  }
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

            <div class="bangumi-detail__desc-section">
              <h2 class="bangumi-detail__desc-title">简介</h2>
              <p class="bangumi-detail__desc" @click="isDescExpanded = !isDescExpanded">
                {{ truncatedDesc }}
                <span v-if="video.description.length > 150" class="bangumi-detail__desc-toggle">
                  {{ isDescExpanded ? '收起' : '展开' }}
                </span>
              </p>
            </div>

            <div class="bangumi-detail__actions">
              <button class="bangumi-detail__action-btn bangumi-detail__action-btn--primary" @click="handlePlay">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                立即播放
              </button>
              <button 
                :class="['bangumi-detail__action-btn', { 'bangumi-detail__action-btn--active': isWatching }]" 
                @click="handleWatching"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                {{ isWatching ? '正在追' : '正在追' }}
              </button>
              <button 
                :class="['bangumi-detail__action-btn', { 'bangumi-detail__action-btn--active': isCompleted }]" 
                @click="handleCompleted"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {{ isCompleted ? '已追完' : '已追完' }}
              </button>
            </div>
          </div>
        </div>

        <div class="bangumi-detail__content">
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

          <div class="bangumi-detail__section">
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
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.bangumi-detail__cover {
  flex-shrink: 0;
  width: 320px;
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
  gap: var(--spacing-lg);
}

.bangumi-detail__title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
  margin: 0;
}

.bangumi-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

.bangumi-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bangumi-detail__meta-item svg {
  width: 18px;
  height: 18px;
  opacity: 0.6;
}

.bangumi-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.bangumi-detail__tag {
  padding: 6px 14px;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background-color: var(--bg-color);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bangumi-detail__tag:hover {
  background-color: var(--color-primary);
  color: white;
}

.bangumi-detail__desc-section {
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.bangumi-detail__desc-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.bangumi-detail__desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.8;
  cursor: pointer;
  margin: 0;
}

.bangumi-detail__desc-toggle {
  color: var(--color-primary);
  margin-left: var(--spacing-xs);
}

.bangumi-detail__actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.bangumi-detail__action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.bangumi-detail__action-btn svg {
  width: 18px;
  height: 18px;
}

.bangumi-detail__action-btn:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
  border-color: var(--color-primary);
}

.bangumi-detail__action-btn--primary {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.bangumi-detail__action-btn--primary:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.bangumi-detail__action-btn--active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.bangumi-detail__action-btn--active:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.bangumi-detail__content {
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
  border-bottom: 2px solid var(--border-strong);
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

.bangumi-detail__related {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 1200px) {
  .bangumi-detail__related {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1024px) {
  .bangumi-detail__related {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .bangumi-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--spacing-lg);
  }

  .bangumi-detail__cover {
    width: 200px;
  }

  .bangumi-detail__info {
    align-items: center;
  }

  .bangumi-detail__tags {
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
