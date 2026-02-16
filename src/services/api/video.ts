import { http } from '../request'
import type { VideoListParams, VideoListResponse, VideoDetail, Category, Tag, Video } from '@/types'

export interface SearchParams {
  keyword: string
  page?: number
  pageSize?: number
}

export interface SearchResponse {
  list: Video[]
  total: number
  page: number
  pageSize: number
}

export const videoApi = {
  getVideoList(params: VideoListParams) {
    return http.get<VideoListResponse>('/videos', { params })
  },

  getVideoDetail(id: number) {
    return http.get<VideoDetail>(`/videos/${id}`)
  },

  getCategories() {
    return http.get<Category[]>('/categories')
  },

  getTags() {
    return http.get<Tag[]>('/tags')
  },

  likeVideo(id: number) {
    return http.post<{ success: boolean }>(`/videos/${id}/like`)
  },

  unlikeVideo(id: number) {
    return http.delete(`/videos/${id}/like`)
  },

  collectVideo(id: number) {
    return http.post<{ success: boolean }>(`/videos/${id}/collect`)
  },

  uncollectVideo(id: number) {
    return http.delete(`/videos/${id}/collect`)
  },

  search(params: SearchParams) {
    return http.get<SearchResponse>('/search', { params })
  },

  getRecommendations(videoId: number, limit = 6) {
    return http.get<Video[]>(`/videos/${videoId}/recommendations`, {
      params: { limit }
    })
  },

  getPopularVideos(limit = 10) {
    return http.get<Video[]>('/videos/popular', { params: { limit } })
  },

  getLatestVideos(limit = 10) {
    return http.get<Video[]>('/videos/latest', { params: { limit } })
  },

  getWeekSchedule() {
    return http.get<Record<string, Video[]>>('/videos/schedule')
  },

  incrementPlayCount(id: number) {
    return http.post(`/videos/${id}/play`)
  }
}
