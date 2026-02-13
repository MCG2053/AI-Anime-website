import { http } from '../request'
import type { LoginParams, LoginResponse, User } from '@/types'

export const userApi = {
  login(params: LoginParams) {
    return http.post<LoginResponse>('/user/login', params)
  },

  logout() {
    return http.post('/user/logout')
  },

  getUserInfo() {
    return http.get<User>('/user/info')
  },

  updateUserInfo(data: Partial<User>) {
    return http.put<User>('/user/info', data)
  }
}
