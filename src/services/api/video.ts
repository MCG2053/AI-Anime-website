import { http } from '../request'
import type { VideoListParams, VideoListResponse, VideoDetail, Category, Tag } from '@/types'

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
    return http.post(`/videos/${id}/like`)
  },

  collectVideo(id: number) {
    return http.post(`/videos/${id}/collect`)
  }
}
