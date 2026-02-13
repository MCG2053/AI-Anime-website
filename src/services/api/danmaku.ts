import { http } from '../request'
import type { Danmaku, DanmakuParams } from '@/types'

export const danmakuApi = {
  getDanmaku(videoId: number) {
    return http.get<Danmaku[]>(`/videos/${videoId}/danmaku`)
  },

  sendDanmaku(params: DanmakuParams) {
    return http.post<Danmaku>('/danmaku', params)
  }
}
