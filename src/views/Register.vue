<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { mockLoginResponse } from '@/services/mock'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const formValue = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const usernameFocused = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)
const confirmPasswordFocused = ref(false)

const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')

function validateUsername() {
  if (!formValue.value.username) {
    usernameError.value = '请输入用户名'
    return false
  }
  if (formValue.value.username.length < 2) {
    usernameError.value = '用户名至少2个字符'
    return false
  }
  if (formValue.value.username.length > 20) {
    usernameError.value = '用户名最多20个字符'
    return false
  }
  usernameError.value = ''
  return true
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
  if (formValue.value.password.length > 50) {
    passwordError.value = '密码最多50个字符'
    return false
  }
  passwordError.value = ''
  if (formValue.value.confirmPassword) {
    validateConfirmPassword()
  }
  return true
}

function validateConfirmPassword() {
  if (!formValue.value.confirmPassword) {
    confirmPasswordError.value = '请确认密码'
    return false
  }
  if (formValue.value.password !== formValue.value.confirmPassword) {
    confirmPasswordError.value = '两次输入的密码不一致'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

function validateTerms() {
  if (!agreedToTerms.value) {
    termsError.value = '请阅读并同意用户协议'
    return false
  }
  termsError.value = ''
  return true
}

async function handleSubmit() {
  const usernameValid = validateUsername()
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  const confirmPasswordValid = validateConfirmPassword()
  const termsValid = validateTerms()
  
  if (!usernameValid || !emailValid || !passwordValid || !confirmPasswordValid || !termsValid) return
  
  try {
    loading.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    userStore.login(mockLoginResponse.token, {
      ...mockLoginResponse.user,
      username: formValue.value.username,
      email: formValue.value.email
    })
    
    router.push('/')
  } catch {
    passwordError.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}

function goTerms() {
  router.push('/terms')
}

function goPrivacy() {
  router.push('/privacy')
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__content">
      <div class="login-card">
        <form class="login-card__form" @submit.prevent="handleSubmit">
          <div class="input-field">
            <div class="input-field__wrapper" :class="{ 'input-field__wrapper--focused': usernameFocused, 'input-field__wrapper--error': usernameError }">
              <span class="input-field__icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <div class="input-field__area">
                <input
                  v-model="formValue.username"
                  type="text"
                  class="input-field__input"
                  placeholder="请输入用户名"
                  @focus="usernameFocused = true"
                  @blur="usernameFocused = false; validateUsername()"
                />
                <div class="input-field__underline"></div>
              </div>
            </div>
            <Transition name="error">
              <p v-if="usernameError" class="input-field__error">{{ usernameError }}</p>
            </Transition>
          </div>

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
                  placeholder="请输入邮箱"
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

          <div class="input-field">
            <div class="input-field__wrapper" :class="{ 'input-field__wrapper--focused': passwordFocused, 'input-field__wrapper--error': passwordError }">
              <span class="input-field__icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <div class="input-field__area">
                <input
                  v-model="formValue.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="input-field__input"
                  placeholder="请输入密码"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false; validatePassword()"
                />
                <div class="input-field__underline"></div>
              </div>
              <button type="button" class="input-field__toggle" @click="showPassword = !showPassword">
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <Transition name="error">
              <p v-if="passwordError" class="input-field__error">{{ passwordError }}</p>
            </Transition>
          </div>

          <div class="input-field">
            <div class="input-field__wrapper" :class="{ 'input-field__wrapper--focused': confirmPasswordFocused, 'input-field__wrapper--error': confirmPasswordError }">
              <span class="input-field__icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <div class="input-field__area">
                <input
                  v-model="formValue.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="input-field__input"
                  placeholder="请确认密码"
                  @focus="confirmPasswordFocused = true"
                  @blur="confirmPasswordFocused = false; validateConfirmPassword()"
                  @keyup.enter="handleSubmit"
                />
                <div class="input-field__underline"></div>
              </div>
              <button type="button" class="input-field__toggle" @click="showConfirmPassword = !showConfirmPassword">
                <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <Transition name="error">
              <p v-if="confirmPasswordError" class="input-field__error">{{ confirmPasswordError }}</p>
            </Transition>
          </div>

          <div class="terms-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreedToTerms" />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">
                我已阅读并同意
                <a class="terms-link" @click.prevent="goTerms">用户协议</a>
                和
                <a class="terms-link" @click.prevent="goPrivacy">隐私政策</a>
              </span>
            </label>
          </div>
          <Transition name="error">
            <p v-if="termsError" class="terms-error">{{ termsError }}</p>
          </Transition>

          <div class="login-card__actions">
            <button
              type="submit"
              class="login-btn"
              :class="{ 'login-btn--loading': loading }"
              :disabled="loading"
            >
              <span v-if="loading" class="login-btn__spinner"></span>
              <span v-else class="login-btn__text">注 册</span>
            </button>
          </div>

          <div class="login-card__links">
            <span class="login-card__text">已有账户?</span>
            <a href="#" class="login-card__link" @click.prevent="goLogin">立即登录</a>
          </div>
        </form>

        <div class="login-card__footer">
          <div class="login-card__hint">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span>注册即表示您同意我们的服务条款</span>
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
  gap: var(--spacing-md);
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

.input-field__input::-ms-reveal,
.input-field__input::-ms-clear {
  display: none;
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

.input-field__toggle {
  padding-top: 15px;
  width: 32px;
  height: 32px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.input-field__toggle:hover {
  color: var(--text-color);
}

.input-field__toggle svg {
  width: 100%;
  height: 100%;
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

.terms-checkbox {
  margin-top: var(--spacing-xs);
  display: flex;
  justify-content: center;
}

.checkbox-label {
  display: inline-flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: nowrap;
}

.checkbox-label input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  position: relative;
  transition: all var(--transition-fast);
  margin-top: 2px;
}

.checkbox-label input:checked + .checkbox-custom {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-label input:checked + .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  flex: 1;
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.terms-link:hover {
  color: var(--color-primary-hover);
}

.terms-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
  text-align: center;
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
  gap: var(--spacing-xs);
  margin-top: var(--spacing-md);
}

.login-card__text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
