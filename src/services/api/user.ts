import { http } from '../request'
import type { LoginParams, LoginResponse, User, UserAnime, WatchHistory, AnimeStatus } from '@/types'

export interface RegisterParams {
  username: string
  email: string
  password: string
}

export interface UserAnimeListResponse {
  watching: UserAnime[]
  completed: UserAnime[]
  history: WatchHistory[]
}

export interface UpdateHistoryParams {
  videoId: number
  episodeId: number
  episodeTitle: string
  progress: number
}

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

  getAnimeList() {
    return http.get<UserAnimeListResponse>('/user/anime-list')
  },

  addAnime(videoId: number, status: AnimeStatus) {
    return http.post<{ success: boolean }>('/user/anime', { videoId, status })
  },

  removeAnime(videoId: number) {
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
