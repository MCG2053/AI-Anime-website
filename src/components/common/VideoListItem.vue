<script setup lang="ts">
import type { Video } from '@/types'

defineProps<{
  video: Video
}>()

const formatViews = (views?: number): string => {
  if (!views) return '0'
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`
  }
  return views.toString()
}
</script>

<template>
  <router-link :to="`/bangumi/${video.id}`" class="video-list-item">
    <div class="video-list-item__cover">
      <img
        :src="video.cover"
        :alt="video.title"
        class="video-list-item__image"
        loading="lazy"
      />
      <div v-if="video.updateInfo" class="video-list-item__badge">
        {{ video.updateInfo }}
      </div>
    </div>
    <div class="video-list-item__content">
      <div class="video-list-item__top">
        <h3 class="video-list-item__title">{{ video.title }}</h3>
        <div class="video-list-item__meta">
          <span class="video-list-item__info">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            {{ formatViews(video.views) }}
          </span>
          <span class="video-list-item__year">{{ video.year }}</span>
          <span class="video-list-item__country">{{ video.country }}</span>
        </div>
        <div class="video-list-item__tags">
          <span v-for="tag in video.tags?.slice(0, 4)" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="video-list-item__bottom">
        <p class="video-list-item__description">{{ video.description }}</p>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.video-list-item {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.video-list-item:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateX(4px);
}

.video-list-item__cover {
  position: relative;
  flex-shrink: 0;
  width: 200px;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.video-list-item__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.video-list-item:hover .video-list-item__image {
  transform: scale(1.05);
}

.video-list-item__badge {
  position: absolute;
  top: var(--spacing-xs);
  left: var(--spacing-xs);
  padding: 2px 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
}

.video-list-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 0;
}

.video-list-item__top {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.video-list-item__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  line-height: 1.4;
  transition: color var(--transition-fast);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-list-item:hover .video-list-item__title {
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.video-list-item__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.video-list-item__info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-list-item__info svg {
  opacity: 0.6;
}

.video-list-item__tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.video-list-item__tags .tag {
  padding: 2px 10px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.video-list-item:hover .video-list-item__tags .tag {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  color: var(--color-primary);
}

.video-list-item__bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.video-list-item__description {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .video-list-item {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .video-list-item__cover {
    width: 100%;
  }

  .video-list-item__description {
    -webkit-line-clamp: 3;
  }
}
</style>
