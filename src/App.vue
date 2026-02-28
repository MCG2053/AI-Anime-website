<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NMessageProvider } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import AppLayout from '@/components/layout/AppLayout.vue'

const themeStore = useThemeStore()
const route = useRoute()

const isScrolling = ref(false)
const scrollbarHeight = ref(0)
const scrollbarTop = ref(0)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const transitionName = computed(() => {
  const path = route.path
  if (path.includes('/video/')) {
    return 'slide-up'
  }
  if (path === '/login' || path === '/register' || path === '/forgot-password') {
    return 'auth'
  }
  return 'fade'
})

function updateScrollbar() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight
  const winHeight = window.innerHeight
  
  const scrollPercent = scrollTop / (docHeight - winHeight)
  const thumbHeight = (winHeight / docHeight) * 100
  
  scrollbarHeight.value = thumbHeight
  scrollbarTop.value = scrollPercent * (100 - thumbHeight)
}

function handleScroll() {
  isScrolling.value = true
  updateScrollbar()
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

onMounted(() => {
  themeStore.initTheme()
  updateScrollbar()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateScrollbar, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateScrollbar)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<template>
  <NMessageProvider>
    <div class="custom-scrollbar" :class="{ 'custom-scrollbar--visible': isScrolling }">
      <div 
        class="custom-scrollbar__thumb"
        :style="{
          height: scrollbarHeight + '%',
          top: scrollbarTop + '%'
        }"
      ></div>
    </div>
    <AppLayout>
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </transition>
      </router-view>
    </AppLayout>
  </NMessageProvider>
</template>

<style scoped>
.custom-scrollbar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  z-index: 9999;
  pointer-events: none;
}

.custom-scrollbar__thumb {
  width: 100%;
  background-color: rgba(128, 128, 128, 0);
  border-radius: 3px;
  position: absolute;
  transition: background-color 0.3s ease, top 0.1s ease;
}

.custom-scrollbar--visible .custom-scrollbar__thumb {
  background-color: rgba(128, 128, 128, 0.5);
}

.custom-scrollbar__thumb:hover {
  background-color: rgba(128, 128, 128, 0.7);
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.auth-enter-active,
.auth-leave-active {
  transition: opacity 0.25s ease;
}

.auth-enter-from,
.auth-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
