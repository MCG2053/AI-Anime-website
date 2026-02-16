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
        <div class="watch-page__main">
          <div class="watch-page__player">
            <VideoPlayer
              :url="video.videoUrl"
              :poster="video.cover"
              @timeupdate="handleTimeUpdate"
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
          </div>
        </div>

        <div class="watch-page__sidebar">
          <div class="watch-page__detail-card">
            <div class="watch-page__detail-cover">
              <img :src="video.cover" :alt="video.title" @click="goToDetail" />
            </div>
            <div class="watch-page__detail-info">
              <h4 class="watch-page__detail-title" @click="goToDetail">{{ video.title }}</h4>
              <div class="watch-page__detail-meta">
                <span>{{ video.year }}</span>
                <span>{{ video.country }}</span>
                <span>{{ video.episode }}</span>
              </div>
              <div class="watch-page__detail-stats">
                <span class="watch-page__detail-stat">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {{ video.playCount }}
                </span>
              </div>
            </div>
          </div>

          <div class="watch-page__related">
            <h3 class="watch-page__section-title">相关推荐</h3>
            <div class="watch-page__related-list">
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
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-lg);
}

.watch-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.watch-page__player {
  background-color: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 9;
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
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
}

.watch-page__episodes {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.watch-page__episode-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .watch-page__episode-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 480px) {
  .watch-page__episode-list {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xs);
  }
}

.watch-page__episode-btn {
  padding: var(--spacing-xs) var(--spacing-md);
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

.watch-page__comments {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.watch-page__sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.watch-page__detail-card {
  display: flex;
  gap: var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.watch-page__detail-cover {
  flex-shrink: 0;
  width: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
}

.watch-page__detail-cover img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.watch-page__detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.watch-page__detail-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.watch-page__detail-title:hover {
  color: var(--color-primary);
}

.watch-page__detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.watch-page__detail-stats {
  margin-top: auto;
}

.watch-page__detail-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.watch-page__detail-stat svg {
  width: 14px;
  height: 14px;
}

.watch-page__related {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.watch-page__related-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.watch-page__related-item {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast);
}

.watch-page__related-item:hover {
  background-color: var(--bg-hover);
}

.watch-page__related-cover {
  width: 80px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.watch-page__related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
}

.watch-page__related-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
  line-clamp: 2;
}

.watch-page__related-views {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .watch-page__container {
    grid-template-columns: 1fr;
  }

  .watch-page__sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  .watch-page__detail-card {
    display: none;
  }

  .watch-page__related {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .watch-page__sidebar {
    grid-template-columns: 1fr;
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
}
</style>
