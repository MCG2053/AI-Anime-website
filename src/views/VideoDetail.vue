<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NSpin, NTabs, NTabPane, NButton, NSpace } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import DanmakuSender from '@/components/video/DanmakuSender.vue'
import CommentSection from '@/components/video/CommentSection.vue'
import { generateMockVideoDetail, generateMockDanmaku, mockComments } from '@/services/mock'
import type { VideoDetail, Danmaku, Comment } from '@/types'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const video = ref<VideoDetail | null>(null)
const comments = ref<Comment[]>(mockComments)
const danmakuList = ref<Danmaku[]>([])
const currentTime = ref(0)
const activeTab = ref('episodes')

const videoId = computed(() => Number(route.params.id))

function handleTimeUpdate(time: number) {
  currentTime.value = time
}

function handleDanmakuSend(danmaku: { content: string; color: string; type: string }) {
  if (!userStore.isLoggedIn) return

  const newDanmaku: Danmaku = {
    id: Date.now(),
    content: danmaku.content,
    time: currentTime.value,
    color: danmaku.color,
    type: danmaku.type as 'scroll' | 'top' | 'bottom',
    userId: userStore.user!.id,
    createdAt: new Date().toISOString()
  }
  danmakuList.value.push(newDanmaku)
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

function handleLike() {
  console.log('Like video:', videoId.value)
}

function handleCollect() {
  console.log('Collect video:', videoId.value)
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    video.value = generateMockVideoDetail(videoId.value)
    danmakuList.value = generateMockDanmaku(50)
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="video-detail-page">
    <NSpin :show="loading">
      <div v-if="video" class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <VideoPlayer
              :url="video.videoUrl"
              :poster="video.cover"
              @timeupdate="handleTimeUpdate"
            />

            <DanmakuSender
              :current-time="currentTime"
              @send="handleDanmakuSend"
              class="mt-4"
            />

            <div class="mt-6">
              <h1 class="text-xl font-bold mb-2">{{ video.title }}</h1>
              <div class="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {{ video.playCount }}
                </span>
                <span>{{ video.episode }}</span>
                <span>{{ video.year }}</span>
                <span>{{ video.country }}</span>
              </div>

              <NSpace class="mb-4">
                <NButton type="primary" @click="handleLike">
                  <template #icon>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </template>
                  点赞 {{ video.likeCount }}
                </NButton>
                <NButton @click="handleCollect">
                  <template #icon>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </template>
                  收藏 {{ video.collectCount }}
                </NButton>
              </NSpace>

              <p class="text-sm text-[var(--text-secondary)] mb-4">{{ video.description }}</p>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in video.tags"
                  :key="tag"
                  class="px-3 py-1 text-xs bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <NTabs v-model:value="activeTab" class="mt-6" type="line">
              <NTabPane name="episodes" tab="选集">
                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 py-4">
                  <NButton
                    v-for="episode in video.episodes"
                    :key="episode.id"
                    size="small"
                    secondary
                  >
                    {{ episode.title }}
                  </NButton>
                </div>
              </NTabPane>
              <NTabPane name="comments" tab="评论">
                <CommentSection
                  :comments="comments"
                  @submit="handleCommentSubmit"
                  @like="handleCommentLike"
                  class="py-4"
                />
              </NTabPane>
            </NTabs>
          </div>

          <div class="lg:col-span-1">
            <h3 class="text-lg font-medium mb-4">相关推荐</h3>
            <div class="space-y-4">
              <router-link
                v-for="relatedVideo in video.relatedVideos"
                :key="relatedVideo.id"
                :to="`/video/${relatedVideo.id}`"
                class="flex gap-3 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              >
                <img
                  :src="relatedVideo.cover"
                  :alt="relatedVideo.title"
                  class="w-24 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium line-clamp-2">{{ relatedVideo.title }}</h4>
                  <p class="text-xs text-[var(--text-muted)] mt-1">{{ relatedVideo.playCount }} 播放</p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>
