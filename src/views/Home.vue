<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { NSpin, NSelect, NGrid, NGi } from 'naive-ui'
import { useVideoStore } from '@/stores/video'
import VideoCard from '@/components/video/VideoCard.vue'
import { generateMockVideos, mockTags } from '@/services/mock'

const route = useRoute()
const videoStore = useVideoStore()

const loading = ref(false)
const videos = ref(generateMockVideos(20))

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

function applyFilters() {
  loading.value = true
  setTimeout(() => {
    videos.value = generateMockVideos(20, videoStore.currentCategory)
    loading.value = false
  }, 500)
}

function handleCategoryChange(slug: string) {
  videoStore.setCategory(slug)
  applyFilters()
}

watch(() => route.query.category, (newCategory) => {
  if (newCategory && typeof newCategory === 'string') {
    videoStore.setCategory(newCategory)
    applyFilters()
  }
}, { immediate: true })

onMounted(() => {
  const category = route.query.category as string
  if (category) {
    videoStore.setCategory(category)
  }
})
</script>

<template>
  <div class="home-page">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="mb-6">
        <div class="flex flex-wrap items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
          <div class="flex items-center gap-2">
            <span class="text-sm text-[var(--text-secondary)]">年份:</span>
            <NSelect
              v-model:value="selectedYear"
              :options="yearOptions"
              size="small"
              style="width: 100px"
              @update:value="applyFilters"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-[var(--text-secondary)]">地区:</span>
            <NSelect
              v-model:value="selectedCountry"
              :options="countryOptions"
              size="small"
              style="width: 100px"
              @update:value="applyFilters"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-[var(--text-secondary)]">类型:</span>
            <NSelect
              v-model:value="selectedGenre"
              :options="genreOptions"
              size="small"
              style="width: 100px"
              @update:value="applyFilters"
            />
          </div>
        </div>
      </div>

      <NSpin :show="loading">
        <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
          <NGi v-for="video in videos" :key="video.id" span="2 sm:1 md:1 lg:1 xl:1/5">
            <VideoCard :video="video" />
          </NGi>
        </NGrid>
      </NSpin>

      <div v-if="!loading && videos.length === 0" class="text-center py-12 text-[var(--text-muted)]">
        暂无相关视频
      </div>
    </div>
  </div>
</template>
