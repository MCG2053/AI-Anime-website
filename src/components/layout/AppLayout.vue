<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const route = useRoute()

const authPages = ['Login', 'Register', 'ForgotPassword', 'Terms', 'Privacy']
const showHeader = computed(() => !authPages.includes(route.name as string))
const showFooter = computed(() => !authPages.includes(route.name as string))
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
