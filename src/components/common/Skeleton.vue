<template>
  <div class="skeleton-wrapper">
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton-card__content">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text" style="width: 80%"></div>
        <div class="skeleton-card__meta">
          <div class="skeleton skeleton-text" style="width: 60px"></div>
          <div class="skeleton skeleton-text" style="width: 40px"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'text'" class="skeleton-text-group">
      <div v-for="i in rows" :key="i" class="skeleton skeleton-text" :style="{ width: `${100 - (i - 1) * 15}%` }"></div>
    </div>

    <div v-else-if="type === 'avatar'" class="skeleton skeleton-avatar"></div>

    <div v-else-if="type === 'image'" class="skeleton skeleton-image" :style="{ aspectRatio }"></div>

    <div v-else-if="type === 'video-detail'" class="skeleton-video-detail">
      <div class="skeleton-video-detail__player skeleton"></div>
      <div class="skeleton-video-detail__info">
        <div class="skeleton skeleton-title" style="width: 70%"></div>
        <div class="skeleton skeleton-text" style="width: 50%"></div>
        <div class="skeleton-video-detail__meta">
          <div class="skeleton skeleton-text" style="width: 80px"></div>
          <div class="skeleton skeleton-text" style="width: 80px"></div>
          <div class="skeleton skeleton-text" style="width: 80px"></div>
        </div>
        <div class="skeleton-text-group">
          <div class="skeleton skeleton-text" style="width: 100%"></div>
          <div class="skeleton skeleton-text" style="width: 90%"></div>
          <div class="skeleton skeleton-text" style="width: 75%"></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'comment'" class="skeleton-comment">
      <div class="skeleton skeleton-avatar"></div>
      <div class="skeleton-comment__content">
        <div class="skeleton skeleton-text" style="width: 100px"></div>
        <div class="skeleton skeleton-text" style="width: 100%"></div>
        <div class="skeleton skeleton-text" style="width: 80%"></div>
      </div>
    </div>

    <div v-else class="skeleton" :style="{ width, height }"></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'card' | 'text' | 'avatar' | 'image' | 'video-detail' | 'comment' | 'custom'
  rows?: number
  width?: string
  height?: string
  aspectRatio?: string
}>(), {
  type: 'custom',
  rows: 3,
  width: '100%',
  height: '20px',
  aspectRatio: '16/9'
})
</script>

<style scoped>
.skeleton-wrapper {
  width: 100%;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-hover) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-lg);
}

.skeleton-text {
  height: 14px;
  border-radius: var(--radius-sm);
}

.skeleton-title {
  height: 20px;
  border-radius: var(--radius-sm);
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--bg-card);
  box-shadow: var(--shadow-card);
}

.skeleton-card__content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-card__meta {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-xs);
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-video-detail {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.skeleton-video-detail__player {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
}

.skeleton-video-detail__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton-video-detail__meta {
  display: flex;
  gap: var(--spacing-md);
}

.skeleton-comment {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
}

.skeleton-comment__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
