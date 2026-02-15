<script setup lang="ts">
defineProps<{
  modelValue: 'grid' | 'list'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: 'grid' | 'list']
}>()
</script>

<template>
  <div class="view-toggle">
    <button
      :class="['view-toggle__btn', { 'view-toggle__btn--active': modelValue === 'grid' }]"
      @click="emit('update:modelValue', 'grid')"
      title="卡片视图"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h8v8h-8v-8zm2 2v4h4v-4h-4z"/>
      </svg>
    </button>
    <button
      :class="['view-toggle__btn', { 'view-toggle__btn--active': modelValue === 'list' }]"
      @click="emit('update:modelValue', 'list')"
      title="列表视图"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  padding: 4px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.view-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background-color: transparent;
  transition: all var(--transition-fast);
}

.view-toggle__btn:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.view-toggle__btn--active {
  color: var(--color-primary);
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
}
</style>
