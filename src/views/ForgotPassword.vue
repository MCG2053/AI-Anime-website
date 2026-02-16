<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(false)
const submitted = ref(false)
const formValue = ref({
  email: ''
})

const emailFocused = ref(false)
const emailError = ref('')

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

async function handleSubmit() {
  const emailValid = validateEmail()
  
  if (!emailValid) return
  
  try {
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    submitted.value = true
  } catch {
    emailError.value = '发送失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__content">
      <div class="login-card">
        <template v-if="!submitted">
          <form class="login-card__form" @submit.prevent="handleSubmit">
            <div class="input-field">
              <div class="input-field__wrapper" :class="{ 'input-field__wrapper--focused': emailFocused, 'input-field__wrapper--error': emailError }">
                <span class="input-field__icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <div class="input-field__area">
                  <input
                    v-model="formValue.email"
                    type="text"
                    class="input-field__input"
                    placeholder="请输入注册邮箱"
                    @focus="emailFocused = true"
                    @blur="emailFocused = false; validateEmail()"
                  />
                  <div class="input-field__underline"></div>
                </div>
              </div>
              <Transition name="error">
                <p v-if="emailError" class="input-field__error">{{ emailError }}</p>
              </Transition>
            </div>

            <div class="login-card__actions">
              <button
                type="submit"
                class="login-btn"
                :class="{ 'login-btn--loading': loading }"
                :disabled="loading"
              >
                <span v-if="loading" class="login-btn__spinner"></span>
                <span v-else class="login-btn__text">发送重置链接</span>
              </button>
            </div>

            <div class="login-card__links">
              <a href="#" class="login-card__link" @click.prevent="goLogin">返回登录</a>
            </div>
          </form>
        </template>

        <template v-else>
          <div class="success-message">
            <div class="success-message__icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="success-message__title">邮件已发送</h3>
            <p class="success-message__text">
              我们已向 <strong>{{ formValue.email }}</strong> 发送了密码重置链接，请查收邮件并按照提示操作。
            </p>
            <button class="login-btn" @click="goLogin">
              <span class="login-btn__text">返回登录</span>
            </button>
          </div>
        </template>

        <div class="login-card__footer">
          <div class="login-card__hint">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>如果未收到邮件，请检查垃圾邮件文件夹</span>
          </div>
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
  background-color: var(--bg-color);
}

.dark .login-page {
  background-color: var(--bg-color);
}

.login-page__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-lg);
}

@media (max-width: 480px) {
  .login-page__content {
    padding: var(--spacing-md);
    max-width: 100%;
  }
}

.login-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-2xl);
  animation: fadeInUp 0.5s ease;
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
  }
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

.login-card__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.input-field {
  display: flex;
  flex-direction: column;
}

.input-field__wrapper {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.input-field__icon {
  padding-top: 15px;
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color var(--transition-fast);
}

.input-field__icon svg {
  width: 100%;
  height: 100%;
}

.input-field__wrapper--focused .input-field__icon {
  color: var(--color-primary);
}

.input-field__wrapper--error .input-field__icon {
  color: var(--color-error);
}

.input-field__area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-field__input {
  width: 100%;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  color: var(--text-color);
  background: transparent;
  border: none;
  outline: none;
}

.input-field__input:-webkit-autofill,
.input-field__input:-webkit-autofill:hover,
.input-field__input:-webkit-autofill:focus,
.input-field__input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px var(--bg-card) inset !important;
  -webkit-text-fill-color: var(--text-color) !important;
  transition: background-color 5000s ease-in-out 0s;
}

.input-field__input::placeholder {
  color: var(--text-muted);
}

.input-field__underline {
  height: 3px;
  background-color: var(--border-color);
  transition: background-color var(--transition-fast);
}

.input-field__wrapper--focused .input-field__underline {
  background-color: var(--color-primary);
}

.input-field__wrapper--error .input-field__underline {
  background-color: var(--color-error);
}

.input-field__error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
  padding-left: calc(20px + var(--spacing-md));
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

.login-card__actions {
  margin-top: var(--spacing-sm);
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
  border: none;
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

.login-card__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.login-card__link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.login-card__link:hover {
  color: var(--color-primary-hover);
}

.success-message {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.success-message__icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg);
  background-color: var(--color-success);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.3s ease;
}

.success-message__icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-message__title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: var(--spacing-sm);
}

.success-message__text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.success-message__text strong {
  color: var(--color-primary);
}

.login-card__footer {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
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
  white-space: nowrap;
}

.login-card__hint svg {
  width: 1em;
  height: 1em;
  color: var(--color-info);
  flex-shrink: 0;
}
</style>
