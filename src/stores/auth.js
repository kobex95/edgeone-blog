import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  
  const isAuthenticated = computed(() => !!token.value)
  
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token: newToken, user: userData } = response.data
      
      token.value = newToken
      user.value = userData
      localStorage.setItem('token', newToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败' 
      }
    }
  }
  
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }
  
  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
      return true
    } catch (error) {
      logout()
      return false
    }
  }
  
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})