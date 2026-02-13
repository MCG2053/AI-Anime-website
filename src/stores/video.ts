import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Video, Category, VideoListParams } from '@/types'

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([])
  const currentVideo = ref<Video | null>(null)
  const categories = ref<Category[]>([
    { id: 1, name: '推荐', slug: 'recommend' },
    { id: 2, name: '番剧', slug: 'anime' },
    { id: 3, name: '国创', slug: 'chinese' },
    { id: 4, name: '剧场版', slug: 'movie' },
    { id: 5, name: 'OVA', slug: 'ova' }
  ])
  const currentCategory = ref<string>('recommend')
  const filters = ref<VideoListParams>({})
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  const hasMore = computed(() => videos.value.length < total.value)

  function setVideos(newVideos: Video[]) {
    videos.value = newVideos
  }

  function appendVideos(newVideos: Video[]) {
    videos.value = [...videos.value, ...newVideos]
  }

  function setCurrentVideo(video: Video | null) {
    currentVideo.value = video
  }

  function setCategory(category: string) {
    currentCategory.value = category
    page.value = 1
    videos.value = []
  }

  function setFilters(newFilters: VideoListParams) {
    filters.value = newFilters
    page.value = 1
    videos.value = []
  }

  function setPage(newPage: number) {
    page.value = newPage
  }

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setTotal(value: number) {
    total.value = value
  }

  function resetFilters() {
    filters.value = {}
    page.value = 1
    videos.value = []
  }

  return {
    videos,
    currentVideo,
    categories,
    currentCategory,
    filters,
    loading,
    total,
    page,
    pageSize,
    hasMore,
    setVideos,
    appendVideos,
    setCurrentVideo,
    setCategory,
    setFilters,
    setPage,
    setLoading,
    setTotal,
    resetFilters
  }
})
