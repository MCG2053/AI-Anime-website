<script setup lang="ts">
import { ref } from 'vue'
import { NInput, NButton, NColorPicker, NSelect } from 'naive-ui'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  currentTime: number
}>()

const emit = defineEmits<{
  (e: 'send', danmaku: { content: string; color: string; type: string }): void
}>()

const userStore = useUserStore()

const danmakuContent = ref('')
const danmakuColor = ref('#ffffff')
const danmakuType = ref('scroll')

const typeOptions = [
  { label: '滚动弹幕', value: 'scroll' },
  { label: '顶部弹幕', value: 'top' },
  { label: '底部弹幕', value: 'bottom' }
]

const presetColors = [
  '#ffffff',
  '#ff6b6b',
  '#4ecdc4',
  '#ffe66d',
  '#95e1d3',
  '#a8e6cf',
  '#dfe6e9',
  '#74b9ff'
]

function sendDanmaku() {
  if (!danmakuContent.value.trim()) return

  emit('send', {
    content: danmakuContent.value.trim(),
    color: danmakuColor.value,
    type: danmakuType.value
  })

  danmakuContent.value = ''
}
</script>

<template>
  <div class="danmaku-sender p-4 bg-[var(--bg-secondary)] rounded-lg">
    <div class="flex items-center gap-3">
      <NInput
        v-model:value="danmakuContent"
        placeholder="发送弹幕..."
        :disabled="!userStore.isLoggedIn"
        @keyup.enter="sendDanmaku"
        class="flex-1"
      />
      <NColorPicker
        v-model:value="danmakuColor"
        :swatches="presetColors"
        size="small"
        :show-alpha="false"
      />
      <NSelect
        v-model:value="danmakuType"
        :options="typeOptions"
        size="small"
        style="width: 120px"
      />
      <NButton
        type="primary"
        :disabled="!userStore.isLoggedIn || !danmakuContent.trim()"
        @click="sendDanmaku"
      >
        发送
      </NButton>
    </div>
    <p v-if="!userStore.isLoggedIn" class="text-xs text-[var(--text-muted)] mt-2">
      请先登录后再发送弹幕
    </p>
  </div>
</template>
