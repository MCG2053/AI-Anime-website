<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const props = defineProps<{
  url: string
  poster?: string
}>()

const emit = defineEmits<{
  (e: 'timeupdate', time: number): void
  (e: 'ended'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'seeking'): void
}>()

const playerContainer = ref<HTMLElement>()
let player: Player | null = null
let videoElement: HTMLVideoElement | null = null

const handleEnterPiP = () => { isPiP.value = true }
const handleLeavePiP = () => { isPiP.value = false }

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const isPiP = ref(false)
const decodeMode = ref<'hardware' | 'software'>('hardware')

const playbackRates = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1.0x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2.0x' }
]

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedDuration = computed(() => formatTime(duration.value))
const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const progressStyle = computed(() => {
  return {
    background: `linear-gradient(to right, var(--color-primary) ${progress.value}%, rgba(255, 255, 255, 0.3) ${progress.value}%)`
  }
})

function initPlayer() {
  if (!playerContainer.value || !props.url) return

  if (player) {
    player.destroy()
    player = null
  }

  nextTick(() => {
    const videoConfig: Record<string, unknown> = {}
    
    if (decodeMode.value === 'hardware') {
      videoConfig['x5-video-player-type'] = 'h5'
      videoConfig['x5-video-player-fullscreen'] = true
    }

    player = new Player({
      el: playerContainer.value,
      url: props.url,
      poster: props.poster,
      width: '100%',
      height: '100%',
      autoplay: false,
      playsinline: true,
      lang: 'zh-cn',
      fluid: true,
      volume: volume.value,
      playbackRate: playbackRates.map(r => r.value),
      defaultPlaybackRate: 1,
      screenShot: true,
      pip: true,
      keyShortcut: true,
      cssFullscreen: true,
      videoConfig,
      closeVideoClick: false,
      closeVideoDblclick: false,
      closeVideoTouch: false,
      whitelist: ['*'],
      ignoreDocClick: true,
      enableContextmenu: true
    })

    player.on('timeupdate', () => {
      if (player) {
        currentTime.value = player.currentTime
        duration.value = player.duration
        emit('timeupdate', player.currentTime)
      }
    })

    player.on('ended', () => {
      isPlaying.value = false
      emit('ended')
    })

    player.on('play', () => {
      isPlaying.value = true
      emit('play')
    })

    player.on('playing', () => {
      isPlaying.value = true
      emit('play')
    })

    player.on('pause', () => {
      isPlaying.value = false
      emit('pause')
    })

    player.on('seeking', () => {
      emit('seeking')
    })

    player.on('volumechange', () => {
      if (player) {
        volume.value = player.volume
        isMuted.value = player.muted
      }
    })

    player.on('fullscreenchange', () => {
      if (player) {
        isFullscreen.value = player.fullscreen
      }
    })

    player.on('pipChange', () => {
      isPiP.value = !isPiP.value
    })

    const videoEl = player.video
    if (videoEl && videoEl instanceof HTMLVideoElement) {
      videoElement = videoEl
      videoEl.addEventListener('enterpictureinpicture', handleEnterPiP)
      videoEl.addEventListener('leavepictureinpicture', handleLeavePiP)
    }

    duration.value = player.duration || 0
  })
}

function togglePlay() {
  if (!player) return
  if (isPlaying.value) {
    player.pause()
  } else {
    player.play()
  }
}

function handleSeek(e: Event) {
  const target = e.target as HTMLInputElement
  const time = parseFloat(target.value)
  if (player && duration.value > 0) {
    const seekTime = (time / 100) * duration.value
    player.currentTime = seekTime
    currentTime.value = seekTime
  }
}

function handleVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement
  const vol = parseFloat(target.value)
  volume.value = vol
  if (player) {
    player.volume = vol
    if (vol > 0) {
      isMuted.value = false
      player.muted = false
    }
  }
}

function toggleMute() {
  if (!player) return
  isMuted.value = !isMuted.value
  player.muted = isMuted.value
}

function setPlaybackRate(rate: number) {
  playbackRate.value = rate
  if (player) {
    player.playbackRate = rate
  }
}

function toggleFullscreen() {
  if (!player) return
  if (isFullscreen.value) {
    player.exitFullscreen()
  } else {
    player.getFullscreen()
  }
}

function togglePiP() {
  if (!player) return
  
  const video = player.video
  if (!video || !(video instanceof HTMLVideoElement)) {
    console.log('Video element not available')
    return
  }

  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().then(() => {
      isPiP.value = false
    }).catch((err) => {
      console.error('Exit PiP failed:', err)
    })
  } else if (document.pictureInPictureEnabled) {
    video.requestPictureInPicture().then(() => {
      isPiP.value = true
    }).catch((err) => {
      console.error('Request PiP failed:', err)
    })
  } else {
    console.log('Picture-in-Picture not supported')
  }
}

function seekForward(seconds: number = 10) {
  if (player) {
    const newTime = Math.min(player.currentTime + seconds, duration.value)
    player.currentTime = newTime
    currentTime.value = newTime
  }
}

function seekBackward(seconds: number = 10) {
  if (player) {
    const newTime = Math.max(player.currentTime - seconds, 0)
    player.currentTime = newTime
    currentTime.value = newTime
  }
}

watch(() => props.url, () => {
  initPlayer()
})

onMounted(() => {
  initPlayer()
})

onUnmounted(() => {
  if (videoElement) {
    videoElement.removeEventListener('enterpictureinpicture', handleEnterPiP)
    videoElement.removeEventListener('leavepictureinpicture', handleLeavePiP)
    videoElement = null
  }
  if (player) {
    player.destroy()
    player = null
  }
})

defineExpose({
  getCurrentTime: () => currentTime.value,
  seek: (time: number) => {
    if (player) {
      player.currentTime = time
      currentTime.value = time
    }
  },
  pause: () => player?.pause(),
  play: () => player?.play(),
  togglePlay,
  toggleFullscreen,
  togglePiP,
  setPlaybackRate,
  seekForward,
  seekBackward
})
</script>

<template>
  <div class="video-player-wrapper">
    <div ref="playerContainer" class="video-player"></div>
    
    <div class="video-controls">
      <div class="video-controls__progress">
        <input
          type="range"
          min="0"
          max="100"
          :value="progress"
          class="progress-slider"
          :style="progressStyle"
          @input="handleSeek"
        />
        <div class="progress-time">
          <span>{{ formattedCurrentTime }}</span>
          <span>/</span>
          <span>{{ formattedDuration }}</span>
        </div>
      </div>

      <div class="video-controls__main">
        <div class="video-controls__left">
          <button class="control-btn" @click="seekBackward(10)" title="后退10秒">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              <text x="12" y="14" text-anchor="middle" font-size="6" fill="currentColor">10</text>
            </svg>
          </button>
          
          <button class="control-btn control-btn--play" @click="togglePlay" :title="isPlaying ? '暂停' : '播放'">
            <svg v-if="isPlaying" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          <button class="control-btn" @click="seekForward(10)" title="前进10秒">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
              <text x="12" y="14" text-anchor="middle" font-size="6" fill="currentColor">10</text>
            </svg>
          </button>

          <div class="volume-control">
            <button class="control-btn" @click="toggleMute" :title="isMuted ? '取消静音' : '静音'">
              <svg v-if="isMuted || volume === 0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="isMuted ? 0 : volume"
              class="volume-slider"
              @input="handleVolumeChange"
            />
          </div>
        </div>

        <div class="video-controls__right">
          <div class="speed-control">
            <button class="control-btn control-btn--text" :title="`播放速度: ${playbackRate}x`">
              {{ playbackRate }}x
            </button>
            <div class="speed-menu">
              <button
                v-for="rate in playbackRates"
                :key="rate.value"
                :class="['speed-option', { 'speed-option--active': playbackRate === rate.value }]"
                @click="setPlaybackRate(rate.value)"
              >
                {{ rate.label }}
              </button>
            </div>
          </div>

          <div class="decode-control">
            <button class="control-btn" title="解码模式">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>
            <div class="decode-menu">
              <button
                :class="['decode-option', { 'decode-option--active': decodeMode === 'hardware' }]"
                @click="decodeMode = 'hardware'"
              >
                硬件解码
              </button>
              <button
                :class="['decode-option', { 'decode-option--active': decodeMode === 'software' }]"
                @click="decodeMode = 'software'"
              >
                软件解码
              </button>
            </div>
          </div>

          <button class="control-btn" @click="togglePiP" title="画中画">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
            </svg>
          </button>

          <button class="control-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
            <svg v-if="isFullscreen" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-player-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.video-player {
  width: 100%;
  height: 100%;
}

.video-player-wrapper :deep(.xgplayer) {
  width: 100% !important;
  height: 100% !important;
}

.video-player-wrapper :deep(.xgplayer-controls) {
  display: none !important;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: var(--spacing-lg) var(--spacing-md) var(--spacing-sm);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.video-player-wrapper:hover .video-controls {
  opacity: 1;
}

.video-controls__progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.progress-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  border-radius: 2px;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  margin-top: -5px;
  transition: transform var(--transition-fast);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.progress-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.progress-slider::-moz-range-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.progress-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.progress-slider::-moz-range-progress {
  background: var(--color-primary);
  height: 4px;
  border-radius: 2px;
}

.progress-time {
  font-size: var(--font-size-xs);
  color: white;
  white-space: nowrap;
}

.progress-time span {
  margin: 0 2px;
}

.video-controls__main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-controls__left,
.video-controls__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.control-btn--play {
  width: 44px;
  height: 44px;
  background: transparent;
  border-radius: 50%;
}

.control-btn--play:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.control-btn--play svg {
  width: 24px;
  height: 24px;
}

.control-btn--text {
  width: auto;
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.volume-slider {
  width: 0;
  opacity: 0;
  transition: all var(--transition-fast);
}

.volume-control:hover .volume-slider {
  width: 80px;
  opacity: 1;
}

.volume-slider {
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.speed-control {
  position: relative;
}

.speed-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  min-width: 80px;
}

.speed-control:hover .speed-menu {
  opacity: 1;
  visibility: visible;
}

.speed-option {
  display: block;
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.speed-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.speed-option--active {
  color: var(--color-primary);
}

.decode-control {
  position: relative;
}

.decode-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  min-width: 100px;
}

.decode-control:hover .decode-menu {
  opacity: 1;
  visibility: visible;
}

.decode-option {
  display: block;
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.decode-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.decode-option--active {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .video-controls {
    padding: var(--spacing-md) var(--spacing-sm) var(--spacing-xs);
  }

  .control-btn {
    width: 32px;
    height: 32px;
  }

  .control-btn svg {
    width: 18px;
    height: 18px;
  }

  .control-btn--play {
    width: 40px;
    height: 40px;
  }

  .control-btn--play svg {
    width: 22px;
    height: 22px;
  }

  .volume-slider {
    width: 60px !important;
  }
}

@media (max-width: 480px) {
  .control-btn--text {
    padding: 0 var(--spacing-xs);
    font-size: var(--font-size-xs);
  }

  .speed-menu {
    min-width: 60px;
  }
}
</style>
