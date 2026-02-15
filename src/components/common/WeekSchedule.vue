<template>
  <div class="week-schedule">
    <div class="week-schedule__header">
      <h2 class="week-schedule__title">番剧更新表</h2>
      <div class="week-schedule__nav">
        <div class="week-schedule__nav-inner">
          <button 
            v-for="day in weekDays" 
            :key="day.day"
            :ref="el => { if (el) buttonRefs[day.day] = el as HTMLElement }"
            :class="['week-schedule__day-btn', { 
              'week-schedule__day-btn--active': selectedDay === day.day
            }]"
            @click="selectDay(day.day)"
          >
            <span class="week-schedule__day-name">
              {{ day.dayName }}
              <svg v-if="day.day === todayDay" class="week-schedule__today-star" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </span>
            <span class="week-schedule__day-count" v-if="day.videos.length">{{ day.videos.length }}</span>
          </button>
          <div class="week-schedule__indicator" :style="indicatorStyle"></div>
        </div>
      </div>
    </div>

    <NSpin :show="loading">
      <div class="week-schedule__content">
        <div class="week-schedule__section">
          <div class="week-schedule__section-header">
            <h3 class="week-schedule__section-title">
              {{ currentDay.dayName }}
              <span class="week-schedule__today-badge" v-if="currentDay.day === todayDay">今天</span>
            </h3>
            <span class="week-schedule__section-count">{{ currentDay.videos.length }} 部更新</span>
          </div>

          <div class="week-schedule__grid" v-if="currentDay.videos.length > 0">
            <router-link
              v-for="video in currentDay.videos"
              :key="video.id"
              :to="`/video/${video.id}`"
              class="schedule-card"
            >
              <div class="schedule-card__cover">
                <img :src="video.cover" :alt="video.title" loading="lazy" />
                <div class="schedule-card__episode" v-if="video.currentEpisode">
                  第{{ video.currentEpisode }}集
                </div>
              </div>
              <div class="schedule-card__info">
                <h4 class="schedule-card__title line-clamp-2">{{ video.title }}</h4>
                <div class="schedule-card__meta">
                  <span class="schedule-card__time" v-if="video.updateTime">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    {{ video.updateTime }}
                  </span>
                </div>
              </div>
            </router-link>
          </div>

          <div class="week-schedule__empty" v-else>
            <svg viewBox="0 0 24 24" fill="currentColor" class="week-schedule__empty-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>暂无更新</p>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { NSpin } from 'naive-ui'
import type { WeekSchedule } from '@/stores/video'

const props = defineProps<{
  schedule: WeekSchedule[]
  loading?: boolean
}>()

const selectedDay = ref('')
const buttonRefs = ref<Record<string, HTMLElement>>({})
const indicatorStyle = ref({ left: '0px', width: '0px' })

const weekDays = computed(() => {
  const order = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  return order.map(day => {
    const found = props.schedule.find(s => s.day === day)
    return {
      day,
      dayName: getDayName(day),
      videos: found?.videos || []
    }
  })
})

const todayDay = computed(() => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
})

const currentDay = computed(() => {
  return weekDays.value.find(d => d.day === selectedDay.value) || weekDays.value[0]
})

function getDayName(day: string): string {
  const dayNames: Record<string, string> = {
    monday: '周一',
    tuesday: '周二',
    wednesday: '周三',
    thursday: '周四',
    friday: '周五',
    saturday: '周六',
    sunday: '周日'
  }
  return dayNames[day] || day
}

function updateIndicator() {
  nextTick(() => {
    const activeBtn = buttonRefs.value[selectedDay.value]
    if (activeBtn) {
      indicatorStyle.value = {
        left: `${activeBtn.offsetLeft}px`,
        width: `${activeBtn.offsetWidth}px`
      }
    }
  })
}

function selectDay(day: string) {
  selectedDay.value = day
  updateIndicator()
}

watch(selectedDay, updateIndicator)

onMounted(() => {
  selectedDay.value = todayDay.value
  updateIndicator()
})
</script>

<style scoped>
.week-schedule {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.week-schedule__header {
  padding: var(--spacing-lg);
  border-bottom: 2px solid var(--border-strong);
}

.week-schedule__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-md);
}

.week-schedule__nav {
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.week-schedule__nav::-webkit-scrollbar {
  display: none;
}

.week-schedule__nav-inner {
  display: flex;
  gap: var(--spacing-xs);
  position: relative;
}

.week-schedule__day-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-secondary);
  background-color: transparent;
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
  position: relative;
}

.week-schedule__day-btn:hover {
  color: var(--text-color);
}

.week-schedule__day-btn--active {
  color: var(--color-primary);
}

.week-schedule__day-name {
  display: flex;
  align-items: center;
  gap: 4px;
}

.week-schedule__today-star {
  width: 14px;
  height: 14px;
  color: #fbbf24;
}

.week-schedule__day-count {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 20px;
  text-align: center;
}

.week-schedule__day-btn--active .week-schedule__day-count {
  background-color: var(--color-primary);
  color: white;
}

.week-schedule__indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
}

.week-schedule__content {
  padding: var(--spacing-md);
}

.week-schedule__section {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background-color: var(--bg-secondary);
}

.week-schedule__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--border-strong);
}

.week-schedule__section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.week-schedule__today-badge {
  background-color: #fbbf24;
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.week-schedule__section-count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.week-schedule__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.schedule-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-md);
  background-color: var(--bg-card);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.schedule-card__cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.schedule-card__cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.schedule-card:hover .schedule-card__cover img {
  transform: scale(1.05);
}

.schedule-card__episode {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.schedule-card__info {
  padding: var(--spacing-sm);
}

.schedule-card__title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
  line-height: 1.4;
}

.schedule-card__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.schedule-card__time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.schedule-card__time svg {
  width: 12px;
  height: 12px;
}

.week-schedule__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-muted);
}

.week-schedule__empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-sm);
  opacity: 0.5;
}

@media (max-width: 768px) {
  .week-schedule__header {
    padding: var(--spacing-md);
  }

  .week-schedule__grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-sm);
  }

  .week-schedule__day-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }
}
</style>
