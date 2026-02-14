<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoCard from '@/components/common/VideoCard.vue'
import { generateMockVideos, mockTags } from '@/services/mock'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const loading = ref(false)
const results = ref<any[]>([])
const searchFocused = ref(false)
const hotVideos = ref<any[]>([])

const searchKeyword = computed(() => route.query.q as string || '')

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

onMounted(() => {
  hotVideos.value = generateMockVideos(12)
})

watch(searchKeyword, (newKeyword) => {
  if (newKeyword) {
    keyword.value = newKeyword
    performSearch()
  }
}, { immediate: true })

function performSearch() {
  if (!keyword.value.trim()) return
  
  loading.value = true
  router.push({ name: 'Search', query: { q: keyword.value.trim() } })
  
  setTimeout(() => {
    results.value = generateMockVideos(12)
    loading.value = false
  }, 500)
}

function handleSearch() {
  performSearch()
}

function applyFilters() {
  if (searchKeyword.value) {
    performSearch()
  }
}
</script>

<template>
  <div class="search-page">
    <div class="search-page__header">
      <div class="search-page__search-container">
        <div class="search-page__search-box" :class="{ 'search-page__search-box--focused': searchFocused }">
          <svg class="search-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="keyword"
            type="text"
            class="search-page__input"
            placeholder="搜索动漫..."
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keyup.enter="handleSearch"
          />
        </div>
        <div class="search-page__underline" :class="{ 'search-page__underline--focused': searchFocused }"></div>
      </div>
    </div>

    <div class="search-page__content">
      <div class="search-page__grid-container">
        <template v-if="!searchKeyword">
          <div class="filter-panel">
            <div class="filter-row">
              <span class="filter-row__label">年份</span>
              <div class="filter-row__options">
                <button
                  v-for="option in yearOptions"
                  :key="option.value"
                  :class="['filter-tag', { 'filter-tag--active': selectedYear === option.value }]"
                  @click="selectedYear = option.value"
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
                  @click="selectedCountry = option.value"
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
                  @click="selectedGenre = option.value"
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
                  @click="selectedStatus = option.value"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>

          <h2 class="search-page__section-title">热门推荐</h2>
          <div class="search-page__grid">
            <VideoCard
              v-for="video in hotVideos"
              :key="video.id"
              :video="video"
            />
          </div>
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

          <div v-if="!loading" class="search-page__result-info">
            <span class="search-page__result-keyword">"{{ searchKeyword }}"</span>
            <span class="search-page__result-text">的搜索结果</span>
            <span class="search-page__result-count">{{ results.length }} 个结果</span>
          </div>

          <div v-if="loading" class="search-page__loading">
            <div class="search-page__spinner"></div>
            <span>搜索中...</span>
          </div>

          <div v-else-if="results.length > 0" class="search-page__grid">
            <VideoCard
              v-for="video in results"
              :key="video.id"
              :video="video"
            />
          </div>
          <div v-else class="search-page__empty">
            <svg viewBox="0 0 24 24" fill="currentColor" class="search-page__empty-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <p class="search-page__empty-text">没有找到相关内容</p>
            <p class="search-page__empty-hint">试试其他关键词</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: calc(100vh - 64px);
  background-color: var(--bg-color);
}

.search-page__header {
  padding: var(--spacing-lg);
}

.search-page__search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-page__search-box {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.search-page__icon {
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.search-page__search-box--focused .search-page__icon {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-page__input {
  flex: 1;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  color: var(--text-color);
  background: transparent;
  border: none;
  outline: none;
}

.search-page__input::placeholder {
  color: var(--text-muted);
}

.search-page__underline {
  height: 2px;
  background-color: var(--border-color);
  transition: background var(--transition-fast);
}

.search-page__underline--focused {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.search-page__content {
  padding: var(--spacing-xl) var(--spacing-lg);
}

.search-page__grid-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-page__section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-lg);
}

.filter-panel {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px dashed var(--border-color);
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
  height: 2px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  border-radius: var(--radius-full);
}

.filter-tag--active:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-page__result-info {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.search-page__result-keyword {
  font-size: var(--font-size-lg);
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-page__result-text {
  font-size: var(--font-size-lg);
  color: var(--text-color);
  margin-left: var(--spacing-xs);
}

.search-page__result-count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-left: var(--spacing-sm);
}

.search-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--text-muted);
  gap: var(--spacing-md);
}

.search-page__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: #3b82f6;
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.search-page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

@media (min-width: 640px) {
  .search-page__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .search-page__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .search-page__grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.search-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
}

.search-page__empty-icon {
  width: 80px;
  height: 80px;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: var(--spacing-lg);
}

.search-page__empty-text {
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.search-page__empty-hint {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}
</style>
