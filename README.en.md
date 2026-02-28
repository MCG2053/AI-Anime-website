# AnimeVideo - Anime Video Streaming Platform

English | [简体中文](./README.md)

A modern anime video streaming frontend application built with Vue 3 + TypeScript + Vite.

## Project Overview

AnimeVideo is a fully-featured anime video streaming platform frontend project, providing core functionalities such as video browsing, playback, user management, and anime list tracking. It features responsive design with light/dark theme switching, delivering a premium viewing experience.

## Features

### Core Features

- **Homepage**
  - Multi-category video lists (Recommended, Anime, Chinese, Movies, OVA)
  - Weekly anime schedule (calendar view)
  - Multi-dimensional filtering (year, region, genre, status)
  - Grid/List view toggle

- **Video Playback**
  - Custom video player (based on ArtPlayer 5.x)
  - Danmaku support (artplayer-plugin-danmuku)
  - Playback progress control and memory
  - Playback speed adjustment (0.5x - 2.0x)
  - Picture-in-Picture mode
  - Fullscreen playback
  - Volume control
  - Fast forward/rewind (10 seconds)
  - Mobile-optimized control bar

- **Anime Details**
  - Anime information display
  - Episode list
  - Related recommendations
  - Favorite/Track functionality

- **User System**
  - User registration/login
  - Personal center
  - Anime list (Watching/Completed)
  - Watch history
  - Profile management

- **Comment System**
  - Comment posting
  - Comment replies
  - Like functionality

### UI Features

- Responsive design, compatible with desktop and mobile
- Light/Dark theme switching
- Smooth animation transitions
- Skeleton loading states
- Modern UI design

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3.5 (Composition API) |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7.3 |
| State Management | Pinia 3.0 |
| Router | Vue Router 4.6 |
| HTTP Client | Axios 1.13 |
| Video Player | ArtPlayer 5.3 |
| Danmaku Plugin | artplayer-plugin-danmuku 5.2 |
| UI Library | Naive UI 2.43 |
| CSS Solution | Tailwind CSS 4.1 + CSS Variables |

## Project Structure

```
src/
├── components/           # Components directory
│   ├── common/          # Common components
│   │   ├── Skeleton.vue
│   │   ├── VideoCard.vue
│   │   ├── VideoListItem.vue
│   │   ├── ViewToggle.vue
│   │   └── WeekSchedule.vue
│   ├── layout/          # Layout components
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   └── AppLayout.vue
│   ├── theme/           # Theme components
│   │   └── ThemeToggle.vue
│   └── video/           # Video-related components
│       ├── CommentSection.vue
│       └── VideoPlayer.vue
├── router/              # Router configuration
│   └── index.ts
├── services/            # Service layer
│   ├── api/            # API interfaces
│   │   ├── comment.ts
│   │   ├── danmaku.ts
│   │   ├── user.ts
│   │   └── video.ts
│   ├── mock/           # Mock data
│   │   └── index.ts
│   └── request.ts      # HTTP request wrapper
├── stores/              # State management
│   ├── animeList.ts    # Anime list/Watch history
│   ├── theme.ts        # Theme state
│   ├── user.ts         # User state
│   └── video.ts        # Video state
├── styles/              # Style files
│   ├── global.css      # Global styles
│   └── variables.css   # CSS variables
├── types/               # Type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── date.ts
│   ├── storage.ts
│   └── theme.ts
├── views/               # Page components
│   ├── User/
│   │   └── index.vue
│   ├── BangumiDetail.vue
│   ├── ForgotPassword.vue
│   ├── Home.vue
│   ├── Login.vue
│   ├── NotFound.vue
│   ├── Privacy.vue
│   ├── Register.vue
│   ├── Search.vue
│   ├── Terms.vue
│   └── Watch.vue
├── App.vue
├── main.ts
└── vite-env.d.ts
```

## Quick Start

### Requirements

- Node.js >= 18.0
- npm >= 9.0

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Visit http://localhost:5173

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run typecheck
```

## API Documentation

The project has reserved backend API interfaces, currently using mock data for development. The following interfaces need to be implemented when connecting to the backend:

### User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/login` | POST | User login |
| `/user/logout` | POST | User logout |
| `/user/info` | GET | Get user info |
| `/user/info` | PUT | Update user info |
| `/user/register` | POST | User registration |
| `/user/anime` | POST | Add to anime list |
| `/user/anime/:id` | DELETE | Remove from anime list |
| `/user/anime-list` | GET | Get user anime list |
| `/user/history` | GET | Get watch history |
| `/user/history/:id` | DELETE | Delete history record |

### Video Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/videos` | GET | Get video list |
| `/videos/:id` | GET | Get video details |
| `/videos/:id/like` | POST | Like video |
| `/videos/:id/collect` | POST | Collect video |
| `/categories` | GET | Get category list |
| `/tags` | GET | Get tag list |

### Comment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/comments` | GET | Get comment list |
| `/comments` | POST | Post comment |
| `/comments/:id/like` | POST | Like comment |

### Danmaku Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/danmaku/:videoId` | GET | Get danmaku list |
| `/danmaku` | POST | Send danmaku |

## Data Type Definitions

### User

```typescript
interface User {
  id: number
  username: string
  email: string
  avatar: string
  bio?: string
  createdAt: string
}
```

### Video

```typescript
interface Video {
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
}
```

### Episode

```typescript
interface Episode {
  id: number
  title: string
  videoUrl: string
  duration: number
}
```

### Comment

```typescript
interface Comment {
  id: number
  userId: number
  username: string
  avatar: string
  content: string
  likeCount: number
  createdAt: string
  replies?: Comment[]
}
```

### WatchHistory

```typescript
interface WatchHistory {
  videoId: number
  episodeId: number
  episodeTitle: string
  watchedAt: string
  progress: number
  video?: Video
}
```

## Environment Variables

Create a `.env.local` file to configure local environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Backend Integration Guide

### 1. Configure API Base URL

Modify `.env.production` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. Implement Backend Endpoints

Implement backend services according to the API documentation above, ensuring response data format matches type definitions.

### 3. Authentication

The project uses JWT Token authentication. Backend needs to:

1. Return `token` and `user` info on successful login
2. Check `Authorization: Bearer <token>` header for authenticated endpoints
3. Return 401 status code when token expires

### 4. Data Storage Requirements

Backend needs to store:

- User information (username, email, avatar, bio, etc.)
- Video information (title, cover, description, play count, etc.)
- Episode information (episode list, video URLs)
- User anime lists
- Watch history records
- Comment data
- Danmaku data

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |

## License

MIT License

## Version History

### v1.0.0 (2026-02-16)

- Completed core feature development
- Implemented video player
- Implemented user system
- Implemented anime list and watch history features
- Responsive design and theme switching
- Reserved backend API interfaces
