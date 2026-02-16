export * from './user'
export * from './video'
export * from './comment'
export * from './danmaku'

import { userApi } from './user'
import { videoApi } from './video'
import { commentApi } from './comment'
import { danmakuApi } from './danmaku'

export const api = {
  user: userApi,
  video: videoApi,
  comment: commentApi,
  danmaku: danmakuApi
}

export default api
