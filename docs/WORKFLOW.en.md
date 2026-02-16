# Project Development Workflow

## Project Overview

AnimeVideo is an anime video streaming platform frontend project, built with Vue 3 + TypeScript + Vite, using Naive UI as the component library.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Router**: Vue Router
- **UI Library**: Naive UI
- **Styles**: CSS Variables + Scoped CSS
- **Video Player**: xgplayer
- **Danmaku**: danmaku.js

## Directory Structure

```
src/
├── assets/              # Static assets
│   └── images/          # Image resources
├── components/          # Public components
│   ├── common/          # Common components
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   ├── AppLayout.vue
│   │   ├── Skeleton.vue
│   │   ├── ThemeToggle.vue
│   │   └── Toast.vue
│   └── video/           # Video-related components
│       ├── CommentSection.vue
│       ├── VideoCard.vue
│       ├── VideoListItem.vue
│       ├── VideoPlayer.vue
│       └── ViewToggle.vue
├── router/              # Router configuration
│   └── index.ts
├── services/            # Service layer
│   ├── api/             # API interface definitions
│   │   ├── comment.ts
│   │   ├── danmaku.ts
│   │   ├── index.ts
│   │   ├── user.ts
│   │   └── video.ts
│   ├── mock/            # Mock data
│   │   └── index.ts
│   └── request.ts       # HTTP request wrapper
├── stores/              # Pinia state management
│   ├── animeList.ts
│   ├── theme.ts
│   ├── user.ts
│   └── video.ts
├── styles/              # Global styles
│   └── global.css
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   ├── date.ts
│   └── storage.ts
├── views/               # Page components
│   ├── Home.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Watch.vue
│   ├── Search.vue
│   ├── BangumiDetail.vue
│   ├── ForgotPassword.vue
│   ├── Terms.vue
│   ├── Privacy.vue
│   ├── NotFound.vue
│   └── User/
│       └── index.vue
├── App.vue              # Root component
└── main.ts              # Entry file
```

## Development Workflow

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

### 2. Development Standards

#### Component Development

- Use `<script setup lang="ts">` syntax
- Use PascalCase for component naming
- Use scoped CSS for styles
- Follow single responsibility principle

#### State Management

- Use Pinia Composition API style
- Organize stores by feature modules
- Handle async operations in stores

#### API Calls

- Use interfaces from `services/api`
- Use TypeScript type constraints
- Handle errors uniformly in request.ts

### 3. Key Feature Implementation

#### User Authentication Flow

1. User enters credentials in Login.vue
2. Call userApi.login() to send request
3. On success, store token and user info in userStore
4. Route guard checks authentication status

#### Video Playback Flow

1. User clicks video card to enter Watch.vue
2. Get video details by videoId
3. Initialize xgplayer
4. Load danmaku data
5. Record watch history

#### Comment System Flow

1. Load video comment list
2. User enters comment content
3. Call commentApi.createComment() to submit
4. Update comment list

### 4. Theme Switching

The project uses CSS Variables for theme switching:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #1f2937;
}

.dark {
  --bg-color: #1f2937;
  --text-color: #f9fafb;
}
```

### 5. Responsive Design

- Use CSS Media Queries
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Mobile-first design approach

## Backend Integration Guide

### API Base Configuration

1. Modify baseURL in `src/services/request.ts`
2. Configure Vite proxy or CORS

### Authentication Method

- JWT Token authentication
- Token stored in localStorage
- Request header carries `Authorization: Bearer <token>`

### Data Format

Refer to type definitions in `src/types/index.ts`.

## Deployment Process

1. Run `npm run build` to build
2. Deploy dist directory to static server
3. Configure Nginx reverse proxy
4. Configure API proxy

## FAQ

### Q: How to add a new page?

1. Create component in `src/views/`
2. Add route in `src/router/index.ts`
3. Add corresponding API interfaces (if needed)

### Q: How to add a new API interface?

1. Add type definition in `src/types/index.ts`
2. Add method in `src/services/api/` corresponding file
3. Export in `src/services/api/index.ts`

### Q: How to debug Mock data?

Mock data is in `src/services/mock/index.ts`, mock data is used by default in development environment.
