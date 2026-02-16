# API 接口文档

## 基础信息

- **Base URL**: `/api`
- **认证方式**: JWT Token
- **请求头**: `Authorization: Bearer <token>`
- **响应格式**: JSON

## 响应格式

### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

### 错误响应

```json
{
  "code": 401,
  "message": "未授权",
  "data": null
}
```

## 错误码定义

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/Token过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 用户认证接口

### 登录

**POST** `/user/login`

**请求参数**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应数据**:
```json
{
  "token": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "avatar": "string",
    "bio": "string",
    "createdAt": "2024-01-01T00:00:00Z",
    "likeCount": 0,
    "commentCount": 0,
    "animeCount": 0,
    "historyCount": 0
  }
}
```

### 注册

**POST** `/user/register`

**请求参数**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应数据**: 同登录

### 登出

**POST** `/user/logout`

**需要认证**: 是

---

## 用户信息接口

### 获取用户信息

**GET** `/user/info`

**需要认证**: 是

**响应数据**:
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "createdAt": "string",
  "likeCount": 0,
  "commentCount": 0,
  "animeCount": 0,
  "historyCount": 0
}
```

### 更新用户信息

**PUT** `/user/info`

**需要认证**: 是

**请求参数**:
```json
{
  "username": "string",
  "bio": "string"
}
```

### 更新头像

**PUT** `/user/avatar`

**需要认证**: 是

**请求参数**:
```json
{
  "avatar": "string"
}
```

### 修改密码

**PUT** `/user/password`

**需要认证**: 是

**请求参数**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### 获取用户统计数据

**GET** `/user/stats`

**需要认证**: 是

**响应数据**:
```json
{
  "likeCount": 0,
  "commentCount": 0,
  "animeCount": 0,
  "historyCount": 0,
  "watchTime": 0
}
```

### 获取用户点赞记录

**GET** `/user/likes`

**需要认证**: 是

**响应数据**:
```json
{
  "videoIds": [1, 2, 3],
  "commentIds": [1, 2, 3]
}
```

### 获取用户收藏记录

**GET** `/user/collections`

**需要认证**: 是

**响应数据**:
```json
{
  "videoIds": [1, 2, 3]
}
```

---

## 追番接口

### 获取追番列表

**GET** `/user/anime-list`

**需要认证**: 是

**响应数据**:
```json
{
  "watching": [
    {
      "videoId": 1,
      "status": "watching",
      "addedAt": "string",
      "video": { ... }
    }
  ],
  "completed": [ ... ],
  "history": [ ... ]
}
```

### 添加追番

**POST** `/user/anime`

**需要认证**: 是

**请求参数**:
```json
{
  "videoId": 1,
  "status": "watching"
}
```

### 移除追番

**DELETE** `/user/anime/:videoId`

**需要认证**: 是

### 更新追番状态

**PUT** `/user/anime/:videoId`

**需要认证**: 是

**请求参数**:
```json
{
  "status": "completed"
}
```

---

## 观看历史接口

### 获取观看历史

**GET** `/user/history`

**需要认证**: 是

**查询参数**:
- `page`: 页码，默认 1
- `pageSize`: 每页数量，默认 20

**响应数据**:
```json
{
  "list": [
    {
      "videoId": 1,
      "episodeId": 1,
      "episodeTitle": "第1集",
      "watchedAt": "string",
      "progress": 120,
      "video": { ... }
    }
  ],
  "total": 100
}
```

### 更新观看进度

**POST** `/user/history`

**需要认证**: 是

**请求参数**:
```json
{
  "videoId": 1,
  "episodeId": 1,
  "episodeTitle": "第1集",
  "progress": 120
}
```

### 删除观看历史

**DELETE** `/user/history/:videoId`

**需要认证**: 是

### 清空观看历史

**DELETE** `/user/history`

**需要认证**: 是

---

## 视频接口

### 获取视频列表

**GET** `/videos`

**查询参数**:
- `category`: 分类
- `year`: 年份
- `type`: 类型
- `country`: 国家
- `page`: 页码
- `pageSize`: 每页数量

**响应数据**:
```json
{
  "list": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 获取视频详情

**GET** `/videos/:id`

**响应数据**:
```json
{
  "id": 1,
  "title": "string",
  "cover": "string",
  "description": "string",
  "playCount": 0,
  "likeCount": 0,
  "collectCount": 0,
  "episode": "string",
  "category": "string",
  "tags": [],
  "country": "string",
  "year": 2024,
  "videoUrl": "string",
  "episodes": [
    {
      "id": 1,
      "title": "第1集",
      "videoUrl": "string",
      "duration": 1440
    }
  ],
  "relatedVideos": [ ... ]
}
```

### 获取视频点赞/收藏状态

**GET** `/videos/:id/status`

**需要认证**: 是

**响应数据**:
```json
{
  "isLiked": false,
  "isCollected": false
}
```

### 点赞视频

**POST** `/videos/:id/like`

**需要认证**: 是

### 取消点赞

**DELETE** `/videos/:id/like`

**需要认证**: 是

### 收藏视频

**POST** `/videos/:id/collect`

**需要认证**: 是

### 取消收藏

**DELETE** `/videos/:id/collect`

**需要认证**: 是

### 搜索视频

**GET** `/search`

**查询参数**:
- `keyword`: 搜索关键词
- `page`: 页码
- `pageSize`: 每页数量

### 获取推荐视频

**GET** `/videos/:id/recommendations`

**查询参数**:
- `limit`: 数量，默认 6

### 获取热门视频

**GET** `/videos/popular`

**查询参数**:
- `limit`: 数量，默认 10

### 获取最新视频

**GET** `/videos/latest`

**查询参数**:
- `limit`: 数量，默认 10

### 获取周更时间表

**GET** `/videos/schedule`

**响应数据**:
```json
{
  "周一": [ ... ],
  "周二": [ ... ],
  ...
}
```

### 增加播放次数

**POST** `/videos/:id/play`

---

## 评论接口

### 获取视频评论

**GET** `/videos/:videoId/comments`

**查询参数**:
- `page`: 页码
- `pageSize`: 每页数量

**响应数据**:
```json
{
  "list": [
    {
      "id": 1,
      "userId": 1,
      "username": "string",
      "avatar": "string",
      "content": "string",
      "likeCount": 0,
      "createdAt": "string",
      "replies": [ ... ]
    }
  ],
  "total": 100
}
```

### 发表评论

**POST** `/comments`

**需要认证**: 是

**请求参数**:
```json
{
  "videoId": 1,
  "content": "string",
  "parentId": null
}
```

### 点赞评论

**POST** `/comments/:id/like`

**需要认证**: 是

### 取消点赞评论

**DELETE** `/comments/:id/like`

**需要认证**: 是

### 删除评论

**DELETE** `/comments/:id`

**需要认证**: 是

---

## 分类和标签接口

### 获取分类列表

**GET** `/categories`

**响应数据**:
```json
[
  {
    "id": 1,
    "name": "番剧",
    "slug": "bangumi",
    "icon": "string"
  }
]
```

### 获取标签列表

**GET** `/tags`

**响应数据**:
```json
[
  {
    "id": 1,
    "name": "热血",
    "type": "genre"
  }
]
```

---

## 弹幕接口

### 获取弹幕列表

**GET** `/videos/:videoId/danmaku`

**查询参数**:
- `episodeId`: 集数 ID

**响应数据**:
```json
[
  {
    "id": 1,
    "content": "string",
    "time": 10.5,
    "color": "#ffffff",
    "type": "scroll",
    "userId": 1,
    "createdAt": "string"
  }
]
```

### 发送弹幕

**POST** `/danmaku`

**需要认证**: 是

**请求参数**:
```json
{
  "videoId": 1,
  "episodeId": 1,
  "content": "string",
  "time": 10.5,
  "color": "#ffffff",
  "type": "scroll"
}
```
