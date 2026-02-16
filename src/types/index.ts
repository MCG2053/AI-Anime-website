export interface User {
  id: number
  username: string
  email: string
  avatar: string
  bio?: string
  createdAt: string
  likeCount: number
  commentCount: number
  animeCount: number
  historyCount: number
}

export interface UserStats {
  likeCount: number
  commentCount: number
  animeCount: number
  historyCount: number
  watchTime: number
}

export interface UserCommentsResponse {
  list: Comment[]
  total: number
  page: number
  pageSize: number
}

export interface UserLikesResponse {
  videoIds: number[]
  commentIds: number[]
}

export interface UserCollectionsResponse {
  videoIds: number[]
}

export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Video {
  id: number
  title: string
  cover: string
  description: string
  playCount: number
  likeCount: number
  collectCount: number
  episode: string
  category: string
  tags: string[]
  country: string
  year: number
  createdAt: string
  updatedAt: string
  views?: number
  duration?: number
  updateInfo?: string
  currentEpisode?: number
  updateTime?: string
}

export interface VideoListParams {
  category?: string
  year?: number | string
  type?: string
  country?: string
  page?: number
  pageSize?: number
}

export interface VideoListResponse {
  list: Video[]
  total: number
  page: number
  pageSize: number
}

export interface VideoDetail extends Video {
  videoUrl: string
  episodes: Episode[]
  relatedVideos: Video[]
}

export interface Episode {
  id: number
  title: string
  videoUrl: string
  duration: number
}

export interface Comment {
  id: number
  userId: number
  username: string
  avatar: string
  content: string
  likeCount: number
  createdAt: string
  replies?: Comment[]
}

export interface CommentParams {
  videoId: number
  content: string
  parentId?: number
}

export interface Danmaku {
  id: number
  content: string
  time: number
  color: string
  type: 'scroll' | 'top' | 'bottom'
  userId: number
  createdAt: string
}

export interface DanmakuParams {
  videoId: number
  content: string
  time: number
  color?: string
  type?: 'scroll' | 'top' | 'bottom'
}

export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
}

export interface Tag {
  id: number
  name: string
  type: 'genre' | 'country'
}

export type ThemeMode = 'light' | 'dark'

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export type AnimeStatus = 'watching' | 'completed'

export interface UserAnime {
  videoId: number
  status: AnimeStatus
  addedAt: string
  video?: Video
}

export interface WatchHistory {
  videoId: number
  episodeId: number
  episodeTitle: string
  watchedAt: string
  progress: number
  video?: Video
}

export interface UserAnimeListResponse {
  watching: UserAnime[]
  completed: UserAnime[]
  history: WatchHistory[]
}
