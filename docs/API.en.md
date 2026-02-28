# API Documentation

## Basic Information

- **Base URL**: `/api`
- **Authentication**: JWT Token
- **Request Header**: `Authorization: Bearer <token>`
- **Response Format**: JSON

## Response Format

### Success Response

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

### Error Response

```json
{
  "code": 401,
  "message": "Unauthorized",
  "data": null
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 400 | Bad Request |
| 401 | Unauthorized/Token Expired |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## User Authentication Endpoints

### Login

**POST** `/user/login`

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Data**:
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

### Register

**POST** `/user/register`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response Data**: Same as login

### Logout

**POST** `/user/logout`

**Authentication Required**: Yes

---

## User Information Endpoints

### Get User Info

**GET** `/user/info`

**Authentication Required**: Yes

**Response Data**:
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

### Update User Info

**PUT** `/user/info`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "username": "string",
  "bio": "string"
}
```

### Update Avatar

**PUT** `/user/avatar`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "avatar": "string"
}
```

### Change Password

**PUT** `/user/password`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

### Get User Statistics

**GET** `/user/stats`

**Authentication Required**: Yes

**Response Data**:
```json
{
  "likeCount": 0,
  "commentCount": 0,
  "animeCount": 0,
  "historyCount": 0,
  "watchTime": 0
}
```

### Get User Likes

**GET** `/user/likes`

**Authentication Required**: Yes

**Response Data**:
```json
{
  "videoIds": [1, 2, 3],
  "commentIds": [1, 2, 3]
}
```

### Get User Collections

**GET** `/user/collections`

**Authentication Required**: Yes

**Response Data**:
```json
{
  "videoIds": [1, 2, 3]
}
```

---

## Anime List Endpoints

### Get Anime List

**GET** `/user/anime-list`

**Authentication Required**: Yes

**Response Data**:
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

### Add to Anime List

**POST** `/user/anime`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "videoId": 1,
  "status": "watching"
}
```

### Remove from Anime List

**DELETE** `/user/anime/:videoId`

**Authentication Required**: Yes

### Update Anime Status

**PUT** `/user/anime/:videoId`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "status": "completed"
}
```

---

## Watch History Endpoints

### Get Watch History

**GET** `/user/history`

**Authentication Required**: Yes

**Query Parameters**:
- `page`: Page number, default 1
- `pageSize`: Items per page, default 20

**Response Data**:
```json
{
  "list": [
    {
      "videoId": 1,
      "episodeId": 1,
      "episodeTitle": "Episode 1",
      "watchedAt": "string",
      "progress": 120,
      "video": { ... }
    }
  ],
  "total": 100
}
```

### Update Watch Progress

**POST** `/user/history`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "videoId": 1,
  "episodeId": 1,
  "episodeTitle": "Episode 1",
  "progress": 120
}
```

### Delete Watch History

**DELETE** `/user/history/:videoId`

**Authentication Required**: Yes

### Clear Watch History

**DELETE** `/user/history`

**Authentication Required**: Yes

---

## Video Endpoints

### Get Video List

**GET** `/videos`

**Query Parameters**:
- `category`: Category
- `year`: Year
- `type`: Type
- `country`: Country
- `page`: Page number
- `pageSize`: Items per page

**Response Data**:
```json
{
  "list": [ ... ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### Get Video Details

**GET** `/videos/:id`

**Response Data**:
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
      "title": "Episode 1",
      "videoUrl": "string",
      "duration": 1440
    }
  ],
  "relatedVideos": [ ... ]
}
```

### Get Video Like/Collect Status

**GET** `/videos/:id/status`

**Authentication Required**: Yes

**Response Data**:
```json
{
  "isLiked": false,
  "isCollected": false
}
```

### Like Video

**POST** `/videos/:id/like`

**Authentication Required**: Yes

### Unlike Video

**DELETE** `/videos/:id/like`

**Authentication Required**: Yes

### Collect Video

**POST** `/videos/:id/collect`

**Authentication Required**: Yes

### Uncollect Video

**DELETE** `/videos/:id/collect`

**Authentication Required**: Yes

### Search Videos

**GET** `/search`

**Query Parameters**:
- `keyword`: Search keyword
- `page`: Page number
- `pageSize`: Items per page

### Get Recommended Videos

**GET** `/videos/:id/recommendations`

**Query Parameters**:
- `limit`: Number of items, default 6

### Get Popular Videos

**GET** `/videos/popular`

**Query Parameters**:
- `limit`: Number of items, default 10

### Get Latest Videos

**GET** `/videos/latest`

**Query Parameters**:
- `limit`: Number of items, default 10

### Get Weekly Schedule

**GET** `/videos/schedule`

**Response Data**:
```json
{
  "Monday": [ ... ],
  "Tuesday": [ ... ],
  ...
}
```

### Increment Play Count

**POST** `/videos/:id/play`

---

## Comment Endpoints

### Get Video Comments

**GET** `/videos/:videoId/comments`

**Query Parameters**:
- `page`: Page number
- `pageSize`: Items per page

**Response Data**:
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

### Post Comment

**POST** `/comments`

**Authentication Required**: Yes

**Request Body**:
```json
{
  "videoId": 1,
  "content": "string",
  "parentId": null
}
```

### Like Comment

**POST** `/comments/:id/like`

**Authentication Required**: Yes

### Unlike Comment

**DELETE** `/comments/:id/like`

**Authentication Required**: Yes

### Delete Comment

**DELETE** `/comments/:id`

**Authentication Required**: Yes

---

## Category and Tag Endpoints

### Get Category List

**GET** `/categories`

**Response Data**:
```json
[
  {
    "id": 1,
    "name": "Anime",
    "slug": "bangumi",
    "icon": "string"
  }
]
```

### Get Tag List

**GET** `/tags`

**Response Data**:
```json
[
  {
    "id": 1,
    "name": "Action",
    "type": "genre"
  }
]
```

---

## Danmaku Endpoints

### Get Danmaku List

**GET** `/videos/:videoId/danmaku`

**Query Parameters**:
- `episodeId`: Episode ID

**Response Data**:
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

### Send Danmaku

**POST** `/danmaku`

**Authentication Required**: Yes

**Request Body**:
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
