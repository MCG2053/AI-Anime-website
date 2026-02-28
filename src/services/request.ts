import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { storage } from '@/utils/storage'
import type { ApiResponse } from '@/types'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const request: AxiosInstance = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    if (data.code === 0 || data.code === 200) {
      return response
    }
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        storage.clear()
        window.location.href = '/login'
      } else if (status === 403) {
        console.error('没有权限访问')
      } else if (status === 404) {
        console.error('请求的资源不存在')
      } else if (status >= 500) {
        console.error('服务器错误')
      }
    }
    return Promise.reject(error)
  }
)

export const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.get(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.post(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.put(url, data, config)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.delete(url, config)
  },

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.patch(url, data, config)
  }
}

export default request
