<template>
  <div class="category-tabs">
    <div class="category-tabs__container">
      <div class="category-tabs__list" ref="tabsList">
        <button
          v-for="category in categories"
          :key="category.slug"
          :ref="el => { if (el) tabRefs[category.slug] = el as HTMLElement }"
          :class="['category-tabs__item', { 'category-tabs__item--active': modelValue === category.slug }]"
          @click="handleClick(category.slug)"
        >
          <span class="category-tabs__icon" v-if="category.icon">
            <component :is="getIcon(category.icon)" />
          </span>
          <span class="category-tabs__label">{{ category.name }}</span>
        </button>
        <div 
          class="category-tabs__indicator" 
          :style="indicatorStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, h } from 'vue'
import type { Category } from '@/types'

const props = defineProps<{
  categories: Category[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const tabsList = ref<HTMLElement | null>(null)
const tabRefs = ref<Record<string, HTMLElement>>({})
const indicatorStyle = ref({ left: '0px', width: '0px' })

const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    home: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' })
      ])
    },
    play: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M8 5v14l11-7z' })
      ])
    },
    star: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })
      ])
    },
    film: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z' })
      ])
    },
    calendar: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z' })
      ])
    },
    disc: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' }, [
        h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z' })
      ])
    }
  }
  return icons[iconName] || null
}

const updateIndicator = () => {
  nextTick(() => {
    const activeTab = tabRefs.value[props.modelValue]
    if (activeTab && tabsList.value) {
      const listRect = tabsList.value.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()
      const labelEl = activeTab.querySelector('.category-tabs__label')
      if (labelEl) {
        const labelRect = labelEl.getBoundingClientRect()
        const labelCenter = labelRect.left + labelRect.width / 2
        indicatorStyle.value = {
          left: `${labelCenter - listRect.left - labelRect.width / 2}px`,
          width: `${labelRect.width}px`
        }
      } else {
        indicatorStyle.value = {
          left: `${tabRect.left - listRect.left}px`,
          width: `${tabRect.width}px`
        }
      }
    }
  })
}

const handleClick = (slug: string) => {
  if (slug !== props.modelValue) {
    emit('update:modelValue', slug)
    emit('change', slug)
  }
}

watch(() => props.modelValue, updateIndicator)
onMounted(updateIndicator)

defineExpose({ updateIndicator })
</script>

<style scoped>
.category-tabs {
  background-color: var(--bg-secondary);
  border-bottom: 2px solid var(--border-strong);
  position: relative;
}

.category-tabs__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.category-tabs__list {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) 0;
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-tabs__list::-webkit-scrollbar {
  display: none;
}

.category-tabs__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  position: relative;
  z-index: 1;
}

.category-tabs__item:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.category-tabs__item--active {
  color: var(--color-primary);
}

.category-tabs__icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-tabs__icon svg {
  width: 100%;
  height: 100%;
}

.category-tabs__label {
  line-height: 1;
}

.category-tabs__indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  z-index: 2;
}

@media (max-width: 640px) {
  .category-tabs__item {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .category-tabs__icon {
    width: 14px;
    height: 14px;
  }
}
</style>
