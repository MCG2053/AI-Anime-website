<script setup lang="ts">
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: '首页', to: '/' },
  { label: '搜索', to: '/search' },
  { label: '个人中心', to: '/user' }
]

const categories = [
  { label: '番剧', to: '/?category=anime' },
  { label: '国创', to: '/?category=chinese' },
  { label: '剧场版', to: '/?category=movie' }
]

const aboutLinks = [
  { label: '关于平台', href: '#' },
  { label: '联系方式', href: '#' },
  { label: '帮助中心', href: '#' }
]
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__content">
        <div class="footer-brand">
          <h3 class="footer-brand__title">AnimeVideo</h3>
          <p class="footer-brand__desc">
            专注于动漫视频播放的平台，提供高清流畅的观看体验。
          </p>
        </div>

        <div class="footer-links">
          <div class="footer-links__group">
            <h4 class="footer-links__title">快速导航</h4>
            <ul class="footer-links__list">
              <li v-for="link in quickLinks" :key="link.to">
                <router-link :to="link.to" class="footer-link">{{ link.label }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-links__group">
            <h4 class="footer-links__title">热门分类</h4>
            <ul class="footer-links__list">
              <li v-for="cat in categories" :key="cat.to">
                <router-link :to="cat.to" class="footer-link">{{ cat.label }}</router-link>
              </li>
            </ul>
          </div>

          <div class="footer-links__group">
            <h4 class="footer-links__title">关于我们</h4>
            <ul class="footer-links__list">
              <li v-for="link in aboutLinks" :key="link.label">
                <a :href="link.href" class="footer-link">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="app-footer__bottom">
        <p class="copyright">&copy; {{ currentYear }} AnimeVideo. All rights reserved.</p>
        <div class="social-links">
          <a href="#" class="social-link" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="#" class="social-link" title="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
          <a href="#" class="social-link" title="Discord">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.app-footer__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-lg);
}

.app-footer__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
}

@media (min-width: 768px) {
  .app-footer__content {
    grid-template-columns: 1.5fr 2fr;
  }
}

.footer-brand {
  max-width: 300px;
}

.footer-brand__title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.footer-brand__desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

@media (max-width: 640px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

.footer-links__title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-link {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-link::before {
  content: '';
  width: 0;
  height: 1px;
  background-color: var(--color-primary);
  transition: width var(--transition-fast);
}

.footer-link:hover::before {
  width: 12px;
}

.app-footer__bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

@media (min-width: 640px) {
  .app-footer__bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

.copyright {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--bg-hover);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.social-link svg {
  width: 18px;
  height: 18px;
}
</style>
