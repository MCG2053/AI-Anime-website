import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserAnime, AnimeStatus, Video, WatchHistory } from '@/types'
import { userApi } from '@/services/api'

const STORAGE_KEY = 'anime_user_list'
const HISTORY_KEY = 'anime_watch_history'
const MAX_HISTORY = 50

export const useAnimeListStore = defineStore('animeList', () => {
  const watchingList = ref<UserAnime[]>([])
  const completedList = ref<UserAnime[]>([])
  const watchHistory = ref<WatchHistory[]>([])

  const watchingCount = computed(() => watchingList.value.length)
  const completedCount = computed(() => completedList.value.length)
  const historyCount = computed(() => watchHistory.value.length)

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        watchingList.value = parsed.watching || []
        completedList.value = parsed.completed || []
      }
      const historyData = localStorage.getItem(HISTORY_KEY)
      if (historyData) {
        watchHistory.value = JSON.parse(historyData)
      }
    } catch (e) {
      console.error('Failed to load anime list from storage:', e)
    }
  }

  function saveToStorage() {
    try {
      const data = {
        watching: watchingList.value,
        completed: completedList.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save anime list to storage:', e)
    }
  }

  function saveHistoryToStorage() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(watchHistory.value))
    } catch (e) {
      console.error('Failed to save history to storage:', e)
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

  function addToHistory(video: Video, episodeId: number, episodeTitle: string, progress: number = 0) {
    console.log('addToHistory called:', { videoId: video.id, title: video.title, episodeId, episodeTitle })
    const existingIndex = watchHistory.value.findIndex(item => item.videoId === video.id)
    
    const historyItem: WatchHistory = {
      videoId: video.id,
      episodeId,
      episodeTitle,
      watchedAt: new Date().toISOString(),
      progress,
      video
    }

    if (existingIndex !== -1) {
      watchHistory.value.splice(existingIndex, 1)
    }
    
    watchHistory.value.unshift(historyItem)
    
    console.log('watchHistory after adding:', watchHistory.value.length, watchHistory.value)
    
    if (watchHistory.value.length > MAX_HISTORY) {
      watchHistory.value = watchHistory.value.slice(0, MAX_HISTORY)
    }
    
    saveHistoryToStorage()
    console.log('History saved to localStorage')

    userApi.updateWatchHistory({
      videoId: video.id,
      episodeId,
      episodeTitle,
      progress
    }).catch(err => {
      console.log('Failed to sync history to server:', err)
    })
  }

  function getHistoryItem(videoId: number): WatchHistory | undefined {
    return watchHistory.value.find(item => item.videoId === videoId)
  }

  function clearHistory() {
    watchHistory.value = []
    saveHistoryToStorage()
    
    userApi.clearWatchHistory().catch(err => {
      console.log('Failed to clear history on server:', err)
    })
  }

  function removeHistoryItem(videoId: number) {
    const index = watchHistory.value.findIndex(item => item.videoId === videoId)
    if (index !== -1) {
      watchHistory.value.splice(index, 1)
      saveHistoryToStorage()
    }
    
    userApi.removeWatchHistory(videoId).catch(err => {
      console.log('Failed to remove history item on server:', err)
    })
  }

  async function addToWatching(video: Video): Promise<boolean> {
    try {
      await userApi.addAnime(video.id, 'watching')
      
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
      await userApi.addAnime(video.id, 'completed')
      
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
      await userApi.removeAnime(videoId)
      removeFromWatching(videoId)
      removeFromCompleted(videoId)
      return true
    } catch (error) {
      console.error('Failed to remove anime:', error)
      removeFromWatching(videoId)
      removeFromCompleted(videoId)
      return true
    }
  }

  async function fetchUserAnimeList(): Promise<void> {
    try {
      const response = await userApi.getAnimeList()
      const data = response.data.data
      watchingList.value = data.watching || []
      completedList.value = data.completed || []
      watchHistory.value = data.history || []
      saveToStorage()
      saveHistoryToStorage()
    } catch (error) {
      console.error('Failed to fetch user anime list:', error)
      loadFromStorage()
    }
  }

  loadFromStorage()

  return {
    watchingList,
    completedList,
    watchHistory,
    watchingCount,
    completedCount,
    historyCount,
    getAnimeStatus,
    isAnimeInList,
    addToWatching,
    addToCompleted,
    removeAnime,
    fetchUserAnimeList,
    addToHistory,
    getHistoryItem,
    clearHistory,
    removeHistoryItem
  }
})
