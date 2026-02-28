import { http } from '../request'
import type { Danmaku, DanmakuParams, DanmakuListParams, DanmakuStats, DanmakuBatchParams } from '@/types'

export const danmakuApi = {
  getDanmaku(videoId: number, params?: Omit<DanmakuListParams, 'videoId'>) {
    return http.get<Danmaku[]>(`/videos/${videoId}/danmaku`, { params })
  },

  getDanmakuByEpisode(videoId: number, episodeId: number) {
    return http.get<Danmaku[]>(`/videos/${videoId}/episodes/${episodeId}/danmaku`)
  },

  getDanmakuBatch(params: DanmakuBatchParams) {
    return http.post<Record<number, Danmaku[]>>('/danmaku/batch', params)
  },

  sendDanmaku(params: DanmakuParams) {
    return http.post<Danmaku>('/danmaku', params)
  },

  deleteDanmaku(danmakuId: number) {
    return http.delete<{ success: boolean }>(`/danmaku/${danmakuId}`)
  },

  getDanmakuStats(videoId: number, episodeId?: number) {
    const url = episodeId 
      ? `/videos/${videoId}/episodes/${episodeId}/danmaku/stats`
      : `/videos/${videoId}/danmaku/stats`
    return http.get<DanmakuStats>(url)
  },

  reportDanmaku(danmakuId: number, reason: string) {
    return http.post<{ success: boolean }>(`/danmaku/${danmakuId}/report`, { reason })
  }
}
