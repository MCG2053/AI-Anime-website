# AnimeVideo 前端项目开发历程

## 项目概述

AnimeVideo 是一个现代化的动漫视频播放平台前端项目，采用 Vue 3 + TypeScript + Vite 技术栈构建。本文档记录了项目从初始化到正式版本发布的完整开发历程。

## 技术选型

### 核心技术栈

| 技术 | 版本 | 选型理由 |
|------|------|----------|
| Vue 3 | 3.5.28 | Composition API 提供更好的代码组织和复用能力 |
| TypeScript | 5.9.3 | 类型安全，提升代码质量和开发效率 |
| Vite | 7.3.1 | 快速的开发服务器和构建工具 |
| Pinia | 3.0.4 | Vue 3 官方推荐的状态管理库 |
| Vue Router | 4.6.4 | Vue 生态的标准路由解决方案 |
| Tailwind CSS | 4.1.18 | 原子化 CSS，快速构建响应式界面 |
| xgplayer | 3.0.23 | 西瓜播放器，功能完善的 HTML5 视频播放器 |
| Axios | 1.13.5 | 成熟的 HTTP 客户端 |
| Naive UI | 2.43.2 | Vue 3 组件库，提供丰富的 UI 组件 |

## 开发阶段

### 第一阶段：项目初始化与基础架构

**开发内容：**

1. **项目脚手架搭建**
   - 使用 Vite 创建 Vue 3 + TypeScript 项目
   - 配置路径别名 `@` 指向 `src` 目录
   - 配置环境变量文件（.env.development, .env.production）

2. **目录结构设计**
   ```
   src/
   ├── components/    # 组件
   ├── router/        # 路由
   ├── services/      # API 服务
   ├── stores/        # 状态管理
   ├── styles/        # 样式
   ├── types/         # 类型定义
   ├── utils/         # 工具函数
   └── views/         # 页面
   ```

3. **基础样式系统**
   - CSS 变量定义（颜色、间距、圆角、字体等）
   - 明暗主题切换支持
   - 全局样式重置

4. **HTTP 请求封装**
   - Axios 实例配置
   - 请求/响应拦截器
   - Token 自动注入
   - 错误统一处理

### 第二阶段：核心页面开发

**开发内容：**

1. **布局组件**
   - AppLayout：主布局容器
   - AppHeader：顶部导航栏（Logo、搜索、用户菜单）
   - AppFooter：底部信息栏

2. **首页 (Home.vue)**
   - 分类标签切换
   - 视频筛选面板（年份、地区、类型、状态）
   - 视频网格/列表视图
   - 番剧更新时间表
   - 骨架屏加载状态

3. **视频详情页 (BangumiDetail.vue)**
   - 番剧信息展示
   - 分集列表
   - 相关推荐
   - 收藏/追番操作

4. **播放页 (Watch.vue)**
   - 视频播放器集成
   - 剧集选择
   - 评论区域
   - 相关推荐

5. **用户相关页面**
   - 登录页 (Login.vue)
   - 注册页 (Register.vue)
   - 忘记密码页 (ForgotPassword.vue)
   - 个人中心 (User/index.vue)

6. **其他页面**
   - 搜索页 (Search.vue)
   - 用户协议页 (Terms.vue)
   - 隐私政策页 (Privacy.vue)
   - 404 页面 (NotFound.vue)

### 第三阶段：组件开发

**通用组件：**

1. **VideoCard** - 视频卡片组件
   - 封面展示
   - 标题、播放量、更新信息
   - 悬停效果

2. **VideoListItem** - 视频列表项组件
   - 横向布局的视频信息展示

3. **CategoryTabs** - 分类标签组件
   - 水平滚动的分类导航

4. **WeekSchedule** - 周日历组件
   - 番剧更新时间表
   - 按周分组展示

5. **Skeleton** - 骨架屏组件
   - 多种类型（卡片、列表、文本）

6. **ViewToggle** - 视图切换组件
   - 网格/列表视图切换

7. **Toast** - 消息提示组件
   - 成功/错误/警告提示

**视频相关组件：**

1. **VideoPlayer** - 视频播放器组件
   - 播放/暂停控制
   - 进度条拖拽
   - 音量调节
   - 播放速度调节
   - 硬件/软件解码切换
   - 画中画模式
   - 全屏播放
   - 快进/快退

2. **CommentSection** - 评论区组件
   - 评论列表
   - 评论回复
   - 点赞功能

3. **DanmakuSender** - 弹幕发送组件
   - 弹幕输入
   - 颜色选择
   - 类型选择

### 第四阶段：状态管理

**Store 设计：**

1. **user.ts** - 用户状态
   - 用户信息存储
   - 登录状态管理
   - Token 管理

2. **video.ts** - 视频状态
   - 当前分类
   - 筛选条件

3. **animeList.ts** - 追番/历史状态
   - 追番列表（在看/已看完）
   - 观看历史
   - 本地存储持久化

4. **theme.ts** - 主题状态
   - 明暗主题切换
   - 主题持久化

### 第五阶段：视频播放器优化

**优化内容：**

1. **自定义控制栏**
   - 替换 xgplayer 默认控制栏
   - 实现自定义 UI 样式

2. **功能增强**
   - 进度条已播放/未播放颜色区分
   - 播放按钮样式优化
   - 解码模式下拉菜单
   - 画中画功能修复（使用原生浏览器 API）

3. **交互优化**
   - 控制栏悬停显示
   - 音量滑块悬停展开
   - 速度选择下拉菜单

### 第六阶段：用户功能完善

**功能开发：**

1. **追番功能**
   - 添加到追番列表
   - 状态切换（在看/已看完）
   - 从列表移除

2. **观看历史**
   - 自动记录播放历史
   - 历史列表展示
   - 清除历史记录

3. **个人中心**
   - 统计数据展示
   - 追番列表管理
   - 历史记录管理

### 第七阶段：API 接口预留

**接口设计：**

1. **用户接口** (services/api/user.ts)
   - 登录/登出
   - 用户信息获取/更新
   - 注册

2. **视频接口** (services/api/video.ts)
   - 视频列表
   - 视频详情
   - 分类/标签
   - 点赞/收藏

3. **评论接口** (services/api/comment.ts)
   - 评论列表
   - 发表评论
   - 点赞评论

4. **弹幕接口** (services/api/danmaku.ts)
   - 弹幕列表
   - 发送弹幕

## 遇到的问题与解决方案

### 1. xgplayer 画中画功能不工作

**问题：** xgplayer 的 PiP API 在 TypeScript 中类型不完整，调用时报错。

**解决方案：** 使用浏览器原生的 Picture-in-Picture API：
```typescript
if (document.pictureInPictureElement) {
  document.exitPictureInPicture()
} else if (document.pictureInPictureEnabled) {
  video.requestPictureInPicture()
}
```

### 2. 进度条样式兼容性问题

**问题：** 不同浏览器的 range input 样式差异较大。

**解决方案：** 使用 CSS 渐变动态设置进度条背景：
```typescript
const progressStyle = computed(() => ({
  background: `linear-gradient(to right, var(--color-primary) ${progress.value}%, rgba(255, 255, 255, 0.3) ${progress.value}%)`
}))
```

### 3. 本地存储数据同步

**问题：** 用户数据在多个组件间需要同步。

**解决方案：** 使用 Pinia store 集中管理，并在 store 初始化时从 localStorage 加载数据。

### 4. 响应式布局适配

**问题：** 不同屏幕尺寸下的布局适配。

**解决方案：** 使用 CSS Grid 和媒体查询实现响应式布局：
```css
.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 640px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 性能优化

1. **路由懒加载** - 使用动态 import 实现页面按需加载
2. **组件懒加载** - 大型组件使用 defineAsyncComponent
3. **图片懒加载** - 使用 loading="lazy" 属性
4. **骨架屏** - 提升加载体验
5. **CSS 变量** - 减少样式重复计算
6. **防抖/节流** - 搜索输入等场景使用防抖

## 后续规划

### 短期目标

1. 接入真实后端 API
2. 完善弹幕功能
3. 添加视频下载功能
4. 优化移动端体验

### 长期目标

1. PWA 支持
2. 多语言国际化
3. SSR 服务端渲染
4. 小程序版本

## 总结

本项目从零开始构建了一个完整的动漫视频播放平台前端，涵盖了现代 Web 前端开发的核心技术点。通过模块化的组件设计、类型安全的 TypeScript 开发、响应式的 UI 实现，为用户提供了流畅的观看体验。项目预留了完善的后端 API 接口，便于后续与后端服务对接。

---

*文档版本：v1.0.0*
*最后更新：2026-02-16*
