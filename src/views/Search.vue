<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NInput, NSpin } from 'naive-ui'
import VideoCard from '@/components/video/VideoCard.vue'
import { generateMockVideos } from '@/services/mock'

const route = useRoute()
const router = useRouter()

const keyword = ref('')
const loading = ref(false)
const results = ref(generateMockVideos(0))
const searchFocused = ref(false)

const searchKeyword = computed(() => route.query.q as string || '')

const hotSearchTags = ['进击的巨人', '鬼灭之刃', '咒术回战', '间谍过家家', '我的英雄学院', '海贼王', '一拳超人', '刀剑神域']

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

function handleTagClick(tag: string) {
  keyword.value = tag
  performSearch()
}
</script>

<template>
  <div class="search-page">
    <div class="search-page__header">
      <div class="search-page__container">
        <div class="search-page__input-wrapper" :class="{ 'search-page__input-wrapper--focused': searchFocused }">
          <svg class="search-page__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <NInput
            v-model:value="keyword"
            placeholder="搜索动漫、番剧、剧场版..."
            :bordered="false"
            size="large"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
            @keyup.enter="handleSearch"
            class="search-page__input"
          />
          <button 
            v-if="keyword" 
            class="search-page__clear"
            @click="keyword = ''"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div v-if="!searchKeyword" class="search-page__hot">
          <h3 class="search-page__hot-title">热门搜索</h3>
          <div class="search-page__hot-tags">
            <button 
              v-for="tag in hotSearchTags" 
              :key="tag"
              class="search-page__hot-tag"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="search-page__content">
      <div class="search-page__container">
        <div v-if="searchKeyword && !loading" class="search-page__result-info">
          <span class="search-page__result-keyword">"{{ searchKeyword }}"</span>
          <span class="search-page__result-text">的搜索结果</span>
          <span class="search-page__result-count">{{ results.length }} 个结果</span>
        </div>

        <NSpin :show="loading">
          <div v-if="results.length > 0" class="search-page__grid">
            <VideoCard
              v-for="video in results"
              :key="video.id"
              :video="video"
            />
          </div>
          <div v-else-if="searchKeyword && !loading" class="search-page__empty">
            <svg viewBox="0 0 24 24" fill="currentColor" class="search-page__empty-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <p class="search-page__empty-text">没有找到相关内容</p>
            <p class="search-page__empty-hint">试试其他关键词</p>
          </div>
        </NSpin>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: calc(100vh - 64px);
  background-color: var(--bg-secondary);
}

.search-page__header {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--bg-color) 100%);
  padding: var(--spacing-2xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.dark .search-page__header {
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--bg-color) 100%);
}

.search-page__container {
  max-width: 900px;
  margin: 0 auto;
}

.search-page__input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--bg-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.search-page__input-wrapper--focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.dark .search-page__input-wrapper--focused {
  box-shadow: 0 0 0 4px var(--color-primary-900);
}

.search-page__icon {
  width: 24px;
  height: 24px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-page__input {
  flex: 1;
}

.search-page__clear {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.search-page__clear:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.search-page__clear svg {
  width: 20px;
  height: 20px;
}

.search-page__hot {
  margin-top: var(--spacing-xl);
}

.search-page__hot-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.search-page__hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.search-page__hot-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.search-page__hot-tag:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.search-page__content {
  padding: var(--spacing-xl) var(--spacing-lg);
}

.search-page__result-info {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.search-page__result-keyword {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
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

.search-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 640px) {
  .search-page__grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-md);
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
