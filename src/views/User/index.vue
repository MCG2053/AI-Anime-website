<script setup lang="ts">
import { ref, computed } from 'vue'
import { NEmpty, NInput } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { useAnimeListStore } from '@/stores/animeList'
import VideoCard from '@/components/common/VideoCard.vue'
import VideoListItem from '@/components/common/VideoListItem.vue'
import ViewToggle from '@/components/common/ViewToggle.vue'
import type { Video } from '@/types'

const userStore = useUserStore()
const animeListStore = useAnimeListStore()

const user = computed(() => userStore.user)

const activeTab = ref('watching')
const viewMode = ref<'grid' | 'list'>('grid')

const stats = computed(() => ({
  watching: animeListStore.watchingCount,
  completed: animeListStore.completedCount,
  history: animeListStore.historyCount
}))

const tabs = [
  { key: 'watching', label: '正在追', icon: 'heart' },
  { key: 'completed', label: '已追完', icon: 'check' },
  { key: 'history', label: '历史', icon: 'history' }
]

const currentVideos = computed(() => {
  let list: Video[] = []
  if (activeTab.value === 'watching') {
    list = animeListStore.watchingList.map(item => item.video).filter(Boolean) as Video[]
  } else if (activeTab.value === 'completed') {
    list = animeListStore.completedList.map(item => item.video).filter(Boolean) as Video[]
  } else {
    list = animeListStore.watchHistory.map(item => item.video).filter(Boolean) as Video[]
  }
  return list
})

const showEditModal = ref(false)
const showAvatarModal = ref(false)
const editForm = ref({
  username: '',
  avatar: '',
  bio: ''
})

const avatarOptions = [
  'https://picsum.photos/seed/avatar1/200/200',
  'https://picsum.photos/seed/avatar2/200/200',
  'https://picsum.photos/seed/avatar3/200/200',
  'https://picsum.photos/seed/avatar4/200/200',
  'https://picsum.photos/seed/avatar5/200/200',
  'https://picsum.photos/seed/avatar6/200/200',
  'https://picsum.photos/seed/avatar7/200/200',
  'https://picsum.photos/seed/avatar8/200/200',
  'https://picsum.photos/seed/avatar9/200/200',
  'https://picsum.photos/seed/avatar10/200/200',
  'https://picsum.photos/seed/avatar11/200/200',
  'https://picsum.photos/seed/avatar12/200/200'
]

function openAvatarModal() {
  editForm.value = {
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    bio: user.value?.bio || ''
  }
  showAvatarModal.value = true
}

function openEditModal() {
  editForm.value = {
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    bio: user.value?.bio || ''
  }
  showEditModal.value = true
}

function selectAvatar(avatar: string) {
  editForm.value.avatar = avatar
}

function saveAvatar() {
  userStore.updateUserInfo({
    avatar: editForm.value.avatar
  })
  showAvatarModal.value = false
}

function saveProfile() {
  if (!editForm.value.username.trim()) {
    return
  }
  userStore.updateUserInfo({
    username: editForm.value.username.trim(),
    bio: editForm.value.bio.trim()
  })
  showEditModal.value = false
}

const userBio = computed(() => user.value?.bio || '这个人很懒，什么都没写~')
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
          <button class="user-space__avatar-edit" @click="openAvatarModal" title="更换头像">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>

        <div class="user-space__info">
          <h1 class="user-space__username">{{ user?.username }}</h1>
          <p class="user-space__sign">{{ userBio }}</p>
        </div>

        <div class="user-space__actions">
          <button class="user-space__edit-btn" @click="openEditModal">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            编辑资料
          </button>
        </div>

        <div class="user-space__stats">
          <div class="user-space__stat-item" @click="activeTab = 'watching'">
            <span class="user-space__stat-value">{{ stats.watching }}</span>
            <span class="user-space__stat-label">正在追</span>
          </div>
          <div class="user-space__stat-item" @click="activeTab = 'completed'">
            <span class="user-space__stat-value">{{ stats.completed }}</span>
            <span class="user-space__stat-label">已追完</span>
          </div>
          <div class="user-space__stat-item" @click="activeTab = 'history'">
            <span class="user-space__stat-value">{{ stats.history }}</span>
            <span class="user-space__stat-label">历史</span>
          </div>
        </div>
      </div>

      <div class="user-space__body">
        <div class="user-space__nav">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="['user-space__nav-item', { 'user-space__nav-item--active': activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            <svg v-if="tab.icon === 'heart'" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
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
          <div class="user-space__toolbar">
            <h2 class="user-space__section-title">
              {{ activeTab === 'watching' ? '正在追' : activeTab === 'completed' ? '已追完' : '观看历史' }}
            </h2>
            <ViewToggle v-model="viewMode" />
          </div>

          <Transition name="fade" mode="out-in">
            <div v-if="currentVideos.length > 0" :key="activeTab" class="user-space__video-container">
              <div v-if="viewMode === 'grid'" class="user-space__video-grid">
                <div
                  v-for="(video, index) in currentVideos"
                  :key="video.id"
                  class="user-space__video-item"
                  :style="{ animationDelay: `${Math.min(index * 30, 300)}ms` }"
                >
                  <VideoCard :video="video" />
                </div>
              </div>
              <div v-else class="user-space__video-list">
                <div
                  v-for="(video, index) in currentVideos"
                  :key="video.id"
                  class="user-space__video-item"
                  :style="{ animationDelay: `${Math.min(index * 30, 300)}ms` }"
                >
                  <VideoListItem :video="video" />
                </div>
              </div>
            </div>
            <NEmpty v-else :description="activeTab === 'watching' ? '暂无追番' : activeTab === 'completed' ? '暂无已追完的番剧' : '暂无观看记录'" class="user-space__empty" :key="'empty-' + activeTab" />
          </Transition>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAvatarModal" class="modal-overlay" @click.self="showAvatarModal = false">
          <div class="modal-container">
            <div class="modal-header">
              <h3 class="modal-title">更换头像</h3>
              <button class="modal-close" @click="showAvatarModal = false">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="avatar-preview">
                <img :src="editForm.avatar" alt="头像预览" class="avatar-preview__img" />
              </div>
              <div class="avatar-grid">
                <button
                  v-for="avatar in avatarOptions"
                  :key="avatar"
                  :class="['avatar-option', { 'avatar-option--selected': editForm.avatar === avatar }]"
                  @click="selectAvatar(avatar)"
                >
                  <img :src="avatar" alt="头像选项" />
                </button>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showAvatarModal = false">取消</button>
              <button class="btn btn-primary" @click="saveAvatar">保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-container">
            <div class="modal-header">
              <h3 class="modal-title">编辑个人资料</h3>
              <button class="modal-close" @click="showEditModal = false">
                <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="edit-form">
                <div class="edit-form__item">
                  <label class="edit-form__label">用户名</label>
                  <NInput
                    v-model:value="editForm.username"
                    placeholder="请输入用户名"
                    maxlength="20"
                    show-count
                  />
                </div>

                <div class="edit-form__item">
                  <label class="edit-form__label">个人简介</label>
                  <NInput
                    v-model:value="editForm.bio"
                    type="textarea"
                    placeholder="介绍一下自己吧~"
                    maxlength="100"
                    show-count
                    :rows="3"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="showEditModal = false">取消</button>
              <button class="btn btn-primary" @click="saveProfile" :disabled="!editForm.username.trim()">保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.user-space {
  min-height: calc(100vh - 60px);
  background-color: var(--bg-color);
  padding: var(--spacing-lg) 0;
}

.user-space__main {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-2xl);
  padding-bottom: var(--spacing-3xl);
}

@media (max-width: 1024px) {
  .user-space__main {
    padding: var(--spacing-lg) var(--spacing-xl);
    padding-bottom: var(--spacing-2xl);
  }
}

@media (max-width: 768px) {
  .user-space__main {
    padding: var(--spacing-md);
    padding-bottom: var(--spacing-xl);
    margin: 0 var(--spacing-md);
    border-radius: var(--radius-md);
  }
}

@media (max-width: 480px) {
  .user-space__main {
    padding: var(--spacing-sm);
    margin: 0 var(--spacing-sm);
  }
}

.user-space__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
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

.user-space__avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid var(--bg-secondary);
  transition: transform var(--transition-fast);
}

.user-space__avatar-edit:hover {
  transform: scale(1.1);
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

.user-space__actions {
  display: flex;
  gap: var(--spacing-sm);
}

.user-space__edit-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 8px 16px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-space__edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
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

.user-space__body {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.user-space__nav {
  display: flex;
  gap: var(--spacing-sm);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-strong);
  margin-bottom: var(--spacing-lg);
}

.user-space__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-space__nav-item:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
}

.user-space__nav-item--active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
  color: #ec4899;
  border-color: #ec4899;
}

.user-space__content {
  background-color: transparent;
  border-radius: var(--radius-lg);
  padding: 0;
}

.user-space__section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.user-space__video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.user-space__video-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.user-space__video-item {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
  will-change: opacity, transform;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px) translateZ(0);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateZ(0);
  }
}

.user-space__video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.user-space__video-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.user-space__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
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

@media (min-width: 1400px) {
  .user-space__video-grid {
    grid-template-columns: repeat(5, 1fr);
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

  .user-space__actions {
    margin-top: var(--spacing-sm);
  }

  .user-space__stats {
    padding: var(--spacing-md) 0;
  }

  .user-space__nav {
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .user-space__nav-item {
    flex: 1;
    justify-content: center;
    padding: 8px 12px;
    font-size: var(--font-size-sm);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
}

.modal-container {
  width: 100%;
  max-width: 420px;
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background-color: var(--bg-hover);
  color: var(--text-color);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.avatar-preview {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.avatar-preview__img {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
}

.avatar-option {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-full);
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all var(--transition-fast);
  padding: 0;
  background: none;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.avatar-option--selected {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.edit-form__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.edit-form__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
