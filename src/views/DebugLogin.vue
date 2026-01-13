<template>
  <div class="debug-login">
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">调试登录</h2>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              v-model="username" 
              type="text" 
              class="form-input"
              placeholder="admin"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">密码</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-input"
              placeholder="admin123"
              required
            >
          </div>
          
          <div v-if="error" class="alert alert-error">
            ❌ {{ error }}
          </div>
          
          <div v-if="debugInfo" class="debug-info">
            <h4>调试信息:</h4>
            <pre>{{ debugInfo }}</pre>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        
        <div class="test-section">
          <h3>快速测试</h3>
          <button @click="testApiConnection" class="btn btn-secondary">
            测试API连接
          </button>
          <button @click="checkEnvVars" class="btn btn-secondary">
            检查环境变量
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'

export default {
  name: 'DebugLogin',
  setup() {
    const router = useRouter()
    
    const username = ref('admin')
    const password = ref('admin123')
    const loading = ref(false)
    const error = ref('')
    const debugInfo = ref('')
    
    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      debugInfo.value = ''
      
      try {
        console.log('发送登录请求...')
        const response = await api.post('/auth/login', {
          username: username.value,
          password: password.value
        })
        
        console.log('登录响应:', response)
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          debugInfo.value = JSON.stringify(response.data, null, 2)
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
        }
      } catch (err) {
        console.error('登录错误详情:', err)
        error.value = err.response?.data?.message || err.message || '登录失败'
        
        // 收集调试信息
        const debugData = {
          request: {
            url: err.config?.url,
            method: err.config?.method,
            data: err.config?.data
          },
          response: {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data
          },
          error: {
            message: err.message,
            code: err.code
          }
        }
        debugInfo.value = JSON.stringify(debugData, null, 2)
      } finally {
        loading.value = false
      }
    }
    
    const testApiConnection = async () => {
      try {
        const response = await api.get('/articles?limit=1')
        debugInfo.value = '✅ API连接成功\n' + JSON.stringify(response.data, null, 2)
      } catch (err) {
        debugInfo.value = '❌ API连接失败\n' + JSON.stringify({
          status: err.response?.status,
          message: err.message
        }, null, 2)
      }
    }
    
    const checkEnvVars = () => {
      const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        localStorage_token: !!localStorage.getItem('token')
      }
      debugInfo.value = '环境变量检查:\n' + JSON.stringify(envVars, null, 2)
    }
    
    return {
      username,
      password,
      loading,
      error,
      debugInfo,
      handleLogin,
      testApiConnection,
      checkEnvVars
    }
  }
}
</script>

<style scoped>
.debug-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 40px;
}

.login-title {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.login-form {
  margin-bottom: 30px;
}

.debug-info {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin: 20px 0;
}

.debug-info pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  color: #495057;
  margin: 0;
}

.test-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.test-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.test-section .btn {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>