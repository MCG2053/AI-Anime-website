<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const route = useRoute()

const showHeader = computed(() => route.name !== 'Login')
const showFooter = computed(() => route.name !== 'Login')
</script>

<template>
  <div class="app-layout min-h-screen flex flex-col bg-[var(--bg-color)]">
    <AppHeader v-if="showHeader" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>
