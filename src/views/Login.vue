<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">管理员登录</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              v-model="username" 
              type="text" 
              class="form-input"
              required
              autocomplete="username"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">密码</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-input"
              required
              autocomplete="current-password"
            >
          </div>
          
          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <div class="login-footer">
          <p>请输入管理员账号信息登录博客后台管理系统</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const username = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')
    
    const handleLogin = async () => {
      if (!username.value || !password.value) {
        error.value = '请输入用户名和密码'
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        const result = await authStore.login({
          username: username.value,
          password: password.value
        })
        
        if (result.success) {
          router.push('/admin')
        } else {
          error.value = result.message
        }
      } catch (err) {
        error.value = '登录过程中发生错误'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    
    return {
      username,
      password,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
  text-align: center;
}

.login-title {
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
}

.login-form {
  text-align: left;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-top: 20px;
}

.login-footer {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.login-footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style>