<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NSpace, useMessage } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { mockLoginResponse } from '@/services/mock'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const formValue = ref({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6个字符', trigger: 'blur' }
  ]
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))

    userStore.login(mockLoginResponse.token, mockLoginResponse.user)
    message.success('登录成功')

    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch {
    message.error('登录失败，请检查输入')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page min-h-screen flex items-center justify-center bg-[var(--bg-secondary)] px-4">
    <NCard class="w-full max-w-md" :bordered="false">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-primary-500 mb-2">Anime Video</h1>
          <p class="text-sm text-[var(--text-muted)]">登录您的账户</p>
        </div>
      </template>

      <NForm
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
      >
        <NFormItem label="邮箱" path="email">
          <NInput
            v-model:value="formValue.email"
            placeholder="请输入邮箱"
            type="email"
          />
        </NFormItem>
        <NFormItem label="密码" path="password">
          <NInput
            v-model:value="formValue.password"
            placeholder="请输入密码"
            type="password"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem :show-label="false">
          <NButton
            type="primary"
            block
            :loading="loading"
            @click="handleSubmit"
          >
            登录
          </NButton>
        </NFormItem>
      </NForm>

      <template #footer>
        <div class="text-center text-sm text-[var(--text-muted)]">
          <p>测试账户: user@example.com / 任意密码</p>
        </div>
      </template>
    </NCard>
  </div>
</template>
