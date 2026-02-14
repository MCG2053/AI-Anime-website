import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Video, Category, VideoListParams } from '@/types'

export interface WeekSchedule {
  day: string
  dayName: string
  videos: Video[]
}

export const useVideoStore = defineStore('video', () => {
  const videos = ref<Video[]>([])
  const currentVideo = ref<Video | null>(null)
  const categories = ref<Category[]>([
    { id: 1, name: '推荐', slug: 'recommend', icon: 'home' },
    { id: 2, name: '番剧', slug: 'anime', icon: 'play' },
    { id: 3, name: '国创', slug: 'chinese', icon: 'star' },
    { id: 4, name: '剧场版', slug: 'movie', icon: 'film' },
    { id: 5, name: '周更表', slug: 'schedule', icon: 'calendar' },
    { id: 6, name: 'OVA', slug: 'ova', icon: 'disc' }
  ])
  const currentCategory = ref<string>('recommend')
  const filters = ref<VideoListParams>({})
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)
  const weekSchedule = ref<WeekSchedule[]>([])
  const scheduleLoading = ref(false)

  const hasMore = computed(() => videos.value.length < total.value)

  const currentDayIndex = computed(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days.indexOf(weekSchedule.value.find(d => d.day === getCurrentDay())?.day || 'monday')
  })

  function getCurrentDay(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }

  function getDayName(day: string): string {
    const dayNames: Record<string, string> = {
      monday: '周一',
      tuesday: '周二',
      wednesday: '周三',
      thursday: '周四',
      friday: '周五',
      saturday: '周六',
      sunday: '周日'
    }
    return dayNames[day] || day
  }

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

  function setWeekSchedule(schedule: WeekSchedule[]) {
    weekSchedule.value = schedule
  }

  function setScheduleLoading(value: boolean) {
    scheduleLoading.value = value
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
    weekSchedule,
    scheduleLoading,
    currentDayIndex,
    getCurrentDay,
    getDayName,
    setVideos,
    appendVideos,
    setCurrentVideo,
    setCategory,
    setFilters,
    setPage,
    setLoading,
    setTotal,
    setWeekSchedule,
    setScheduleLoading,
    resetFilters
  }
})
