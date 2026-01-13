<template>
  <div class="api-debug">
    <div class="container">
      <h1>🔧 API 调试工具</h1>
      
      <div class="config-info">
        <h2>当前配置信息</h2>
        <div class="info-item">
          <strong>环境:</strong> {{ envInfo.NODE_ENV }}
        </div>
        <div class="info-item">
          <strong>BaseURL:</strong> {{ currentBaseURL }}
        </div>
        <div class="info-item">
          <strong>完整URL:</strong> {{ fullTestUrl }}
        </div>
      </div>
      
      <div class="test-section">
        <h2>API测试</h2>
        
        <div class="test-buttons">
          <button @click="testRelativePath" class="btn btn-primary">
            测试相对路径 (/api/auth/login)
          </button>
          <button @click="testAbsolutePath" class="btn btn-secondary">
            测试绝对路径
          </button>
          <button @click="testDirectDomain" class="btn btn-warning">
            测试直接域名
          </button>
        </div>
        
        <div v-if="testResults.length > 0" class="results">
          <h3>测试结果</h3>
          <div 
            v-for="(result, index) in testResults" 
            :key="index" 
            class="result-item"
            :class="result.success ? 'success' : 'error'"
          >
            <div class="result-header">
              <span class="status">{{ result.success ? '✅' : '❌' }}</span>
              <strong>{{ result.name }}</strong>
              <span class="time">{{ result.time }}ms</span>
            </div>
            <pre class="result-details">{{ result.details }}</pre>
          </div>
        </div>
      </div>
      
      <div class="quick-login">
        <h2>快速登录测试</h2>
        <form @submit.prevent="quickLogin">
          <div class="form-group">
            <input v-model="loginUsername" type="text" placeholder="用户名" class="form-input">
          </div>
          <div class="form-group">
            <input v-model="loginPassword" type="password" placeholder="密码" class="form-input">
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loginLoading">
            {{ loginLoading ? '登录中...' : '登录测试' }}
          </button>
        </form>
        
        <div v-if="loginResult" class="login-result" :class="loginResult.success ? 'success' : 'error'">
          <h4>{{ loginResult.success ? '✅ 登录成功' : '❌ 登录失败' }}</h4>
          <pre>{{ loginResult.details }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'ApiDebugger',
  setup() {
    const envInfo = ref({
      NODE_ENV: import.meta.env.NODE_ENV || 'unknown'
    })
    
    const testResults = ref([])
    const loginUsername = ref('admin')
    const loginPassword = ref('admin123')
    const loginLoading = ref(false)
    const loginResult = ref(null)
    
    // 动态获取当前BaseURL
    const currentBaseURL = computed(() => {
      if (import.meta.env.DEV) {
        return 'http://localhost:3001/api'
      }
      return '/api'
    })
    
    const fullTestUrl = computed(() => {
      return `${window.location.origin}${currentBaseURL.value}/auth/login`
    })
    
    const addTestResult = (name, success, time, details) => {
      testResults.value.unshift({
        name,
        success,
        time,
        details: typeof details === 'object' ? JSON.stringify(details, null, 2) : details
      })
    }
    
    const testRelativePath = async () => {
      const startTime = Date.now()
      try {
        const response = await axios.post('/api/auth/login', {
          username: 'admin',
          password: 'admin123'
        })
        const endTime = Date.now()
        addTestResult('相对路径测试', true, endTime - startTime, response.data)
      } catch (error) {
        const endTime = Date.now()
        addTestResult('相对路径测试', false, endTime - startTime, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
      }
    }
    
    const testAbsolutePath = async () => {
      const startTime = Date.now()
      try {
        const baseUrl = import.meta.env.DEV 
          ? 'http://localhost:3001' 
          : window.location.origin
        const response = await axios.post(`${baseUrl}/api/auth/login`, {
          username: 'admin',
          password: 'admin123'
        })
        const endTime = Date.now()
        addTestResult('绝对路径测试', true, endTime - startTime, response.data)
      } catch (error) {
        const endTime = Date.now()
        addTestResult('绝对路径测试', false, endTime - startTime, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        })
      }
    }
    
    const testDirectDomain = async () => {
      const startTime = Date.now()
      try {
        // 尝试直接调用可能的API域名
        const apiDomains = [
          window.location.origin,
          window.location.origin.replace('www.', ''),
          // 可以在这里添加其他的API域名
        ]
        
        let success = false
        let result = null
        
        for (const domain of apiDomains) {
          try {
            const response = await axios.post(`${domain}/api/auth/login`, {
              username: 'admin',
              password: 'admin123'
            }, { timeout: 5000 })
            success = true
            result = response
            break
          } catch (e) {
            // 继续尝试下一个域名
            console.log(`域名 ${domain} 测试失败`)
          }
        }
        
        const endTime = Date.now()
        if (success) {
          addTestResult('直接域名测试', true, endTime - startTime, result.data)
        } else {
          addTestResult('直接域名测试', false, endTime - startTime, '所有域名测试均失败')
        }
      } catch (error) {
        const endTime = Date.now()
        addTestResult('直接域名测试', false, endTime - startTime, error.message)
      }
    }
    
    const quickLogin = async () => {
      loginLoading.value = true
      loginResult.value = null
      
      try {
        // 尝试所有可能的URL
        const urls = [
          '/api/auth/login',
          `${window.location.origin}/api/auth/login`,
          ...(import.meta.env.DEV ? ['http://localhost:3001/api/auth/login'] : [])
        ]
        
        let success = false
        let responseData = null
        
        for (const url of urls) {
          try {
            const response = await axios.post(url, {
              username: loginUsername.value,
              password: loginPassword.value
            })
            success = true
            responseData = response.data
            break
          } catch (error) {
            console.log(`URL ${url} 登录失败:`, error.message)
          }
        }
        
        loginResult.value = {
          success,
          details: success 
            ? JSON.stringify(responseData, null, 2)
            : '所有登录尝试均失败'
        }
      } catch (error) {
        loginResult.value = {
          success: false,
          details: error.message
        }
      } finally {
        loginLoading.value = false
      }
    }
    
    return {
      envInfo,
      currentBaseURL,
      fullTestUrl,
      testResults,
      loginUsername,
      loginPassword,
      loginLoading,
      loginResult,
      testRelativePath,
      testAbsolutePath,
      testDirectDomain,
      quickLogin
    }
  }
}
</script>

<style scoped>
.api-debug {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.config-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.info-item {
  margin: 10px 0;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.test-section {
  margin-bottom: 30px;
}

.test-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.results {
  margin-top: 20px;
}

.result-item {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid;
}

.result-item.success {
  background: #d4edda;
  border-color: #28a745;
}

.result-item.error {
  background: #f8d7da;
  border-color: #dc3545;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.result-details {
  background: rgba(0,0,0,0.05);
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.quick-login {
  background: #e9ecef;
  padding: 25px;
  border-radius: 8px;
}

.quick-login form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.login-result {
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
}

.login-result.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.login-result.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

.login-result pre {
  margin: 10px 0 0 0;
  font-size: 12px;
  background: rgba(255,255,255,0.5);
  padding: 10px;
  border-radius: 4px;
}
</style>