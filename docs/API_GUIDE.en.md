# API Interface Operation Guide

This document provides a complete configuration and operation guide for the Anime Video platform API interface, covering Windows, Linux, and macOS platforms, as well as local development and cloud production environment configurations.

---

## Table of Contents

- [Requirements](#requirements)
- [Local Development Environment Configuration](#local-development-environment-configuration)
- [Cloud Production Environment Configuration](#cloud-production-environment-configuration)
- [API Interface Usage Examples](#api-interface-usage-examples)
- [Troubleshooting](#troubleshooting)

---

## Requirements

### Frontend Environment

| Software | Minimum Version | Recommended Version |
|----------|-----------------|---------------------|
| Node.js | 16.x | 18.x+ |
| npm / pnpm | 8.x / 7.x | Latest |
| Git | 2.x | Latest |

### Backend Server Requirements

| Component | Description |
|-----------|-------------|
| Web Server | Nginx / Apache / Caddy |
| Backend Runtime | Node.js / Python / Java / Go, etc. |
| Database | MySQL / PostgreSQL / MongoDB |
| Cache Service | Redis (optional) |

---

## Local Development Environment Configuration

### Windows Platform

#### 1. Install Node.js

```powershell
# Method 1: Use official installer
# Visit https://nodejs.org/ to download LTS version

# Method 2: Use winget (Windows 10/11)
winget install OpenJS.NodeJS.LTS

# Method 3: Use Chocolatey
choco install nodejs-lts

# Verify installation
node --version
npm --version
```

#### 2. Clone Project and Install Dependencies

```powershell
# Clone repository
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website

# Install dependencies
npm install
# Or use pnpm
npm install -g pnpm
pnpm install
```

#### 3. Configure Environment Variables

Create or edit `.env.development` file:

```env
# Local development environment configuration
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Anime Video
```

#### 4. Configure Vite Proxy

The project has already configured API proxy in `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // Backend server address
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

#### 5. Start Local Backend Server

Assuming the backend service runs on `localhost:8080`:

```powershell
# Example: Start Node.js backend
cd backend
npm run dev

# Or start Python backend
python app.py

# Or start Java Spring Boot
mvn spring-boot:run
```

#### 6. Start Frontend Development Server

```powershell
npm run dev
# Visit http://localhost:3000
```

---

### Linux Platform

#### 1. Install Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL/Fedora
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Arch Linux
sudo pacman -S nodejs npm

# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### 2. Clone Project and Install Dependencies

```bash
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website
npm install
```

#### 3. Configure Environment Variables

```bash
# Create development environment configuration
cat > .env.development << EOF
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Anime Video
EOF
```

#### 4. Start Services

```bash
# Terminal 1: Start backend service (assuming port 8080)
cd backend && npm run dev

# Terminal 2: Start frontend development server
npm run dev
```

---

### macOS Platform

#### 1. Install Node.js

```bash
# Method 1: Use Homebrew (recommended)
brew install node@18

# Method 2: Use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc  # or ~/.bash_profile
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### 2. Clone Project and Install Dependencies

```bash
git clone https://github.com/MCG2053/AI-Anime-website.git
cd AI-Anime-website
npm install
```

#### 3. Configure and Start

```bash
# Configure environment variables (same as Linux)
export VITE_API_BASE_URL=/api

# Start services
npm run dev
```

---

## Cloud Production Environment Configuration

### Environment Variables Configuration

Create `.env.production` file:

```env
# Production environment configuration
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=Anime Video
```

### Build Production Version

```bash
# Universal for all platforms
npm run build
# Output directory: dist/
```

---

### Cloud Server Deployment (General Steps)

#### 1. Prepare Server

**Minimum Requirements:**
- CPU: 1 core
- RAM: 1 GB
- Storage: 20 GB
- Bandwidth: 1 Mbps

#### 2. Install Required Software

**Ubuntu/Debian:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install Node.js (if building on server)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PM2 (Node.js process manager)
sudo npm install -g pm2
```

**CentOS/RHEL:**

```bash
sudo yum update -y
sudo yum install nginx -y
sudo yum install nodejs -y
sudo npm install -g pm2
```

#### 3. Configure Nginx Reverse Proxy

Create Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/anime-video
```

**Frontend Static Files Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend static files
    location / {
        root /var/www/anime-video/dist;
        index index.html;
        try_files $uri $uri/ /index.html;  # SPA routing support
    }

    # API reverse proxy
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

    # Static resource caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/anime-video/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
}
```

**Enable Configuration:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/anime-video /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. Deploy Frontend Files

```bash
# Create directory
sudo mkdir -p /var/www/anime-video

# Upload build files (execute locally)
scp -r dist/* user@your-server:/var/www/anime-video/dist/

# Or build on server
cd /var/www/anime-video
git clone https://github.com/MCG2053/AI-Anime-website.git .
npm install
npm run build
```

#### 5. Deploy Backend Service

**Using PM2 to manage Node.js backend:**

```bash
# Start backend service
cd /var/www/anime-video/backend
pm2 start server.js --name "anime-api"

# Set up auto-start on boot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs anime-api
```

#### 6. Configure SSL Certificate (HTTPS)

**Using Let's Encrypt (free):**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

### Docker Deployment (Cross-Platform)

#### 1. Create Dockerfile (Frontend)

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Create docker-compose.yml

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

#### 3. Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

### Cloud Provider Deployment Guide

#### Alibaba Cloud / Tencent Cloud

```bash
# 1. Purchase ECS/CVM server
# 2. Configure security group to open ports: 80, 443, 22
# 3. SSH connect to server
ssh root@your-server-ip

# 4. Follow the general steps above for deployment
```

#### AWS EC2

```bash
# 1. Create EC2 instance
# 2. Configure Security Group to open ports
# 3. Connect using SSH or AWS Systems Manager

# Install dependencies
sudo yum update -y
sudo yum install -y nginx nodejs

# Deploy application
# ... Same as general steps
```

#### Vercel / Netlify (Frontend Hosting)

```bash
# Vercel deployment
npm i -g vercel
vercel --prod

# Or connect GitHub repository for automatic deployment
```

---

## API Interface Usage Examples

### Authentication Endpoints

#### Login

```bash
# cURL example
curl -X POST https://api.your-domain.com/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your-password"
  }'

# Response
# {
#   "code": 0,
#   "message": "success",
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     "user": { ... }
#   }
# }
```

#### Access Protected Endpoints with Token

```bash
curl -X GET https://api.your-domain.com/api/user/info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

### Video Endpoints

#### Get Video List

```bash
curl -X GET "https://api.your-domain.com/api/videos?category=anime&page=1&pageSize=20"
```

#### Get Video Details

```bash
curl -X GET https://api.your-domain.com/api/videos/1
```

### JavaScript/TypeScript Usage Examples

```typescript
import { api } from '@/services/api'

// Login
const login = async () => {
  const response = await api.user.login({
    email: 'user@example.com',
    password: 'password123'
  })
  const { token, user } = response.data.data
  console.log('Login successful:', user.username)
}

// Get video list
const getVideos = async () => {
  const response = await api.video.getVideoList({
    category: 'anime',
    page: 1,
    pageSize: 20
  })
  console.log('Video list:', response.data.data.list)
}

// Like video
const likeVideo = async (videoId: number) => {
  await api.video.likeVideo(videoId)
  console.log('Liked successfully')
}
```

---

## Troubleshooting

### 1. CORS Issues

**Problem:** CORS errors when frontend requests backend API

**Solution:**

Add CORS headers in backend:

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

Or use Nginx configuration:

```nginx
location /api {
    add_header 'Access-Control-Allow-Origin' 'https://your-domain.com';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
    # ... other proxy configurations
}
```

### 2. Token Expiration Handling

**Problem:** JWT Token expiration causing request failures

**Solution:**

Frontend has automatic handling implemented:

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

### 3. Proxy Not Working

**Problem:** API requests return 404 in local development

**Solution:**

Check `vite.config.ts` proxy configuration:

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

Ensure backend service is running on the correct port.

### 4. Production Environment API Address Error

**Problem:** Incorrect API request address after deployment

**Solution:**

Check `.env.production` configuration:

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

Rebuild:

```bash
npm run build
```

### 5. Nginx 502 Bad Gateway

**Problem:** Nginx returns 502 error

**Solution:**

1. Check if backend service is running:

```bash
pm2 status
# or
systemctl status your-backend-service
```

2. Check if port is correct:

```bash
netstat -tlnp | grep 8080
```

3. Check `proxy_pass` address in Nginx configuration

---

## Appendix

### Complete Environment Variables List

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | API base URL | `/api` or `https://api.example.com` |
| `VITE_APP_TITLE` | Application title | `Anime Video` |

### Port Reference

| Service | Default Port | Description |
|---------|--------------|-------------|
| Frontend Dev Server | 3000 | Vite dev server |
| Backend API Service | 8080 | Backend application |
| Nginx HTTP | 80 | Production HTTP |
| Nginx HTTPS | 443 | Production HTTPS |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache service |

### Related Documentation

- [API Documentation](./API.en.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TEST.en.md)
