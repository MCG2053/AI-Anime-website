<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'

interface DanmakuItem {
  text: string
  time: number
  color: string
  type: 'scroll' | 'top' | 'bottom'
}

const LOCAL_FALLBACK_VIDEO = `${import.meta.env.BASE_URL}test-video.mp4`

const props = defineProps<{
  url: string
  poster?: string
  danmaku?: DanmakuItem[]
  fallbackUrl?: string
}>()

const effectiveUrl = computed(() => props.url || LOCAL_FALLBACK_VIDEO)
const isUsingFallback = ref(false)
const loadError = ref<string | null>(null)

const emit = defineEmits<{
  (e: 'timeupdate', time: number): void
  (e: 'ended'): void
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'seeking'): void
}>()

const playerContainer = ref<HTMLDivElement>()
let player: Artplayer | null = null
let danmakuPluginInstance: any = null

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.8)
const isMuted = ref(false)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const isPiP = ref(false)
const showDanmaku = ref(true)
const isMobile = ref(false)
const isPortrait = ref(false)

function checkDeviceAndOrientation() {
  const ua = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'windows phone']
  isMobile.value = mobileKeywords.some(keyword => ua.includes(keyword)) || window.innerWidth <= 768
  isPortrait.value = window.innerHeight > window.innerWidth
  updatePlayerControls()
}

function updatePlayerControls() {
  if (!player || !isMobile.value) return
  
  const controls = playerContainer.value?.querySelector('.art-controls')
  if (!controls) return
  
  if (isPortrait.value && !isFullscreen.value) {
    controls.classList.add('art-controls--mobile-portrait')
  } else {
    controls.classList.remove('art-controls--mobile-portrait')
  }
}

function handleVideoError(error: Error) {
  console.error('Video load error:', error)
  loadError.value = error.message || 'Video load failed'
  
  if (!isUsingFallback.value) {
    const fallbackSrc = props.fallbackUrl || LOCAL_FALLBACK_VIDEO
    if (effectiveUrl.value !== fallbackSrc) {
      console.log('Attempting to load fallback video:', fallbackSrc)
      isUsingFallback.value = true
      if (player) {
        player.url = fallbackSrc
      }
    }
  }
}

function initPlayer() {
  if (!playerContainer.value) return

  const videoUrl = effectiveUrl.value
  if (!videoUrl) {
    loadError.value = 'No video URL provided'
    return
  }

  if (player) {
    player.destroy()
    player = null
    danmakuPluginInstance = null
  }

  loadError.value = null
  isUsingFallback.value = videoUrl === (props.fallbackUrl || LOCAL_FALLBACK_VIDEO)

  nextTick(() => {
    const danmakuPlugin = artplayerPluginDanmuku({
      danmuku: props.danmaku || [],
      speed: 5,
      opacity: 1,
      color: '#FFFFFF',
      mode: 0,
      margin: [10, '25%'],
      antiOverlap: true,
      synchronousPlayback: true,
      filter: (danmu: { text: string }) => danmu.text.length <= 100,
      beforeEmit: (danmu: { text: string }) => {
        if (danmu.text.length > 100) {
          return false
        }
        return true
      }
    })

    player = new Artplayer({
      container: playerContainer.value!,
      url: videoUrl,
      poster: props.poster,
      autoplay: false,
      pip: true,
      autoSize: false,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#23ade5',
      lang: navigator.language.toLowerCase(),
      moreVideoAttr: {
        crossOrigin: 'anonymous'
      },
      settings: [
        {
          html: 'Danmaku',
          tooltip: showDanmaku.value ? 'Show' : 'Hide',
          switch: showDanmaku.value,
          onSwitch: function (item) {
            showDanmaku.value = !item.switch
            item.switch = !item.switch
            item.tooltip = item.switch ? 'Show' : 'Hide'
            if (danmakuPluginInstance && danmakuPluginInstance.config) {
              danmakuPluginInstance.config({
                danmuku: item.switch
              })
            }
            return item.switch
          }
        }
      ],
      plugins: [danmakuPlugin]
    })

    danmakuPluginInstance = player.plugins.artplayerPluginDanmuku

    player.on('video:timeupdate', () => {
      if (player) {
        currentTime.value = player.currentTime
        duration.value = player.duration
        emit('timeupdate', player.currentTime)
      }
    })

    player.on('video:ended', () => {
      isPlaying.value = false
      emit('ended')
    })

    player.on('video:play', () => {
      isPlaying.value = true
      emit('play')
    })

    player.on('video:playing', () => {
      isPlaying.value = true
      emit('play')
    })

    player.on('video:pause', () => {
      isPlaying.value = false
      emit('pause')
    })

    player.on('video:seeking', () => {
      emit('seeking')
    })

    player.on('video:volumechange', () => {
      if (player) {
        volume.value = player.volume
        isMuted.value = player.muted
      }
    })

    player.on('video:ratechange', () => {
      if (player) {
        playbackRate.value = player.playbackRate
      }
    })

    player.on('fullscreen', (state: boolean) => {
      isFullscreen.value = state
      updatePlayerControls()
    })

    player.on('pip', (state: boolean) => {
      isPiP.value = state
    })

    player.on('video:error', (error: any) => {
      handleVideoError(error)
    })

    player.on('error', (error: any) => {
      handleVideoError(error)
    })

    duration.value = player.duration || 0
  })
}

function togglePlay() {
  if (!player) return
  player.toggle()
}

function setPlaybackRate(rate: number) {
  playbackRate.value = rate
  if (player) {
    player.playbackRate = rate
  }
}

function toggleFullscreen() {
  if (!player) return
  player.fullscreen = !player.fullscreen
}

function togglePiP() {
  if (!player) return
  player.pip = !player.pip
}

function seekForward(seconds: number = 10) {
  if (player) {
    const newTime = Math.min(player.currentTime + seconds, duration.value)
    player.seek = newTime
    currentTime.value = newTime
  }
}

function seekBackward(seconds: number = 10) {
  if (player) {
    const newTime = Math.max(player.currentTime - seconds, 0)
    player.seek = newTime
    currentTime.value = newTime
  }
}

function sendDanmaku(text: string, color: string = '#FFFFFF', type: 'scroll' | 'top' | 'bottom' = 'scroll') {
  if (danmakuPluginInstance && danmakuPluginInstance.emit) {
    danmakuPluginInstance.emit({
      text,
      color,
      type
    })
  }
}

watch(effectiveUrl, () => {
  initPlayer()
})

watch(() => props.danmaku, (newDanmaku) => {
  if (danmakuPluginInstance && danmakuPluginInstance.config && newDanmaku) {
    danmakuPluginInstance.config({
      danmuku: newDanmaku
    })
  }
}, { deep: true })

onMounted(() => {
  checkDeviceAndOrientation()
  window.addEventListener('resize', checkDeviceAndOrientation)
  window.addEventListener('orientationchange', checkDeviceAndOrientation)
  initPlayer()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDeviceAndOrientation)
  window.removeEventListener('orientationchange', checkDeviceAndOrientation)
  if (player) {
    player.destroy()
    player = null
    danmakuPluginInstance = null
  }
})

defineExpose({
  getCurrentTime: () => currentTime.value,
  seek: (time: number) => {
    if (player) {
      player.seek = time
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
  seekBackward,
  sendDanmaku
})
</script>

<template>
  <div class="video-player-wrapper">
    <div ref="playerContainer" class="video-player"></div>
    <div v-if="isUsingFallback" class="fallback-indicator">
      <span class="fallback-badge">Local Test Video</span>
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

.fallback-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  pointer-events: none;
}

.fallback-badge {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: rgba(236, 72, 153, 0.9);
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.video-player-wrapper :deep(.artplayer) {
  width: 100% !important;
  height: 100% !important;
}

.video-player-wrapper :deep(.artplayer-video-player) {
  width: 100%;
  height: 100%;
}

.video-player-wrapper :deep(.artplayer-danmuku) {
  pointer-events: none;
}

.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-volume,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-setting,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-pip,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-screenshot,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-playbackRate,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-flip,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-aspectRatio,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-fullscreenWeb,
.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-subtitleOffset {
  display: none !important;
}

.video-player-wrapper :deep(.art-controls--mobile-portrait) {
  padding: 0 8px;
}

.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-control-progress {
  flex: 1;
}

.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-controls-right {
  gap: 4px;
}

.video-player-wrapper :deep(.art-controls--mobile-portrait) .art-icon {
  font-size: 18px !important;
}

@media (max-width: 768px) {
  .video-player-wrapper {
    border-radius: 0;
  }
}
</style>
