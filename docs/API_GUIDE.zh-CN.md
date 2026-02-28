# API 接口操作指南

本文档提供 Anime Video 平台 API 接口的完整配置与操作指南，涵盖 Windows、Linux、macOS 三大平台，以及本地开发环境与云端生产环境的配置说明。

---

## 目录

- [环境要求](#环境要求)
- [本地开发环境配置](#本地开发环境配置)
- [云端生产环境配置](#云端生产环境配置)
- [API 接口调用示例](#api-接口调用示例)
- [常见问题与解决方案](#常见问题与解决方案)

---

## 环境要求

### 前端环境

| 软件 | 最低版本 | 推荐版本 |
|------|---------|---------|
| Node.js | 16.x | 18.x+ |
| npm / pnpm | 8.x / 7.x | 最新版 |
| Git | 2.x | 最新版 |

### 后端服务器要求

| 组件 | 说明 |
|------|------|
| Web 服务器 | Nginx / Apache / Caddy |
| 后端运行时 | Node.js / Python / Java / Go 等 |
| 数据库 | MySQL / PostgreSQL / MongoDB |
| 缓存服务 | Redis (可选) |

---

## 本地开发环境配置

### Windows 平台

#### 1. 安装 Node.js

```powershell
# 方法一：使用官方安装程序
# 访问 https://nodejs.org/ 下载 LTS 版本安装

# 方法二：使用 winget (Windows 10/11)
winget install OpenJS.NodeJS.LTS

# 方法三：使用 Chocolatey
choco install nodejs-lts

# 验证安装
node --version
npm --version
```

#### 2. 克隆项目并安装依赖

```powershell
# 克隆仓库
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website

# 安装依赖
npm install
# 或使用 pnpm
npm install -g pnpm
pnpm install
```

#### 3. 配置环境变量

创建或编辑 `.env.development` 文件：

```env
# 本地开发环境配置
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Anime Video
```

#### 4. 配置 Vite 代理

项目已在 `vite.config.ts` 中配置了 API 代理：

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端服务器地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

#### 5. 启动本地后端服务器

假设后端服务运行在 `localhost:8080`：

```powershell
# 示例：启动 Node.js 后端
cd backend
npm run dev

# 或启动 Python 后端
python app.py

# 或启动 Java Spring Boot
mvn spring-boot:run
```

#### 6. 启动前端开发服务器

```powershell
npm run dev
# 访问 http://localhost:3000
```

---

### Linux 平台

#### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL/Fedora
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Arch Linux
sudo pacman -S nodejs npm

# 使用 nvm (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证安装
node --version
npm --version
```

#### 2. 克隆项目并安装依赖

```bash
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website
npm install
```

#### 3. 配置环境变量

```bash
# 创建开发环境配置
cat > .env.development << EOF
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Anime Video
EOF
```

#### 4. 启动服务

```bash
# 终端 1：启动后端服务 (假设端口 8080)
cd backend && npm run dev

# 终端 2：启动前端开发服务器
npm run dev
```

---

### macOS 平台

#### 1. 安装 Node.js

```bash
# 方法一：使用 Homebrew (推荐)
brew install node@18

# 方法二：使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc  # 或 ~/.bash_profile
nvm install 18
nvm use 18

# 验证安装
node --version
npm --version
```

#### 2. 克隆项目并安装依赖

```bash
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website
npm install
```

#### 3. 配置与启动

```bash
# 配置环境变量 (同 Linux)
export VITE_API_BASE_URL=/api

# 启动服务
npm run dev
```

---

## 云端生产环境配置

### 环境变量配置

创建 `.env.production` 文件：

```env
# 生产环境配置
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=Anime Video
```

### 构建生产版本

```bash
# 所有平台通用
npm run build
# 输出目录：dist/
```

---

### 云端服务器部署 (通用步骤)

#### 1. 准备服务器

**最低配置要求：**
- CPU: 1 核
- 内存: 1 GB
- 存储: 20 GB
- 带宽: 1 Mbps

#### 2. 安装必要软件

**Ubuntu/Debian:**

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Nginx
sudo apt install nginx -y

# 安装 Node.js (如需在服务器构建)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 安装 PM2 (Node.js 进程管理)
sudo npm install -g pm2
```

**CentOS/RHEL:**

```bash
sudo yum update -y
sudo yum install nginx -y
sudo yum install nodejs -y
sudo npm install -g pm2
```

#### 3. 配置 Nginx 反向代理

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/anime-video
```

**前端静态文件配置：**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/anime-video/dist;
        index index.html;
        try_files $uri $uri/ /index.html;  # SPA 路由支持
    }

    # API 反向代理
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/anime-video/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
```

**启用配置：**

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/anime-video /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

#### 4. 部署前端文件

```bash
# 创建目录
sudo mkdir -p /var/www/anime-video

# 上传构建文件 (本地执行)
scp -r dist/* user@your-server:/var/www/anime-video/dist/

# 或在服务器上构建
cd /var/www/anime-video
git clone https://github.com/MCG2053/AI-Anime-website.git .
npm install
npm run build
```

#### 5. 部署后端服务

**使用 PM2 管理 Node.js 后端：**

```bash
# 启动后端服务
cd /var/www/anime-video/backend
pm2 start server.js --name "anime-api"

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs anime-api
```

#### 6. 配置 SSL 证书 (HTTPS)

**使用 Let's Encrypt (免费)：**

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

---

### Docker 部署 (跨平台)

#### 1. 创建 Dockerfile (前端)

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - anime-network

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/anime
    depends_on:
      - db
      - redis
    networks:
      - anime-network

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=anime
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - anime-network

  redis:
    image: redis:7-alpine
    networks:
      - anime-network

networks:
  anime-network:

volumes:
  postgres_data:
```

#### 3. 构建并运行

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

### 云服务商部署指南

#### 阿里云 / 腾讯云

```bash
# 1. 购买 ECS/CVM 服务器
# 2. 配置安全组开放端口：80, 443, 22
# 3. SSH 连接服务器
ssh root@your-server-ip

# 4. 按照上述通用步骤部署
```

#### AWS EC2

```bash
# 1. 创建 EC2 实例
# 2. 配置 Security Group 开放端口
# 3. 使用 SSH 或 AWS Systems Manager 连接

# 安装依赖
sudo yum update -y
sudo yum install -y nginx nodejs

# 部署应用
# ... 同通用步骤
```

#### Vercel / Netlify (前端托管)

```bash
# Vercel 部署
npm i -g vercel
vercel --prod

# 或连接 GitHub 仓库自动部署
```

---

## API 接口调用示例

### 认证接口

#### 登录

```bash
# cURL 示例
curl -X POST https://api.your-domain.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'

# 响应
# {
#   "code": 0,
#   "message": "success",
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     "user": { ... }
#   }
# }
```

#### 使用 Token 访问受保护接口

```bash
curl -X GET https://api.your-domain.com/api/user/info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### 视频接口

#### 获取视频列表

```bash
curl -X GET "https://api.your-domain.com/api/videos?category=anime&page=1&pageSize=20"
```

#### 获取视频详情

```bash
curl -X GET https://api.your-domain.com/api/videos/1
```

### JavaScript/TypeScript 调用示例

```typescript
import { api } from '@/services/api'

// 登录
const login = async () => {
  const response = await api.user.login({
    email: 'user@example.com',
    password: 'password123'
  })
  const { token, user } = response.data.data
  console.log('登录成功:', user.username)
}

// 获取视频列表
const getVideos = async () => {
  const response = await api.video.getVideoList({
    category: 'anime',
    page: 1,
    pageSize: 20
  })
  console.log('视频列表:', response.data.data.list)
}

// 点赞视频
const likeVideo = async (videoId: number) => {
  await api.video.likeVideo(videoId)
  console.log('点赞成功')
}
```

---

## 常见问题与解决方案

### 1. 跨域问题 (CORS)

**问题：** 前端请求后端 API 时出现 CORS 错误

**解决方案：**

后端添加 CORS 头：

```javascript
// Node.js Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-domain.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
```

或使用 Nginx 配置：

```nginx
location /api {
    add_header 'Access-Control-Allow-Origin' 'https://your-domain.com';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
    # ... 其他代理配置
}
```

### 2. Token 过期处理

**问题：** JWT Token 过期导致请求失败

**解决方案：**

前端已实现自动处理：

```typescript
// src/services/request.ts
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### 3. 代理不生效

**问题：** 本地开发时 API 请求 404

**解决方案：**

检查 `vite.config.ts` 代理配置：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

确保后端服务运行在正确端口。

### 4. 生产环境 API 地址错误

**问题：** 部署后 API 请求地址不正确

**解决方案：**

检查 `.env.production` 配置：

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

重新构建：

```bash
npm run build
```

### 5. Nginx 502 Bad Gateway

**问题：** Nginx 返回 502 错误

**解决方案：**

1. 检查后端服务是否运行：

```bash
pm2 status
# 或
systemctl status your-backend-service
```

2. 检查端口是否正确：

```bash
netstat -tlnp | grep 8080
```

3. 检查 Nginx 配置中的 `proxy_pass` 地址

---

## 附录

### 环境变量完整列表

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API 基础地址 | `/api` 或 `https://api.example.com` |
| `VITE_APP_TITLE` | 应用标题 | `Anime Video` |

### 端口说明

| 服务 | 默认端口 | 说明 |
|------|---------|------|
| 前端开发服务器 | 3000 | Vite dev server |
| 后端 API 服务 | 8080 | 后端应用 |
| Nginx HTTP | 80 | 生产环境 HTTP |
| Nginx HTTPS | 443 | 生产环境 HTTPS |
| PostgreSQL | 5432 | 数据库 |
| Redis | 6379 | 缓存服务 |

### 相关文档

- [API 接口文档](./API.zh-CN.md)
- [开发指南](./DEVELOPMENT.md)
- [测试指南](./TEST.zh-CN.md)
