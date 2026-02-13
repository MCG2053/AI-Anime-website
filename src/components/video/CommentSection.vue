<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { NAvatar, NButton, NInput, NSpin, NEmpty } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import type { Comment } from '@/types'
import { formatDistanceToNow } from '@/utils/date'

const props = defineProps<{
  comments: Comment[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', content: string): void
  (e: 'like', id: number): void
}>()

const userStore = useUserStore()

const newComment = ref('')
const replyTo = ref<Comment | null>(null)

function handleSubmit() {
  if (!newComment.value.trim()) return
  emit('submit', newComment.value.trim())
  newComment.value = ''
  replyTo.value = null
}

function handleLike(comment: Comment) {
  emit('like', comment.id)
}

function setReply(comment: Comment) {
  replyTo.value = comment
  newComment.value = `@${comment.username} `
}

function formatTime(date: string): string {
  return formatDistanceToNow(new Date(date))
}
</script>

<template>
  <div class="comment-section">
    <h3 class="text-lg font-medium mb-4">评论 ({{ comments.length }})</h3>

    <div v-if="userStore.isLoggedIn" class="comment-form mb-6">
      <div class="flex gap-3">
        <NAvatar
          :src="userStore.avatar"
          :alt="userStore.username"
          round
          size="small"
        />
        <div class="flex-1">
          <NInput
            v-model:value="newComment"
            type="textarea"
            placeholder="发表你的看法..."
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
          <div class="flex justify-end mt-2">
            <NButton
              type="primary"
              size="small"
              :disabled="!newComment.trim()"
              @click="handleSubmit"
            >
              发表评论
            </NButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg text-center text-sm text-[var(--text-muted)]">
      请先<router-link to="/login" class="text-primary-500 hover:underline">登录</router-link>后发表评论
    </div>

    <NSpin :show="loading">
      <div v-if="comments.length > 0" class="comment-list space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item p-4 bg-[var(--bg-secondary)] rounded-lg"
        >
          <div class="flex gap-3">
            <NAvatar
              :src="comment.avatar"
              :alt="comment.username"
              round
              size="small"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-sm">{{ comment.username }}</span>
                <span class="text-xs text-[var(--text-muted)]">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <p class="text-sm text-[var(--text-color)] mb-2">{{ comment.content }}</p>
              <div class="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <button
                  @click="handleLike(comment)"
                  class="flex items-center gap-1 hover:text-primary-500 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                  {{ comment.likeCount }}
                </button>
                <button
                  @click="setReply(comment)"
                  class="hover:text-primary-500 transition-colors"
                >
                  回复
                </button>
              </div>

              <div v-if="comment.replies && comment.replies.length > 0" class="mt-3 pl-4 border-l-2 border-[var(--border-color)] space-y-3">
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="text-sm"
                >
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium">{{ reply.username }}</span>
                    <span class="text-xs text-[var(--text-muted)]">{{ formatTime(reply.createdAt) }}</span>
                  </div>
                  <p class="text-[var(--text-secondary)]">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NEmpty v-else description="暂无评论，快来发表第一条评论吧！" />
    </NSpin>
  </div>
</template>
