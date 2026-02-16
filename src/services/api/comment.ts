import { http } from '../request'
import type { Comment, CommentParams } from '@/types'

export interface UserCommentsResponse {
  list: Comment[]
  total: number
  page: number
  pageSize: number
}

export const commentApi = {
  getComments(videoId: number, page = 1, pageSize = 20) {
    return http.get<{ list: Comment[]; total: number }>(`/videos/${videoId}/comments`, {
      params: { page, pageSize }
    })
  },

  createComment(params: CommentParams) {
    return http.post<Comment>('/comments', params)
  },

  likeComment(id: number) {
    return http.post<{ success: boolean }>(`/comments/${id}/like`)
  },

  unlikeComment(id: number) {
    return http.delete(`/comments/${id}/like`)
  },

  deleteComment(id: number) {
    return http.delete<{ success: boolean }>(`/comments/${id}`)
  },

  getUserComments(page = 1, pageSize = 20) {
    return http.get<UserCommentsResponse>('/user/comments', {
      params: { page, pageSize }
    })
  }
}
