<template>
  <button
    :class="['action-btn', `action-btn--${type}`, { 'action-btn--active': active, 'action-btn--animated': animated }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="action-btn__icon">
      <svg v-if="type === 'like'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      <svg v-else-if="type === 'collect'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
      <svg v-else-if="type === 'share'" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    </span>
    <span v-if="count !== undefined" class="action-btn__count">{{ formattedCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type ActionType = 'like' | 'collect' | 'share' | 'default'

const props = withDefaults(defineProps<{
  type?: ActionType
  active?: boolean
  count?: number
  disabled?: boolean
}>(), {
  type: 'default',
  active: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const animated = ref(false)

const formattedCount = computed(() => {
  if (props.count === undefined) return ''
  if (props.count >= 10000) {
    return `${(props.count / 10000).toFixed(1)}万`
  }
  return props.count.toString()
})

const handleClick = () => {
  if (props.disabled) return
  
  if (props.type === 'like' || props.type === 'collect') {
    animated.value = true
    setTimeout(() => {
      animated.value = false
    }, 600)
  }
  
  emit('click')
}
</script>

<style scoped>
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: 1px solid transparent;
}

.action-btn:hover:not(:disabled) {
  background-color: var(--bg-hover);
  color: var(--text-color);
}

.action-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn__icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.action-btn__icon svg {
  width: 100%;
  height: 100%;
}

.action-btn--like.action-btn--active {
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--color-like);
  border-color: rgba(236, 72, 153, 0.2);
}

.action-btn--like.action-btn--active:hover {
  background-color: rgba(236, 72, 153, 0.15);
}

.action-btn--like.action-btn--animated .action-btn__icon {
  animation: heartBeat 0.6s ease-in-out;
}

.action-btn--collect.action-btn--active {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-collect);
  border-color: rgba(245, 158, 11, 0.2);
}

.action-btn--collect.action-btn--active:hover {
  background-color: rgba(245, 158, 11, 0.15);
}

.action-btn--collect.action-btn--animated .action-btn__icon {
  animation: bounce 0.5s ease-in-out;
}

.action-btn__count {
  min-width: 20px;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.3);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-4px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-2px);
  }
}
</style>
