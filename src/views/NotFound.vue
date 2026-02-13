<script setup lang="ts">
</script>

<template>
  <div class="not-found-page min-h-[60vh] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary-500 mb-4">404</h1>
      <p class="text-xl text-[var(--text-secondary)] mb-6">页面不存在</p>
      <router-link
        to="/"
        class="btn btn-primary"
      >
        返回首页
      </router-link>
    </div>
  </div>
</template>
