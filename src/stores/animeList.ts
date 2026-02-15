import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserAnime, AnimeStatus, Video } from '@/types'

const STORAGE_KEY = 'anime_user_list'

export const useAnimeListStore = defineStore('animeList', () => {
  const watchingList = ref<UserAnime[]>([])
  const completedList = ref<UserAnime[]>([])
  const historyList = ref<UserAnime[]>([])

  const watchingCount = computed(() => watchingList.value.length)
  const completedCount = computed(() => completedList.value.length)
  const historyCount = computed(() => historyList.value.length)

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        watchingList.value = parsed.watching || []
        completedList.value = parsed.completed || []
        historyList.value = parsed.history || []
      }
    } catch (e) {
      console.error('Failed to load anime list from storage:', e)
    }
  }

  function saveToStorage() {
    try {
      const data = {
        watching: watchingList.value,
        completed: completedList.value,
        history: historyList.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save anime list to storage:', e)
    }
  }

  function getAnimeStatus(videoId: number): AnimeStatus | null {
    if (watchingList.value.some(item => item.videoId === videoId)) {
      return 'watching'
    }
    if (completedList.value.some(item => item.videoId === videoId)) {
      return 'completed'
    }
    return null
  }

  function isAnimeInList(videoId: number): boolean {
    return getAnimeStatus(videoId) !== null
  }

  async function addToWatching(video: Video): Promise<boolean> {
    try {
      const response = await addAnimeApi(video.id, 'watching')
      if (response.success) {
        removeFromCompleted(video.id)
        
        if (!watchingList.value.some(item => item.videoId === video.id)) {
          watchingList.value.push({
            videoId: video.id,
            status: 'watching',
            addedAt: new Date().toISOString(),
            video
          })
        }
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to watching:', error)
      removeFromCompleted(video.id)
      
      if (!watchingList.value.some(item => item.videoId === video.id)) {
        watchingList.value.push({
          videoId: video.id,
          status: 'watching',
          addedAt: new Date().toISOString(),
          video
        })
      }
      saveToStorage()
      return true
    }
  }

  async function addToCompleted(video: Video): Promise<boolean> {
    try {
      const response = await addAnimeApi(video.id, 'completed')
      if (response.success) {
        removeFromWatching(video.id)
        
        if (!completedList.value.some(item => item.videoId === video.id)) {
          completedList.value.push({
            videoId: video.id,
            status: 'completed',
            addedAt: new Date().toISOString(),
            video
          })
        }
        saveToStorage()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to add to completed:', error)
      removeFromWatching(video.id)
      
      if (!completedList.value.some(item => item.videoId === video.id)) {
        completedList.value.push({
          videoId: video.id,
          status: 'completed',
          addedAt: new Date().toISOString(),
          video
        })
      }
      saveToStorage()
      return true
    }
  }

  function removeFromWatching(videoId: number) {
    const index = watchingList.value.findIndex(item => item.videoId === videoId)
    if (index !== -1) {
      watchingList.value.splice(index, 1)
      saveToStorage()
    }
  }

  function removeFromCompleted(videoId: number) {
    const index = completedList.value.findIndex(item => item.videoId === videoId)
    if (index !== -1) {
      completedList.value.splice(index, 1)
      saveToStorage()
    }
  }

  async function removeAnime(videoId: number): Promise<boolean> {
    try {
      const response = await removeAnimeApi(videoId)
      if (response.success) {
        removeFromWatching(videoId)
        removeFromCompleted(videoId)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to remove anime:', error)
      removeFromWatching(videoId)
      removeFromCompleted(videoId)
      return true
    }
  }

  async function fetchUserAnimeList(): Promise<void> {
    try {
      const response = await getUserAnimeListApi()
      watchingList.value = response.watching || []
      completedList.value = response.completed || []
      historyList.value = response.history || []
      saveToStorage()
    } catch (error) {
      console.error('Failed to fetch user anime list:', error)
      loadFromStorage()
    }
  }

  loadFromStorage()

  return {
    watchingList,
    completedList,
    historyList,
    watchingCount,
    completedCount,
    historyCount,
    getAnimeStatus,
    isAnimeInList,
    addToWatching,
    addToCompleted,
    removeAnime,
    fetchUserAnimeList
  }
})

async function addAnimeApi(videoId: number, status: AnimeStatus): Promise<{ success: boolean }> {
  console.log(`[API] POST /api/user/anime - Adding video ${videoId} to ${status}`)
  return { success: true }
}

async function removeAnimeApi(videoId: number): Promise<{ success: boolean }> {
  console.log(`[API] DELETE /api/user/anime/${videoId}`)
  return { success: true }
}

async function getUserAnimeListApi(): Promise<{ watching: UserAnime[], completed: UserAnime[], history: UserAnime[] }> {
  console.log('[API] GET /api/user/anime-list')
  return {
    watching: [],
    completed: [],
    history: []
  }
}
