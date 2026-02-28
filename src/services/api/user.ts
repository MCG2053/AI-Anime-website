import { http } from '../request'
import type { 
  LoginParams, 
  LoginResponse, 
  User, 
  WatchHistory, 
  AnimeStatus,
  UserStats,
  UserCommentsResponse,
  UserLikesResponse,
  UserCollectionsResponse,
  UserAnimeListResponse,
  RegisterParams,
  UpdateHistoryParams
} from '@/types'
import { isMockEnvironment } from '@/utils/env'

export const userApi = {
  login(params: LoginParams) {
    return http.post<LoginResponse>('/user/login', params)
  },

  register(params: RegisterParams) {
    return http.post<LoginResponse>('/user/register', params)
  },

  logout() {
    return http.post('/user/logout')
  },

  getUserInfo() {
    return http.get<User>('/user/info')
  },

  updateUserInfo(data: Partial<User>) {
    return http.put<User>('/user/info', data)
  },

  updateAvatar(avatarUrl: string) {
    return http.put<User>('/user/avatar', { avatar: avatarUrl })
  },

  changePassword(oldPassword: string, newPassword: string) {
    return http.put('/user/password', { oldPassword, newPassword })
  },

  getUserStats() {
    return http.get<UserStats>('/user/stats')
  },

  getUserComments(page = 1, pageSize = 20) {
    return http.get<UserCommentsResponse>('/user/comments', {
      params: { page, pageSize }
    })
  },

  getUserLikes() {
    return http.get<UserLikesResponse>('/user/likes')
  },

  getUserCollections() {
    return http.get<UserCollectionsResponse>('/user/collections')
  },

  getAnimeList() {
    return http.get<UserAnimeListResponse>('/user/anime-list')
  },

  addAnime(videoId: number, status: AnimeStatus) {
    if (isMockEnvironment()) {
      return Promise.resolve({ success: true, data: { success: true } })
    }
    return http.post<{ success: boolean }>('/user/anime', { videoId, status })
  },

  removeAnime(videoId: number) {
    if (isMockEnvironment()) {
      return Promise.resolve({ success: true, data: { success: true } })
    }
    return http.delete<{ success: boolean }>(`/user/anime/${videoId}`)
  },

  updateAnimeStatus(videoId: number, status: AnimeStatus) {
    return http.put<{ success: boolean }>(`/user/anime/${videoId}`, { status })
  },

  getWatchHistory(page = 1, pageSize = 20) {
    return http.get<{ list: WatchHistory[]; total: number }>('/user/history', {
      params: { page, pageSize }
    })
  },

  updateWatchHistory(params: UpdateHistoryParams) {
    return http.post<WatchHistory>('/user/history', params)
  },

  removeWatchHistory(videoId: number) {
    return http.delete(`/user/history/${videoId}`)
  },

  clearWatchHistory() {
    return http.delete('/user/history')
  }
}
