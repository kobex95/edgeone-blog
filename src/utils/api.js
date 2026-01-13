import axios from 'axios'

// 动态确定API基础URL
const getBaseURL = () => {
  // 开发环境
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api'
  }
  
  // 生产环境 - 使用相对路径或完整域名
  const isEdgeFunction = typeof EdgeRuntime !== 'undefined'
  if (isEdgeFunction) {
    // Edge函数环境
    return '/api'
  }
  
  // Pages环境 - 可能需要完整域名
  return '/api' // 或者使用完整的API域名
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api