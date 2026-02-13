<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { NInput, NButton, NEmpty, NSpin } from 'naive-ui'
import VideoCard from '@/components/video/VideoCard.vue'
import { generateMockVideos } from '@/services/mock'

const route = useRoute()

const keyword = ref('')
const loading = ref(false)
const results = ref(generateMockVideos(0))

const searchKeyword = computed(() => route.query.q as string || '')

watch(searchKeyword, (newKeyword) => {
  if (newKeyword) {
    keyword.value = newKeyword
    performSearch()
  }
}, { immediate: true })

function performSearch() {
  if (!keyword.value.trim()) return
  
  loading.value = true
  setTimeout(() => {
    results.value = generateMockVideos(12)
    loading.value = false
  }, 500)
}

function handleSearch() {
  performSearch()
}
</script>

<template>
  <div class="search-page">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="mb-6">
        <div class="flex gap-3 max-w-xl mx-auto">
          <NInput
            v-model:value="keyword"
            placeholder="搜索动漫..."
            size="large"
            @keyup.enter="handleSearch"
          />
          <NButton type="primary" size="large" @click="handleSearch">
            搜索
          </NButton>
        </div>
      </div>

      <div v-if="searchKeyword" class="mb-4 text-sm text-[var(--text-muted)]">
        搜索 "{{ searchKeyword }}" 的结果
      </div>

      <NSpin :show="loading">
        <div v-if="results.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <VideoCard
            v-for="video in results"
            :key="video.id"
            :video="video"
          />
        </div>
        <NEmpty v-else-if="searchKeyword && !loading" description="没有找到相关内容" />
      </NSpin>
    </div>
  </div>
</template>
