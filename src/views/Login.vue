<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { mockLoginResponse } from '@/services/mock'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const showPassword = ref(false)
const formValue = ref({
  email: '',
  password: ''
})

const emailError = ref('')
const passwordError = ref('')

const isEmailValid = computed(() => {
  if (!formValue.value.email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(formValue.value.email)
})

const isPasswordValid = computed(() => {
  return formValue.value.password.length >= 6
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

function validateEmail() {
  if (!formValue.value.email) {
    emailError.value = '请输入邮箱'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formValue.value.email)) {
    emailError.value = '请输入有效的邮箱地址'
    return false
  }
  emailError.value = ''
  return true
}

function validatePassword() {
  if (!formValue.value.password) {
    passwordError.value = '请输入密码'
    return false
  }
  if (formValue.value.password.length < 6) {
    passwordError.value = '密码至少6个字符'
    return false
  }
  passwordError.value = ''
  return true
}

async function handleSubmit() {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  
  if (!emailValid || !passwordValid) return
  
  try {
    await formRef.value?.validate()
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 1000))

    userStore.login(mockLoginResponse.token, mockLoginResponse.user)
    
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch {
    passwordError.value = '登录失败，请检查输入'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__background">
      <div class="login-page__gradient"></div>
    </div>
    
    <div class="login-page__content">
      <div class="login-card">
        <div class="login-card__header">
          <div class="login-card__logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 class="login-card__title">Anime Video</h1>
          <p class="login-card__subtitle">登录您的账户</p>
        </div>

        <NForm
          ref="formRef"
          :model="formValue"
          :rules="rules"
          class="login-card__form"
        >
          <NFormItem path="email" :show-label="false">
            <div class="input-wrapper" :class="{ 'input-wrapper--error': emailError, 'input-wrapper--success': isEmailValid && !emailError }">
              <span class="input-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <NInput
                v-model:value="formValue.email"
                placeholder="请输入邮箱"
                type="email"
                :bordered="false"
                size="large"
                @blur="validateEmail"
                @input="emailError = ''"
              />
              <span v-if="isEmailValid && !emailError" class="input-status input-status--success">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </span>
            </div>
            <Transition name="error">
              <p v-if="emailError" class="input-error">{{ emailError }}</p>
            </Transition>
          </NFormItem>

          <NFormItem path="password" :show-label="false">
            <div class="input-wrapper" :class="{ 'input-wrapper--error': passwordError, 'input-wrapper--success': isPasswordValid && !passwordError }">
              <span class="input-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <NInput
                v-model:value="formValue.password"
                placeholder="请输入密码"
                :type="showPassword ? 'text' : 'password'"
                :bordered="false"
                size="large"
                @blur="validatePassword"
                @input="passwordError = ''"
                @keyup.enter="handleSubmit"
              />
              <button type="button" class="input-toggle" @click="showPassword = !showPassword">
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <Transition name="error">
              <p v-if="passwordError" class="input-error">{{ passwordError }}</p>
            </Transition>
          </NFormItem>

          <NFormItem :show-label="false">
            <button
              type="button"
              class="login-btn"
              :class="{ 'login-btn--loading': loading }"
              :disabled="loading"
              @click="handleSubmit"
            >
              <span v-if="loading" class="login-btn__spinner"></span>
              <span v-else class="login-btn__text">登 录</span>
            </button>
          </NFormItem>
        </NForm>

        <div class="login-card__footer">
          <div class="login-card__divider">
            <span>测试账户</span>
          </div>
          <p class="login-card__hint">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            user@example.com / 任意密码
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-page__background {
  position: absolute;
  inset: 0;
  background-color: var(--bg-secondary);
}

.login-page__gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, var(--color-primary-light) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, var(--color-primary-100) 0%, transparent 50%);
  opacity: 0.5;
  animation: gradientMove 20s ease-in-out infinite;
}

@keyframes gradientMove {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-5%, -5%);
  }
}

.login-page__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-lg);
}

.login-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-2xl);
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card__header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-card__logo {
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.login-card__logo svg {
  width: 32px;
  height: 32px;
}

.login-card__title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: var(--spacing-xs);
}

.login-card__subtitle {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

.login-card__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.input-wrapper:hover {
  background-color: var(--bg-hover);
}

.input-wrapper:focus-within {
  background-color: var(--bg-color);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-light);
}

.input-wrapper--error {
  border-color: var(--color-error);
}

.input-wrapper--error:focus-within {
  box-shadow: 0 0 0 4px var(--color-error-light);
}

.input-wrapper--success {
  border-color: var(--color-success);
}

.input-wrapper--success:focus-within {
  box-shadow: 0 0 0 4px var(--color-success-light);
}

.input-icon {
  width: 20px;
  height: 20px;
  margin-left: var(--spacing-md);
  color: var(--text-muted);
  flex-shrink: 0;
}

.input-icon svg {
  width: 100%;
  height: 100%;
}

.input-status {
  width: 20px;
  height: 20px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.input-status--success {
  color: var(--color-success);
}

.input-status svg {
  width: 100%;
  height: 100%;
}

.input-toggle {
  width: 36px;
  height: 36px;
  margin-right: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.input-toggle:hover {
  color: var(--text-color);
  background-color: var(--bg-hover);
}

.input-toggle svg {
  width: 20px;
  height: 20px;
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
  padding-left: var(--spacing-md);
}

.error-enter-active,
.error-leave-active {
  transition: all var(--transition-fast);
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.login-btn {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: 600;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn--loading {
  background: var(--color-primary);
}

.login-btn__spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-card__footer {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.login-card__divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.login-card__divider::before,
.login-card__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.login-card__divider span {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.login-card__hint {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.login-card__hint svg {
  width: 16px;
  height: 16px;
  color: var(--color-info);
}
</style>
