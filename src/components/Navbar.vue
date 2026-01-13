<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Mu Blog</router-link>
      
      <div class="nav-links" :class="{ active: menuOpen }">
        <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>
        <router-link to="/articles" class="nav-link" @click="closeMenu">文章</router-link>
        <router-link v-if="isAuthenticated" to="/admin" class="nav-link" @click="closeMenu">管理</router-link>
        <a v-if="isAuthenticated" @click="logout" class="nav-link" style="cursor: pointer;">退出</a>
        <router-link v-else to="/login" class="nav-link" @click="closeMenu">登录</router-link>
      </div>
      
      <button class="menu-toggle" @click="toggleMenu" aria-label="切换菜单">
        <span :class="{ 'rotate-45': menuOpen, 'translate-y-1.5': menuOpen }"></span>
        <span :class="{ 'opacity-0': menuOpen }"></span>
        <span :class="{ '-rotate-45': menuOpen, '-translate-y-1.5': menuOpen }"></span>
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Navbar',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const menuOpen = ref(false)
    
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }
    
    const closeMenu = () => {
      menuOpen.value = false
    }
    
    const logout = () => {
      authStore.logout()
      closeMenu()
      router.push('/')
    }
    
    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-container')) {
        closeMenu()
      }
    }
    
    // 监听点击事件
    document.addEventListener('click', handleClickOutside)
    
    return {
      isAuthenticated,
      menuOpen,
      toggleMenu,
      closeMenu,
      logout
    }
  }
}
</script>