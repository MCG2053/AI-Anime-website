<script setup lang="ts">
import { computed } from 'vue'
import type { Video } from '@/types'

const props = defineProps<{
  video: Video
}>()

const formattedPlayCount = computed(() => {
  const count = props.video.playCount
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
})
</script>

<template>
  <router-link
    :to="`/video/${video.id}`"
    class="video-card card card-hover block"
  >
    <div class="relative aspect-[3/4] overflow-hidden">
      <img
        :src="video.cover"
        :alt="video.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <span class="text-xs text-white bg-primary-500 px-2 py-0.5 rounded">
          {{ video.episode }}
        </span>
      </div>
    </div>
    <div class="p-3">
      <h3 class="font-medium text-sm text-[var(--text-color)] line-clamp-2 mb-2">
        {{ video.title }}
      </h3>
      <div class="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          {{ formattedPlayCount }}
        </span>
        <span>{{ video.year }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.video-card {
  background-color: var(--bg-card);
}
</style>
