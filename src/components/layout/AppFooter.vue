<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer bg-[var(--bg-secondary)] border-t border-[var(--border-color)] py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-bold text-primary-500 mb-4">Anime Video</h3>
          <p class="text-sm text-[var(--text-secondary)]">
            专注于动漫视频播放的平台，提供高清流畅的观看体验。
          </p>
        </div>

        <div>
          <h4 class="font-medium text-[var(--text-color)] mb-3">快速导航</h4>
          <ul class="space-y-2 text-sm text-[var(--text-secondary)]">
            <li><router-link to="/" class="hover:text-primary-500">首页</router-link></li>
            <li><router-link to="/search" class="hover:text-primary-500">搜索</router-link></li>
            <li><router-link to="/user" class="hover:text-primary-500">个人中心</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-[var(--text-color)] mb-3">热门分类</h4>
          <ul class="space-y-2 text-sm text-[var(--text-secondary)]">
            <li><router-link to="/?category=anime" class="hover:text-primary-500">番剧</router-link></li>
            <li><router-link to="/?category=chinese" class="hover:text-primary-500">国创</router-link></li>
            <li><router-link to="/?category=movie" class="hover:text-primary-500">剧场版</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium text-[var(--text-color)] mb-3">关于我们</h4>
          <ul class="space-y-2 text-sm text-[var(--text-secondary)]">
            <li><a href="#" class="hover:text-primary-500">关于平台</a></li>
            <li><a href="#" class="hover:text-primary-500">联系方式</a></li>
            <li><a href="#" class="hover:text-primary-500">帮助中心</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-muted)]">
        <p>&copy; {{ currentYear }} Anime Video. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
