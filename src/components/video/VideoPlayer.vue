<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'

const props = defineProps<{
  url: string
  poster?: string
}>()

const emit = defineEmits<{
  (e: 'timeupdate', time: number): void
  (e: 'ended'): void
}>()

const playerContainer = ref<HTMLElement>()
let player: Player | null = null

function initPlayer() {
  if (!playerContainer.value || !props.url) return

  if (player) {
    player.destroy()
    player = null
  }

  nextTick(() => {
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
      playbackRate: [0.5, 0.75, 1, 1.25, 1.5, 2],
      defaultPlaybackRate: 1,
      screenShot: true,
      pip: true,
      keyShortcut: true,
      cssFullscreen: true
    })

    player.on('timeupdate', () => {
      if (player) {
        emit('timeupdate', player.currentTime)
      }
    })

    player.on('ended', () => {
      emit('ended')
    })
  })
}

watch(() => props.url, () => {
  initPlayer()
})

onMounted(() => {
  initPlayer()
})

onUnmounted(() => {
  if (player) {
    player.destroy()
    player = null
  }
})

function getCurrentTime(): number {
  return player?.currentTime || 0
}

function seek(time: number) {
  if (player) {
    player.currentTime = time
  }
}

function pause() {
  player?.pause()
}

function play() {
  player?.play()
}

defineExpose({
  getCurrentTime,
  seek,
  pause,
  play
})
</script>

<template>
  <div ref="playerContainer" class="video-player w-full aspect-video bg-black rounded-lg overflow-hidden"></div>
</template>
