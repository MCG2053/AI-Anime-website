<script setup lang="ts">
import { ref } from 'vue'
import { NAvatar, NInput, NSpin, NEmpty } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import type { Comment } from '@/types'
import { formatDistanceToNow } from '@/utils/date'

const props = defineProps<{
  comments: Comment[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', content: string, parentId?: number): void
  (e: 'like', id: number): void
}>()

const userStore = useUserStore()

const newComment = ref('')
const replyTo = ref<Comment | null>(null)
const replyContent = ref('')

function handleSubmit() {
  if (!newComment.value.trim()) return
  emit('submit', newComment.value.trim())
  newComment.value = ''
}

function handleReplySubmit() {
  if (!replyContent.value.trim() || !replyTo.value) return
  emit('submit', replyContent.value.trim(), replyTo.value.id)
  replyContent.value = ''
  replyTo.value = null
}

function handleLike(comment: Comment) {
  emit('like', comment.id)
}

function setReply(comment: Comment) {
  replyTo.value = comment
  replyContent.value = `@${comment.username} `
}

function cancelReply() {
  replyTo.value = null
  replyContent.value = ''
}

function formatTime(date: string): string {
  return formatDistanceToNow(new Date(date))
}
</script>

<template>
  <div class="comment-section">
    <div class="comment-container">
      <div v-if="userStore.isLoggedIn" class="comment-form">
        <div class="comment-form__inner">
          <NAvatar
            :src="userStore.avatar"
            :alt="userStore.username"
            round
            :size="36"
            class="comment-form__avatar"
          />
          <div class="comment-form__input-wrapper">
            <NInput
              v-model:value="newComment"
              type="textarea"
              placeholder="发表你的看法..."
              :autosize="{ minRows: 2, maxRows: 4 }"
              class="comment-form__input"
            />
          </div>
        </div>
        <div class="comment-form__actions">
          <button
            class="comment-submit-btn"
            :disabled="!newComment.trim()"
            @click="handleSubmit"
          >
            发表评论
          </button>
        </div>
      </div>
      <div v-else class="comment-login-hint">
        请先<router-link to="/login" class="comment-login-hint__link">登录</router-link>后发表评论
      </div>

      <NSpin :show="loading">
        <div v-if="comments.length > 0" class="comment-list">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <NAvatar
              :src="comment.avatar"
              :alt="comment.username"
              round
              :size="36"
            />
            <div class="comment-item__content">
              <div class="comment-item__header">
                <span class="comment-item__username">{{ comment.username }}</span>
                <span class="comment-item__time">{{ formatTime(comment.createdAt) }}</span>
              </div>
              <p class="comment-item__text">{{ comment.content }}</p>
              <div class="comment-item__actions">
                <button
                  @click="handleLike(comment)"
                  class="comment-action"
                >
                  <svg class="comment-action__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                  <span>{{ comment.likeCount }}</span>
                </button>
                <button
                  @click="setReply(comment)"
                  class="comment-action"
                >
                  <svg class="comment-action__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                  </svg>
                  <span>回复</span>
                </button>
              </div>

              <div v-if="comment.replies && comment.replies.length > 0" class="comment-replies">
                <div
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="comment-reply"
                >
                  <NAvatar
                    :src="reply.avatar"
                    :alt="reply.username"
                    round
                    :size="36"
                  />
                  <div class="comment-reply__content">
                    <div class="comment-reply__header">
                      <span class="comment-reply__username">{{ reply.username }}</span>
                      <span class="comment-reply__time">{{ formatTime(reply.createdAt) }}</span>
                    </div>
                    <p class="comment-reply__text">{{ reply.content }}</p>
                  </div>
                </div>
              </div>

              <div v-if="replyTo?.id === comment.id" class="comment-reply-form">
                <div class="comment-reply-form__inner">
                  <NAvatar
                    :src="userStore.avatar"
                    :alt="userStore.username"
                    round
                    :size="36"
                    class="comment-reply-form__avatar"
                  />
                  <div class="comment-reply-form__input-wrapper">
                    <NInput
                      v-model:value="replyContent"
                      type="textarea"
                      placeholder="发表你的看法..."
                      :autosize="{ minRows: 2, maxRows: 4 }"
                      class="comment-reply-form__input"
                    />
                  </div>
                </div>
                <div class="comment-reply-form__actions">
                  <button class="comment-cancel-btn" @click="cancelReply">
                    取消
                  </button>
                  <button
                    class="comment-submit-btn"
                    :disabled="!replyContent.trim()"
                    @click="handleReplySubmit"
                  >
                    发表评论
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NEmpty v-else description="暂无评论，快来发表第一条评论吧！" />
      </NSpin>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  padding: 0;
}

.comment-container {
  background-color: var(--bg-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.comment-form {
  padding: var(--spacing-md);
}

.comment-form__inner {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.comment-form__avatar {
  margin-top: 0;
}

.comment-form__input-wrapper {
  flex: 1;
}

.comment-form__input-wrapper :deep(.n-input) {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: none !important;
  outline: none !important;
}

.comment-form__input-wrapper :deep(.n-input:hover) {
  background-color: var(--bg-color);
  border-color: var(--border-color) !important;
  box-shadow: none !important;
}

.comment-form__input-wrapper :deep(.n-input:focus-within) {
  background-color: var(--bg-color);
  border-color: var(--border-color) !important;
  caret-color: var(--text-color);
  box-shadow: none !important;
  outline: none !important;
}

.comment-form__input-wrapper :deep(.n-input__border),
.comment-form__input-wrapper :deep(.n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.comment-form__input-wrapper :deep(.n-input:focus-within .n-input__border),
.comment-form__input-wrapper :deep(.n-input:focus-within .n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.comment-form__input-wrapper :deep(.n-input .n-input__border) {
  border: none !important;
}

.comment-form__input-wrapper :deep(.n-input:focus-within .n-input__border) {
  border: none !important;
}

.comment-form__input-wrapper :deep(.n-input-wrapper) {
  padding: 2px 6px;
}

.comment-form__input-wrapper :deep(textarea) {
  outline: none !important;
  box-shadow: none !important;
}

.comment-form__input-wrapper :deep(textarea:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.comment-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
}

.comment-submit-btn {
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.comment-submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.comment-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-cancel-btn {
  padding: 6px 16px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.comment-cancel-btn:hover {
  background-color: var(--bg-hover);
}

.comment-login-hint {
  padding: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.comment-login-hint__link {
  color: var(--color-primary);
  margin: 0 var(--spacing-xs);
}

.comment-login-hint__link:hover {
  text-decoration: underline;
}

.comment-list {
  display: flex;
  flex-direction: column;
}

.comment-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.comment-item__content {
  flex: 1;
  min-width: 0;
}

.comment-item__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.comment-item__username {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
}

.comment-item__time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.comment-item__text {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
  word-break: break-word;
}

.comment-item__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.comment-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.comment-action:hover {
  color: var(--color-primary);
}

.comment-action__icon {
  width: 14px;
  height: 14px;
}

.comment-replies {
  margin-top: var(--spacing-sm);
  padding-left: var(--spacing-md);
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.comment-reply {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}

.comment-reply__content {
  flex: 1;
  min-width: 0;
}

.comment-reply__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.comment-reply__username {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
}

.comment-reply__time {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.comment-reply__text {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--text-color);
  word-break: break-word;
}

.comment-reply-form {
  margin-top: var(--spacing-sm);
  padding: var(--spacing-sm) 0;
}

.comment-reply-form__inner {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
}

.comment-reply-form__avatar {
  margin-top: 0;
}

.comment-reply-form__input-wrapper {
  flex: 1;
}

.comment-reply-form__input-wrapper :deep(.n-input) {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: none !important;
  outline: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input:hover) {
  background-color: var(--bg-color);
  border-color: var(--border-color) !important;
  box-shadow: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input:focus-within) {
  background-color: var(--bg-color);
  border-color: var(--border-color) !important;
  caret-color: var(--text-color);
  box-shadow: none !important;
  outline: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input__border),
.comment-reply-form__input-wrapper :deep(.n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input:focus-within .n-input__border),
.comment-reply-form__input-wrapper :deep(.n-input:focus-within .n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input .n-input__border) {
  border: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input:focus-within .n-input__border) {
  border: none !important;
}

.comment-reply-form__input-wrapper :deep(.n-input-wrapper) {
  padding: 2px 6px;
}

.comment-reply-form__input-wrapper :deep(textarea) {
  outline: none !important;
  box-shadow: none !important;
}

.comment-reply-form__input-wrapper :deep(textarea:focus) {
  outline: none !important;
  box-shadow: none !important;
}

.comment-reply-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

@media (max-width: 640px) {
  .comment-form__inner {
    flex-direction: row;
    align-items: flex-start;
  }

  .comment-form__input-wrapper {
    width: 100%;
  }

  .comment-item {
    padding: var(--spacing-sm);
  }

  .comment-replies {
    padding-left: var(--spacing-sm);
  }

  .comment-reply {
    padding: var(--spacing-xs) 0;
  }

  .comment-reply-form__inner {
    flex-direction: row;
    align-items: flex-start;
  }

  .comment-reply-form__input-wrapper {
    width: 100%;
  }
}
</style>
