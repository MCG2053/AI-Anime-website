<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useAnimeListStore } from '@/stores/animeList'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import CommentSection from '@/components/video/CommentSection.vue'
import { generateMockVideoDetail, mockComments, generateMockVideos } from '@/services/mock'
import type { VideoDetail, Comment } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const animeListStore = useAnimeListStore()

const loading = ref(true)
const video = ref<VideoDetail | null>(null)
const comments = ref<Comment[]>(mockComments)
const currentTime = ref(0)
const relatedVideos = ref<any[]>([])
const hasRecordedHistory = ref(false)

const videoId = computed(() => Number(route.params.id))
const episodeId = computed(() => Number(route.params.episode) || 1)

const currentEpisode = computed(() => {
  if (!video.value) return null
  return video.value.episodes.find(e => e.id === episodeId.value) || video.value.episodes[0]
})

const animeStatus = computed(() => {
  if (!video.value) return null
  return animeListStore.getAnimeStatus(video.value.id)
})

const isWatching = computed(() => animeStatus.value === 'watching')
const isCompleted = computed(() => animeStatus.value === 'completed')

function handleTimeUpdate(time: number) {
  currentTime.value = time
}

function handlePlay() {
  console.log('handlePlay called', { video: video.value, currentEpisode: currentEpisode.value, hasRecordedHistory: hasRecordedHistory.value })
  if (!video.value || !currentEpisode.value) return
  
  if (!hasRecordedHistory.value) {
    console.log('Adding to history:', video.value.title, currentEpisode.value.title)
    animeListStore.addToHistory(
      video.value,
      currentEpisode.value.id,
      currentEpisode.value.title,
      0
    )
    hasRecordedHistory.value = true
    console.log('History count after adding:', animeListStore.historyCount)
  }
}

function handleCommentSubmit(content: string) {
  if (!userStore.isLoggedIn) return

  const newComment: Comment = {
    id: Date.now(),
    userId: userStore.user!.id,
    username: userStore.username,
    avatar: userStore.avatar,
    content,
    likeCount: 0,
    createdAt: new Date().toISOString()
  }
  comments.value.unshift(newComment)
}

function handleCommentLike(id: number) {
  const comment = comments.value.find(c => c.id === id)
  if (comment) {
    comment.likeCount++
  }
}

function handleEpisodeClick(epId: number) {
  router.push(`/watch/${video.value?.id}/${epId}`)
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

function goToDetail() {
  router.push(`/bangumi/${videoId.value}`)
}

function loadVideo() {
  loading.value = true
  hasRecordedHistory.value = false
  setTimeout(() => {
    video.value = generateMockVideoDetail(videoId.value)
    relatedVideos.value = generateMockVideos(6)
    loading.value = false
  }, 500)
}

watch([videoId, episodeId], loadVideo)

onMounted(loadVideo)
</script>

<template>
  <div class="watch-page">
    <NSpin :show="loading">
      <div v-if="video" class="watch-page__container">
        <div class="watch-page__player">
          <VideoPlayer
            :url="video.videoUrl"
            :poster="video.cover"
            @timeupdate="handleTimeUpdate"
            @play="handlePlay"
          />
        </div>

        <div class="watch-page__info">
          <div class="watch-page__header">
            <div class="watch-page__title-area">
              <h1 class="watch-page__title" @click="goToDetail">{{ video.title }}</h1>
              <span class="watch-page__episode" v-if="currentEpisode">{{ currentEpisode.title }}</span>
            </div>
            <div class="watch-page__actions">
              <button 
                :class="['watch-page__action-btn', { 'watch-page__action-btn--active': isWatching }]" 
                @click="handleWatching"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                正在追
              </button>
              <button 
                :class="['watch-page__action-btn', { 'watch-page__action-btn--active': isCompleted }]" 
                @click="handleCompleted"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                已追完
              </button>
            </div>
          </div>

          <div class="watch-page__episodes">
            <h3 class="watch-page__section-title">选集</h3>
            <div class="watch-page__episode-list">
              <button
                v-for="episode in video.episodes"
                :key="episode.id"
                :class="['watch-page__episode-btn', { 'watch-page__episode-btn--active': episode.id === episodeId }]"
                @click="handleEpisodeClick(episode.id)"
              >
                {{ episode.title }}
              </button>
            </div>
          </div>

          <div class="watch-page__comments">
            <h3 class="watch-page__section-title">评论</h3>
            <CommentSection
              :comments="comments"
              @submit="handleCommentSubmit"
              @like="handleCommentLike"
            />
          </div>

          <div class="watch-page__related">
            <h3 class="watch-page__section-title">相关推荐</h3>
            <div class="watch-page__related-grid">
              <router-link
                v-for="v in relatedVideos"
                :key="v.id"
                :to="`/bangumi/${v.id}`"
                class="watch-page__related-item"
              >
                <img :src="v.cover" :alt="v.title" class="watch-page__related-cover" />
                <div class="watch-page__related-info">
                  <h4 class="watch-page__related-title">{{ v.title }}</h4>
                  <span class="watch-page__related-views">{{ v.views }} 播放</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.watch-page {
  min-height: calc(100vh - 64px);
  background-color: var(--bg-color);
}

.watch-page__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.watch-page__player {
  background-color: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  width: 100%;
}

.watch-page__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.watch-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.watch-page__title-area {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.watch-page__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  transition: color var(--transition-fast);
  margin: 0;
}

.watch-page__title:hover {
  color: var(--color-primary);
}

.watch-page__episode {
  display: inline-block;
  padding: 4px 10px;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  background-color: var(--color-primary-light);
  border-radius: var(--radius-sm);
}

.watch-page__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.watch-page__action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 16px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.watch-page__action-btn svg {
  width: 16px;
  height: 16px;
}

.watch-page__action-btn:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
  border-color: var(--color-primary);
}

.watch-page__action-btn--active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.watch-page__action-btn--active:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.watch-page__section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-strong);
}

.watch-page__episodes {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .watch-page__episodes {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .watch-page__episodes {
    padding: var(--spacing-sm);
  }
}

.watch-page__episode-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-sm);
}

.watch-page__episode-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.watch-page__episode-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.watch-page__episode-btn--active {
  color: white;
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.watch-page__related {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .watch-page__related {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .watch-page__related {
    padding: var(--spacing-sm);
  }
}

.watch-page__related-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-md);
}

.watch-page__related-item {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast);
}

.watch-page__related-item:hover {
  transform: translateY(-4px);
}

.watch-page__related-cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.watch-page__related-info {
  padding: var(--spacing-xs) 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.watch-page__related-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.watch-page__related-views {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.watch-page__comments {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

@media (max-width: 768px) {
  .watch-page__comments {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .watch-page__comments {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 1200px) {
  .watch-page__related-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 1024px) {
  .watch-page__related-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .watch-page__episode-list {
    grid-template-columns: repeat(4, 1fr);
  }

  .watch-page__related-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .watch-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .watch-page__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .watch-page__related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .watch-page__episode-list {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xs);
  }
}
</style>
