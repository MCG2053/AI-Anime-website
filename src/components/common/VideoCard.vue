<template>
  <router-link 
    :to="`/bangumi/${video.id}`" 
    class="video-card"
    :style="cardStyle"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="video-card__cover">
      <img
        :src="video.cover"
        :alt="video.title"
        class="video-card__image"
        loading="lazy"
      />
      <div class="video-card__overlay">
        <div class="video-card__play">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div v-if="video.updateInfo" class="video-card__badge">
        {{ video.updateInfo }}
      </div>
      <div class="video-card__duration" v-if="video.duration">
        {{ formatDuration(video.duration) }}
      </div>
    </div>
    <div class="video-card__content">
      <h3 class="video-card__title" :title="video.title">
        {{ video.title }}
      </h3>
      <div class="video-card__meta">
        <span class="video-card__views">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          {{ formatViews(video.views) }}
        </span>
        <span class="video-card__year">{{ video.year }}</span>
      </div>
      <div v-if="video.tags && video.tags.length" class="video-card__tags">
        <span v-for="tag in video.tags.slice(0, 2)" :key="tag" class="tag tag-primary">
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Video } from '@/types'

defineProps<{
  video: Video
}>()

const isHovering = ref(false)
const rotateX = ref(0)
const rotateY = ref(0)

const cardStyle = computed(() => ({
  transform: isHovering.value 
    ? `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(1.02)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
  transition: isHovering.value ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
}))

function handleMouseMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  if (!target) return
  
  isHovering.value = true
  const rect = target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  rotateX.value = Math.round((y - centerY) / centerY * -12)
  rotateY.value = Math.round((x - centerX) / centerX * 12)
}

function handleMouseLeave() {
  isHovering.value = false
  rotateX.value = 0
  rotateY.value = 0
}

const formatViews = (views?: number): string => {
  if (!views) return '0'
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`
  }
  return views.toString()
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.video-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--bg-card);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
  transform-style: preserve-3d;
  will-change: transform;
}

.dark .video-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.video-card__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.video-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.video-card:hover .video-card__image {
  transform: scale(1.05);
}

.video-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  opacity: 0;
  transition: opacity var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-card:hover .video-card__overlay {
  opacity: 1;
}

.video-card__play {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  transform: scale(0.8);
  opacity: 0;
  transition: all var(--transition-normal);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.video-card:hover .video-card__play {
  transform: scale(1);
  opacity: 1;
}

.video-card__play svg {
  margin-left: 4px;
}

.video-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  padding: 2px 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.video-card__duration {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
}

.video-card__content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.video-card__title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.video-card:hover .video-card__title {
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.video-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  min-height: 20px;
  transition: color var(--transition-fast);
}

.video-card__views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-card__views svg {
  opacity: 0.6;
}

.video-card__tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  min-height: 22px;
  margin-top: auto;
}

.video-card__tags .tag {
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 2px 8px;
  background: transparent;
  color: var(--text-secondary);
  -webkit-text-fill-color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.video-card:hover .video-card__tags .tag {
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
