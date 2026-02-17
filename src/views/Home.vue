<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NSpin } from 'naive-ui'
import { useVideoStore, type WeekSchedule } from '@/stores/video'
import VideoCard from '@/components/common/VideoCard.vue'
import VideoListItem from '@/components/common/VideoListItem.vue'
import ViewToggle from '@/components/common/ViewToggle.vue'
import WeekScheduleComponent from '@/components/common/WeekSchedule.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import { generateMockVideos, generateWeekSchedule, mockTags } from '@/services/mock'

const route = useRoute()
const videoStore = useVideoStore()

const loading = ref(false)
const videos = ref(generateMockVideos(20))
const weekSchedule = ref<WeekSchedule[]>([])
const scheduleLoading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const currentCategory = computed({
  get: () => videoStore.currentCategory,
  set: (value) => videoStore.setCategory(value)
})

const isScheduleView = computed(() => currentCategory.value === 'schedule')

const yearOptions = [
  { label: '全部', value: '' },
  { label: '2025', value: 2025 },
  { label: '2024', value: 2024 },
  { label: '2023', value: 2023 },
  { label: '2022', value: 2022 },
  { label: '更早', value: 'earlier' }
]

const countryOptions = [
  { label: '全部', value: '' },
  { label: '日本', value: '日本' },
  { label: '中国', value: '中国' },
  { label: '美国', value: '美国' },
  { label: '韩国', value: '韩国' }
]

const genreOptions = computed(() => {
  const genres = mockTags.filter(t => t.type === 'genre')
  return [
    { label: '全部', value: '' },
    ...genres.map(g => ({ label: g.name, value: g.name }))
  ]
})

const statusOptions = [
  { label: '全部', value: '' },
  { label: '连载中', value: 'ongoing' },
  { label: '已完结', value: 'completed' }
]

const selectedYear = ref<string | number>('')
const selectedCountry = ref('')
const selectedGenre = ref('')
const selectedStatus = ref('')

function loadVideos() {
  loading.value = true
  setTimeout(() => {
    videos.value = generateMockVideos(20, videoStore.currentCategory)
    loading.value = false
  }, 500)
}

function loadWeekSchedule() {
  scheduleLoading.value = true
  setTimeout(() => {
    weekSchedule.value = generateWeekSchedule()
    scheduleLoading.value = false
  }, 300)
}

function handleCategoryChange(slug: string) {
  if (slug === 'schedule') {
    loadWeekSchedule()
  } else {
    loadVideos()
  }
}

function applyFilters() {
  if (!isScheduleView.value) {
    loadVideos()
  }
}

watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string') {
    currentCategory.value = newCategory
    handleCategoryChange(newCategory)
  }
}, { immediate: true })

watch(currentCategory, (newCategory) => {
  handleCategoryChange(newCategory)
})

onMounted(() => {
  const category = route.query.category as string
  if (category) {
    currentCategory.value = category
  }
  if (isScheduleView.value) {
    loadWeekSchedule()
  } else {
    loadVideos()
  }
})
</script>

<template>
  <div class="home-page">
    <div class="home-page__container">
      <template v-if="isScheduleView">
        <WeekScheduleComponent 
          :schedule="weekSchedule"
          :loading="scheduleLoading"
        />
      </template>

      <template v-else>
        <div class="filter-panel">
          <div class="filter-row">
            <span class="filter-row__label">年份</span>
            <div class="filter-row__options">
              <button
                v-for="option in yearOptions"
                :key="option.value"
                :class="['filter-tag', { 'filter-tag--active': selectedYear === option.value }]"
                @click="selectedYear = option.value; applyFilters()"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-row__label">地区</span>
            <div class="filter-row__options">
              <button
                v-for="option in countryOptions"
                :key="option.value"
                :class="['filter-tag', { 'filter-tag--active': selectedCountry === option.value }]"
                @click="selectedCountry = option.value; applyFilters()"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-row__label">类型</span>
            <div class="filter-row__options">
              <button
                v-for="option in genreOptions"
                :key="option.value"
                :class="['filter-tag', { 'filter-tag--active': selectedGenre === option.value }]"
                @click="selectedGenre = option.value; applyFilters()"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div class="filter-row">
            <span class="filter-row__label">状态</span>
            <div class="filter-row__options">
              <button
                v-for="option in statusOptions"
                :key="option.value"
                :class="['filter-tag', { 'filter-tag--active': selectedStatus === option.value }]"
                @click="selectedStatus = option.value; applyFilters()"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="home-page__content">
          <div class="home-page__toolbar">
            <span class="home-page__count">共 {{ videos.length }} 部</span>
            <ViewToggle v-model="viewMode" />
          </div>
          <NSpin :show="loading">
            <template v-if="loading">
              <div class="video-grid">
                <Skeleton v-for="i in 10" :key="i" type="card" />
              </div>
            </template>
            <template v-else>
              <TransitionGroup v-if="viewMode === 'grid'" name="list" tag="div" class="video-grid">
                <div
                  v-for="(video, index) in videos"
                  :key="video.id"
                  class="video-grid__item"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <VideoCard :video="video" />
                </div>
              </TransitionGroup>
              <TransitionGroup v-else name="list" tag="div" class="video-list">
                <div
                  v-for="(video, index) in videos"
                  :key="video.id"
                  class="video-list__item"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <VideoListItem :video="video" />
                </div>
              </TransitionGroup>
            </template>
          </NSpin>

          <div v-if="!loading && videos.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor" class="empty-state__icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <p class="empty-state__text">暂无相关视频</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 200px);
}

.home-page__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-2xl);
}

@media (max-width: 1024px) {
  .home-page__container {
    padding: var(--spacing-lg) var(--spacing-xl);
  }
}

@media (max-width: 768px) {
  .home-page__container {
    padding: var(--spacing-md) var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .home-page__container {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

.filter-panel {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 768px) {
  .filter-panel {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .filter-panel {
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  border-bottom: 2px solid var(--border-strong);
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
  }
}

.filter-row:last-child {
  border-bottom: none;
}

.filter-row__label {
  flex-shrink: 0;
  width: 52px;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding-top: 6px;
}

@media (max-width: 768px) {
  .filter-row__label {
    width: auto;
    padding-top: 4px;
    padding-left: 12px;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-xs);
  }
}

.filter-row__options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.filter-tag {
  padding: 4px 12px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  position: relative;
}

.filter-tag:hover {
  color: #3b82f6;
  background-color: var(--bg-hover);
}

.filter-tag--active {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-tag--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: var(--radius-full);
}

.filter-tag--active:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

@media (max-width: 480px) {
  .video-grid {
    gap: var(--spacing-md);
  }
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.video-list__item {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.home-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.home-page__count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

@media (min-width: 640px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .video-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.video-grid__item {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.list-move {
  transition: transform 0.3s ease;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state__text {
  font-size: var(--font-size-lg);
}
</style>
