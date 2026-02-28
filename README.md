# AnimeVideo - 动漫视频播放平台

[English](./README.en.md) | 简体中文

一个现代化的动漫视频播放前端应用，基于 Vue 3 + TypeScript + Vite 构建。

## 项目简介

AnimeVideo 是一个功能完善的动漫视频播放平台前端项目，提供视频浏览、播放、用户管理、收藏追番等核心功能。采用响应式设计，支持明暗主题切换，为用户提供优质的观看体验。

## 功能特性

### 核心功能

- **首页展示**
  - 多分类视频列表（推荐、番剧、国创、剧场版、OVA）
  - 番剧更新时间表（周日历视图）
  - 多维度筛选（年份、地区、类型、状态）
  - 网格/列表视图切换

- **视频播放**
  - 自研视频播放器（基于 ArtPlayer 5.x）
  - 弹幕功能（artplayer-plugin-danmuku）
  - 播放进度控制与记忆
  - 播放速度调节（0.5x - 2.0x）
  - 画中画模式
  - 全屏播放
  - 音量控制
  - 快进/快退（10秒）
  - 移动端优化控制栏

- **番剧详情**
  - 番剧信息展示
  - 分集列表
  - 相关推荐
  - 收藏/追番功能

- **用户系统**
  - 用户注册/登录
  - 个人中心
  - 追番列表（在看/已看完）
  - 观看历史
  - 个人信息管理

- **评论系统**
  - 评论发布
  - 评论回复
  - 点赞功能

### 界面特性

- 响应式设计，适配桌面端和移动端
- 明暗主题切换
- 流畅的动画过渡效果
- 骨架屏加载状态
- 现代化 UI 设计

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API) |
| 语言 | TypeScript 5.9 |
| 构建工具 | Vite 7.3 |
| 状态管理 | Pinia 3.0 |
| 路由 | Vue Router 4.6 |
| HTTP 客户端 | Axios 1.13 |
| 视频播放器 | ArtPlayer 5.3 |
| 弹幕插件 | artplayer-plugin-danmuku 5.2 |
| UI 组件库 | Naive UI 2.43 |
| CSS 方案 | Tailwind CSS 4.1 + CSS Variables |

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── common/          # 通用组件
│   │   ├── Skeleton.vue
│   │   ├── VideoCard.vue
│   │   ├── VideoListItem.vue
│   │   ├── ViewToggle.vue
│   │   └── WeekSchedule.vue
│   ├── layout/          # 布局组件
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   └── AppLayout.vue
│   ├── theme/           # 主题组件
│   │   └── ThemeToggle.vue
│   └── video/           # 视频相关组件
│       ├── CommentSection.vue
│       └── VideoPlayer.vue
├── router/              # 路由配置
│   └── index.ts
├── services/            # 服务层
│   ├── api/            # API 接口
│   │   ├── comment.ts
│   │   ├── danmaku.ts
│   │   ├── user.ts
│   │   └── video.ts
│   ├── mock/           # Mock 数据
│   │   └── index.ts
│   └── request.ts      # HTTP 请求封装
├── stores/              # 状态管理
│   ├── animeList.ts    # 追番/历史记录
│   ├── theme.ts        # 主题状态
│   ├── user.ts         # 用户状态
│   └── video.ts        # 视频状态
├── styles/              # 样式文件
│   ├── global.css      # 全局样式
│   └── variables.css   # CSS 变量
├── types/               # 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   ├── date.ts
│   ├── storage.ts
│   └── theme.ts
├── views/               # 页面组件
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

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 类型检查

```bash
npm run typecheck
```

## API 接口说明

项目已预留后端 API 接口，当前使用 Mock 数据进行开发。后端接入时需实现以下接口：

### 用户相关

| 接口 | 方法 | 说明 |
|------|------|------|
| `/user/login` | POST | 用户登录 |
| `/user/logout` | POST | 用户登出 |
| `/user/info` | GET | 获取用户信息 |
| `/user/info` | PUT | 更新用户信息 |
| `/user/register` | POST | 用户注册 |
| `/user/anime` | POST | 添加追番 |
| `/user/anime/:id` | DELETE | 移除追番 |
| `/user/anime-list` | GET | 获取用户追番列表 |
| `/user/history` | GET | 获取观看历史 |
| `/user/history/:id` | DELETE | 删除历史记录 |

### 视频相关

| 接口 | 方法 | 说明 |
|------|------|------|
| `/videos` | GET | 获取视频列表 |
| `/videos/:id` | GET | 获取视频详情 |
| `/videos/:id/like` | POST | 点赞视频 |
| `/videos/:id/collect` | POST | 收藏视频 |
| `/categories` | GET | 获取分类列表 |
| `/tags` | GET | 获取标签列表 |

### 评论相关

| 接口 | 方法 | 说明 |
|------|------|------|
| `/comments` | GET | 获取评论列表 |
| `/comments` | POST | 发表评论 |
| `/comments/:id/like` | POST | 点赞评论 |

### 弹幕相关

| 接口 | 方法 | 说明 |
|------|------|------|
| `/danmaku/:videoId` | GET | 获取弹幕列表 |
| `/danmaku` | POST | 发送弹幕 |

## 数据类型定义

### User 用户

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

### Video 视频

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

### Episode 剧集

```typescript
interface Episode {
  id: number
  title: string
  videoUrl: string
  duration: number
}
```

### Comment 评论

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

### WatchHistory 观看历史

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

## 环境变量配置

创建 `.env.local` 文件配置本地环境变量：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 后端接入指南

### 1. 配置 API 基础地址

修改 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. 实现后端接口

按照上述 API 接口说明实现后端服务，确保返回数据格式符合类型定义。

### 3. 认证机制

项目使用 JWT Token 认证，后端需：

1. 登录成功返回 `token` 和 `user` 信息
2. 需认证的接口检查 `Authorization: Bearer <token>` 头
3. Token 过期返回 401 状态码

### 4. 数据存储需求

后端需要存储以下数据：

- 用户信息（用户名、邮箱、头像、简介等）
- 视频信息（标题、封面、描述、播放量等）
- 剧集信息（剧集列表、视频URL）
- 用户追番列表
- 观看历史记录
- 评论数据
- 弹幕数据

## 浏览器支持

| 浏览器 | 版本 |
|--------|------|
| Chrome | 最新版 |
| Firefox | 最新版 |
| Safari | 最新版 |
| Edge | 最新版 |

## 许可证

MIT License

## 版本历史

### v1.0.0 (2026-02-16)

- 完成核心功能开发
- 实现视频播放器
- 实现用户系统
- 实现追番和历史记录功能
- 响应式设计与主题切换
- 预留后端 API 接口
