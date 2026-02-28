import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(storage.getToken())
  const user = ref<User | null>(storage.getUser<User>())

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const username = computed(() => user.value?.username || '')
  const avatar = computed(() => user.value?.avatar || '')

  function setToken(newToken: string) {
    token.value = newToken
    storage.setToken(newToken)
  }

  function setUser(newUser: User) {
    user.value = newUser
    storage.setUser(newUser)
  }

  function login(tokenValue: string, userValue: User) {
    setToken(tokenValue)
    setUser(userValue)
  }

  function logout() {
    token.value = null
    user.value = null
    storage.clear()
  }

  function updateUserInfo(info: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...info }
      storage.setUser(user.value)
    }
  }

  return {
    token,
    user,
    isLoggedIn,
    username,
    avatar,
    setToken,
    setUser,
    login,
    logout,
    updateUserInfo
  }
})
