# 项目开发流程文档

## 项目概述

AnimeVideo 是一个动漫视频播放平台前端项目，基于 Vue 3 + TypeScript + Vite 构建，使用 Naive UI 作为组件库。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件库**: Naive UI
- **样式**: CSS Variables + Scoped CSS
- **视频播放器**: xgplayer
- **弹幕**: danmaku.js

## 目录结构

```
src/
├── assets/              # 静态资源
│   └── images/          # 图片资源
├── components/          # 公共组件
│   ├── common/          # 通用组件
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   ├── AppLayout.vue
│   │   ├── Skeleton.vue
│   │   ├── ThemeToggle.vue
│   │   └── Toast.vue
│   └── video/           # 视频相关组件
│       ├── CommentSection.vue
│       ├── VideoCard.vue
│       ├── VideoListItem.vue
│       ├── VideoPlayer.vue
│       └── ViewToggle.vue
├── router/              # 路由配置
│   └── index.ts
├── services/            # 服务层
│   ├── api/             # API 接口定义
│   │   ├── comment.ts
│   │   ├── danmaku.ts
│   │   ├── index.ts
│   │   ├── user.ts
│   │   └── video.ts
│   ├── mock/            # Mock 数据
│   │   └── index.ts
│   └── request.ts       # HTTP 请求封装
├── stores/              # Pinia 状态管理
│   ├── animeList.ts
│   ├── theme.ts
│   ├── user.ts
│   └── video.ts
├── styles/              # 全局样式
│   └── global.css
├── types/               # TypeScript 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   ├── date.ts
│   └── storage.ts
├── views/               # 页面组件
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
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 开发流程

### 1. 环境准备

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run typecheck

# 构建生产版本
npm run build
```

### 2. 开发规范

#### 组件开发

- 使用 `<script setup lang="ts">` 语法
- 组件命名使用 PascalCase
- 样式使用 scoped CSS
- 遵循单一职责原则

#### 状态管理

- 使用 Pinia Composition API 风格
- Store 按功能模块划分
- 异步操作在 Store 中处理

#### API 调用

- 统一使用 `services/api` 中的接口
- 使用 TypeScript 类型约束
- 错误处理统一在 request.ts 中

### 3. 关键功能实现

#### 用户认证流程

1. 用户在 Login.vue 输入凭证
2. 调用 userApi.login() 发送请求
3. 成功后存储 token 和用户信息到 userStore
4. 路由守卫检查认证状态

#### 视频播放流程

1. 用户点击视频卡片进入 Watch.vue
2. 根据 videoId 获取视频详情
3. 初始化 xgplayer 播放器
4. 加载弹幕数据
5. 记录观看历史

#### 评论系统流程

1. 加载视频评论列表
2. 用户输入评论内容
3. 调用 commentApi.createComment() 提交
4. 更新评论列表

### 4. 主题切换

项目使用 CSS Variables 实现主题切换：

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

### 5. 响应式设计

- 使用 CSS Media Queries
- 断点：640px (sm), 768px (md), 1024px (lg)
- 移动端优先设计

## 后端对接指南

### API 基础配置

1. 修改 `src/services/request.ts` 中的 baseURL
2. 配置 Vite proxy 或 CORS

### 认证方式

- JWT Token 认证
- Token 存储在 localStorage
- 请求头携带 `Authorization: Bearer <token>`

### 数据格式

参考 `src/types/index.ts` 中的类型定义。

## 部署流程

1. 执行 `npm run build` 构建
2. 将 dist 目录部署到静态服务器
3. 配置 Nginx 反向代理
4. 配置 API 代理

## 常见问题

### Q: 如何添加新页面？

1. 在 `src/views/` 创建组件
2. 在 `src/router/index.ts` 添加路由
3. 添加对应的 API 接口（如需要）

### Q: 如何添加新的 API 接口？

1. 在 `src/types/index.ts` 添加类型定义
2. 在 `src/services/api/` 对应文件添加方法
3. 在 `src/services/api/index.ts` 导出

### Q: 如何调试 Mock 数据？

Mock 数据在 `src/services/mock/index.ts`，开发环境下默认使用 Mock 数据。
