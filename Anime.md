动漫视频播放前端网站项目框架与开发流程
1. 项目概述
本项目是一个动漫视频播放前端网站，采用 Vue 3 技术栈，实现用户登录、黑白主题切换、多视频分区、多维度筛选（时间、动漫类型、国家）、视频播放、评论与弹幕功能。项目采用现代扁平风格界面设计，并预留与后端 API 的接入接口，便于后续无缝对接后端服务进行公测。

2. 技术栈
核心框架：Vue 3 (Composition API)

构建工具：Vite

路由管理：Vue Router 4

状态管理：Pinia

UI 组件库：Naive UI 或 Element Plus（支持主题定制、扁平风格）

样式方案：CSS 变量 + Tailwind CSS（可选，用于快速扁平化设计）

HTTP 客户端：Axios（拦截器、统一错误处理）

视频播放器：西瓜播放器（xgplayer）或 DPlayer（支持弹幕）

弹幕引擎：comment-core-library 或 danmaku.js

模拟数据/接口模拟：MSW (Mock Service Worker) 或本地 JSON 数据

类型支持：TypeScript（可选但推荐）

3. 功能模块
3.1 用户认证
登录页面（手机号/邮箱 + 密码）

登录状态持久化（JWT Token 存储于 localStorage 或 cookie）

退出登录

（可选）注册/找回密码（预留接口）

3.2 主题切换
黑白主题切换按钮

通过 CSS 变量控制颜色模式（浅色/深色）

跟随系统主题（可选）

3.3 视频分区导航
顶部或侧边导航栏展示分区：推荐、番剧、国创、剧场版、OVA 等

点击分区切换视频列表

3.4 视频筛选
在分区内提供筛选栏：

时间筛选：全部、今年、去年、更早

动漫类型：热血、恋爱、搞笑、科幻等（动态从接口获取）

国家/地区：日本、中国、美国等

筛选条件组合后重新请求视频列表

3.5 视频列表展示
网格布局显示视频卡片（封面、标题、播放量、更新至等）

支持分页或无限滚动（预留）

3.6 视频播放页面
视频播放器（支持清晰度切换、全屏、倍速等）

视频信息区：标题、简介、发布时间、播放量、点赞/收藏等（预留）

评论区域：

评论列表（头像、用户名、内容、时间、点赞、回复）

发表评论（需登录）

弹幕功能：

弹幕显示（滚动效果）

发送弹幕（需登录）

弹幕设置（开关、透明度、区域等）

3.7 其他预留功能
个人中心（修改资料、观看历史、收藏夹等）—— 仅预留路由和占位组件

搜索功能（按标题、标签）—— 预留接口

4. 项目目录结构
text
src/
├── assets/                 # 静态资源（图片、字体等）
├── components/             # 公共组件
│   ├── common/             # 通用组件（Button, Input, Card等）
│   ├── layout/             # 布局组件（Header, Footer, Sidebar）
│   ├── video/              # 视频相关组件（Player, Danmaku, Comment）
│   └── theme/              # 主题切换组件
├── views/                  # 页面视图
│   ├── Home.vue            # 首页（分区导航+视频列表）
│   ├── Login.vue           # 登录页
│   ├── VideoDetail.vue     # 视频播放页
│   ├── Search.vue          # 搜索页（预留）
│   └── User/               # 个人中心相关页面（预留）
├── router/                 # 路由配置
│   └── index.ts
├── stores/                 # Pinia 状态模块
│   ├── user.ts             # 用户状态
│   ├── theme.ts            # 主题状态
│   └── video.ts            # 视频列表/播放状态（可选）
├── services/               # API 服务层
│   ├── request.ts          # Axios 实例与拦截器
│   ├── api/                # 各模块接口定义
│   │   ├── user.ts
│   │   ├── video.ts
│   │   ├── comment.ts
│   │   └── danmaku.ts
│   └── mock/               # Mock 数据（用于开发）
├── types/                  # TypeScript 类型定义
│   └── index.ts
├── utils/                  # 工具函数
│   ├── storage.ts          # 本地存储封装
│   └── theme.ts            # 主题切换辅助
├── styles/                 # 全局样式
│   ├── variables.css       # CSS 变量
│   └── global.css
├── App.vue
└── main.ts
5. 开发流程
5.1 阶段一：需求确认与设计
确认功能细节，输出原型图或设计稿（扁平风格参考：大量留白、简洁线条、柔和阴影、无边框或细边框）

定义色彩系统（黑白主题色：浅色背景#FFFFFF，深色背景#121212，强调色可选用高饱和但克制）

设计路由结构（/、/login、/video/:id 等）

定义与后端的接口契约（API 文档），使用 Swagger/OpenAPI 或简单 Markdown 记录，以便后续替换 Mock

5.2 阶段二：项目初始化与基础搭建
使用 Vite 创建 Vue 3 + TypeScript 项目

安装并配置 Vue Router、Pinia

安装 UI 组件库（Naive UI 支持按需引入和主题定制）

安装 Tailwind CSS（可选）

配置 Axios 实例，添加请求/响应拦截器，统一处理 Token 和错误提示

配置环境变量（.env.development、.env.production），存储 API 基础地址

5.3 阶段三：核心功能开发
5.3.1 主题切换模块
在 Pinia 中创建 theme store，存储当前主题模式（light/dark）

定义 CSS 变量（如 --bg-color、--text-color），在根元素上动态切换 class

创建 ThemeToggle 组件，点击切换主题并持久化到 localStorage

5.3.2 用户认证模块
创建登录页面，使用表单验证

调用登录 API（先 Mock）获取 Token，存入 Pinia 和 localStorage

添加路由守卫，保护需要登录的页面（如个人中心、发表评论）

实现退出功能（清除 Token，跳转登录页）

5.3.3 视频分区与筛选模块
定义分区数据结构（id、名称）

顶部导航栏展示分区，激活样式

筛选栏组件：时间选择下拉、类型多选/单选、国家选择

根据分区和筛选条件组合，调用视频列表 API（Mock）

视频列表卡片组件，点击卡片跳转视频详情页

5.3.4 视频播放页面
使用西瓜播放器或 DPlayer 封装 VideoPlayer 组件

根据视频 ID 获取视频地址、清晰度列表

视频信息展示

弹幕模块：

初始化弹幕引擎，绑定到播放器容器

监听播放器时间更新，同步显示历史弹幕

发送弹幕：调用发送 API，成功后实时添加到弹幕引擎

评论模块：

评论列表组件（支持分页或无限加载）

发表评论表单（登录后才显示）

评论回复（预留）

5.3.5 接口 Mock 方案
在 services/mock 中编写 Mock 数据

或使用 MSW 拦截请求返回 Mock 数据，更接近真实网络请求

确保 Mock 数据结构与最终 API 一致，方便后续替换 baseURL

5.4 阶段四：前后端联调与适配
后端 API 就绪后，修改环境变量 VITE_API_BASE_URL 为真实后端地址

根据实际接口响应调整前端数据适配层（如字段名映射）

处理跨域问题（开发环境配置 proxy，生产环境由后端配置 CORS）

5.5 阶段五：测试与优化
单元测试（可选）：对核心工具函数、store 进行测试

体验优化：加载状态、骨架屏、错误边界

性能优化：路由懒加载、组件异步加载、虚拟列表（评论）

兼容性测试：不同浏览器、移动端适配（可选）

5.6 阶段六：构建与部署
执行 npm run build 生成 dist 目录

部署到 Nginx、Vercel、Netlify 或云服务器

配置前端路由 history 模式（需服务器支持回退到 index.html）

6. 预留后端 API 接入策略
接口定义先行：在开发初期即定义所有需要调用的接口（路径、方法、请求/响应格式），并形成文档。

环境变量控制：通过 VITE_API_BASE_URL 动态切换 API 地址，开发环境可指向 Mock 服务或本地后端。

请求层封装：所有 API 调用集中在 services/api 目录，每个模块导出函数，例如：

ts
// services/api/video.ts
export const getVideoList = (params: VideoListParams) => {
  return request.get('/videos', { params })
}
Mock 数据替换：当后端接口完成时，只需修改 request.ts 中的 baseURL，Mock 服务可选择性关闭。

类型保障：使用 TypeScript 定义请求参数和响应数据类型，确保前后端数据契约一致。

7. 风险与注意事项
弹幕模块的性能：大量弹幕同时渲染可能卡顿，可考虑使用 Canvas 渲染或限制同时显示的弹幕数量。

视频播放器的兼容性：HLS 格式需要额外处理（如使用 hls.js）。

黑白主题切换时，UI 组件库的主题同步（Naive UI 支持动态切换主题）。

确保 Token 过期时自动跳转登录，并尝试静默刷新（如果后端支持 refresh token）。

8. 总结
本框架详细描述了动漫视频播放前端网站的技术选型、功能模块、项目结构和分阶段开发流程。通过预留接口层和 Mock 方案，项目可在内测阶段无后端独立运行，待后端就绪后快速接入，降低联调风险。按照此流程开发，可确保项目结构清晰、易于维护和扩展。

---

## 9. 开发进度记录

### v1.0.0 - 初始版本 (2026-02-14)

#### 已完成阶段

**✅ 阶段一：需求确认与设计**
- 确认功能细节，采用现代扁平风格界面设计
- 定义色彩系统（浅色背景#FFFFFF，深色背景#121212，强调色#0ea5e9）
- 设计路由结构（/、/login、/video/:id、/search、/user）
- 定义与后端的接口契约（TypeScript类型定义）

**✅ 阶段二：项目初始化与基础搭建**
- 使用 Vite 创建 Vue 3 + TypeScript 项目
- 安装并配置 Vue Router 4、Pinia
- 安装 UI 组件库 Naive UI（支持按需引入和主题定制）
- 安装 Tailwind CSS v4 + @tailwindcss/postcss
- 配置 Axios 实例，添加请求/响应拦截器
- 配置环境变量（.env.development、.env.production）

**✅ 阶段三：核心功能开发**

*5.3.1 主题切换模块*
- [x] 在 Pinia 中创建 theme store（stores/theme.ts）
- [x] 定义 CSS 变量（styles/variables.css）
- [x] 创建 ThemeToggle 组件（components/theme/ThemeToggle.vue）
- [x] 支持系统主题跟随

*5.3.2 用户认证模块*
- [x] 创建登录页面（views/Login.vue）
- [x] 表单验证（邮箱+密码）
- [x] Mock 登录接口
- [x] JWT Token 存储于 localStorage
- [x] 路由守卫保护需要登录的页面
- [x] 退出登录功能

*5.3.3 视频分区与筛选模块*
- [x] 定义分区数据结构（推荐、番剧、国创、剧场版、OVA）
- [x] 顶部导航栏展示分区（components/layout/AppHeader.vue）
- [x] 筛选栏组件：年份、类型、国家选择
- [x] 视频列表卡片组件（components/video/VideoCard.vue）

*5.3.4 视频播放页面*
- [x] 使用 xgplayer 封装 VideoPlayer 组件
- [x] 视频信息展示（标题、简介、播放量、点赞、收藏）
- [x] 弹幕发送组件（components/video/DanmakuSender.vue）
- [x] 评论模块（components/video/CommentSection.vue）
- [x] 选集功能
- [x] 相关推荐

*5.3.5 接口 Mock 方案*
- [x] 在 services/mock 中编写 Mock 数据
- [x] Mock 数据结构与最终 API 一致

**✅ 阶段六：构建与部署准备**
- [x] Git 仓库初始化
- [x] 创建 v1.0.0 版本标签
- [x] 开发服务器运行正常（http://localhost:3000/）

#### 项目文件清单

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue      # 主布局组件
│   │   ├── AppHeader.vue      # 顶部导航栏
│   │   └── AppFooter.vue      # 底部页脚
│   ├── theme/
│   │   └── ThemeToggle.vue    # 主题切换按钮
│   └── video/
│       ├── VideoCard.vue      # 视频卡片
│       ├── VideoPlayer.vue    # 视频播放器
│       ├── DanmakuSender.vue  # 弹幕发送
│       └── CommentSection.vue # 评论区
├── views/
│   ├── Home.vue               # 首页
│   ├── Login.vue              # 登录页
│   ├── VideoDetail.vue        # 视频详情页
│   ├── Search.vue             # 搜索页
│   ├── NotFound.vue           # 404页面
│   └── User/
│       └── index.vue          # 个人中心
├── router/
│   └── index.ts               # 路由配置
├── stores/
│   ├── user.ts                # 用户状态
│   ├── theme.ts               # 主题状态
│   └── video.ts               # 视频状态
├── services/
│   ├── request.ts             # Axios 实例
│   ├── api/
│   │   ├── user.ts            # 用户接口
│   │   ├── video.ts           # 视频接口
│   │   ├── comment.ts         # 评论接口
│   │   └── danmaku.ts         # 弹幕接口
│   └── mock/
│       └── index.ts           # Mock 数据
├── types/
│   └── index.ts               # 类型定义
├── utils/
│   ├── storage.ts             # 本地存储
│   ├── theme.ts               # 主题工具
│   └── date.ts                # 日期工具
├── styles/
│   ├── variables.css          # CSS 变量
│   └── global.css             # 全局样式
├── App.vue
├── main.ts
└── vite-env.d.ts
```

#### 待完成阶段

**⏳ 阶段四：前后端联调与适配**
- [ ] 后端 API 就绪后，修改环境变量
- [ ] 根据实际接口响应调整前端数据适配层
- [ ] 处理跨域问题

**⏳ 阶段五：测试与优化**
- [ ] 单元测试
- [ ] 加载状态、骨架屏优化
- [ ] 路由懒加载、组件异步加载
- [ ] 兼容性测试

#### Git 提交记录

| 提交ID | 日期 | 说明 |
|--------|------|------|
| 78ad2fb | 2026-02-14 | feat: 初始化项目 - 动漫视频播放前端网站 |
| 5cb0592 | 2026-02-14 | fix: 修复Tailwind CSS v4 PostCSS配置 |

#### 版本标签

- **v1.0.0** - 初始版本，完成核心功能开发