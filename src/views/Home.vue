<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NSpin, NSelect } from 'naive-ui'
import { useVideoStore, type WeekSchedule } from '@/stores/video'
import CategoryTabs from '@/components/common/CategoryTabs.vue'
import VideoCard from '@/components/common/VideoCard.vue'
import WeekScheduleComponent from '@/components/common/WeekSchedule.vue'
import Skeleton from '@/components/common/Skeleton.vue'
import { generateMockVideos, generateWeekSchedule, mockTags } from '@/services/mock'

const route = useRoute()
const videoStore = useVideoStore()

const loading = ref(false)
const videos = ref(generateMockVideos(20))
const weekSchedule = ref<WeekSchedule[]>([])
const scheduleLoading = ref(false)

const currentCategory = computed({
  get: () => videoStore.currentCategory,
  set: (value) => videoStore.setCategory(value)
})

const isScheduleView = computed(() => currentCategory.value === 'schedule')

const yearOptions = [
  { label: '全部', value: '' },
  { label: '今年', value: new Date().getFullYear() },
  { label: '去年', value: new Date().getFullYear() - 1 },
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

const selectedYear = ref<string | number>('')
const selectedCountry = ref('')
const selectedGenre = ref('')

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

onMounted(() => {
  const category = route.query.category as string
  if (category) {
    currentCategory.value = category
  }
  if (isScheduleView.value) {
    loadWeekSchedule()
  }
})
</script>

<template>
  <div class="home-page">
    <CategoryTabs 
      v-model="currentCategory" 
      :categories="videoStore.categories"
      @change="handleCategoryChange"
    />

    <div class="home-page__container">
      <template v-if="isScheduleView">
        <WeekScheduleComponent 
          :schedule="weekSchedule"
          :loading="scheduleLoading"
        />
      </template>

      <template v-else>
        <div class="home-page__filters">
          <div class="filter-group">
            <span class="filter-label">年份</span>
            <NSelect
              v-model:value="selectedYear"
              :options="yearOptions"
              size="small"
              class="filter-select"
              @update:value="applyFilters"
            />
          </div>
          <div class="filter-group">
            <span class="filter-label">地区</span>
            <NSelect
              v-model:value="selectedCountry"
              :options="countryOptions"
              size="small"
              class="filter-select"
              @update:value="applyFilters"
            />
          </div>
          <div class="filter-group">
            <span class="filter-label">类型</span>
            <NSelect
              v-model:value="selectedGenre"
              :options="genreOptions"
              size="small"
              class="filter-select"
              @update:value="applyFilters"
            />
          </div>
        </div>

        <div class="home-page__content">
          <NSpin :show="loading">
            <template v-if="loading">
              <div class="video-grid">
                <Skeleton v-for="i in 10" :key="i" type="card" />
              </div>
            </template>
            <template v-else>
              <TransitionGroup name="list" tag="div" class="video-grid">
                <div
                  v-for="(video, index) in videos"
                  :key="video.id"
                  class="video-grid__item"
                  :style="{ animationDelay: `${index * 50}ms` }"
                >
                  <VideoCard :video="video" />
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
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.home-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-select {
  width: 120px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
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
