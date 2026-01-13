// EdgeOne Pages API处理函数
import { createServer } from 'node:http'
import { parse } from 'node:url'
import next from 'next'

export default async function handler(request, context) {
  // 处理API请求
  const { pathname, query } = parse(request.url, true)
  
  // API路由处理
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, context, pathname, query)
  }
  
  // 静态文件服务
  return serveStaticFile(request, context)
}

async function handleApiRequest(request, context, pathname, query) {
  // API路由映射
  const apiRoutes = {
    '/api/articles': handleArticles,
    '/api/auth/login': handleLogin,
    '/api/admin/stats': handleAdminStats
  }
  
  const handler = apiRoutes[pathname] || handleNotFound
  
  try {
    const result = await handler(request, context, query)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// API处理器示例
async function handleArticles(request, context, query) {
  // 模拟文章数据
  const articles = [
    {
      id: 1,
      title: '欢迎使用Mu Blog',
      excerpt: '这是一个现代化的博客系统',
      created_at: new Date().toISOString()
    }
  ]
  
  return {
    articles,
    total: articles.length,
    page: 1,
    totalPages: 1
  }
}

async function handleLogin(request, context, query) {
  const { method } = request
  
  if (method === 'POST') {
    const body = await request.json()
    // 简单的身份验证逻辑
    if (body.username === 'admin' && body.password === 'admin123') {
      return {
        token: 'mock-jwt-token',
        user: { id: 1, username: 'admin', role: 'admin' }
      }
    }
  }
  
  throw new Error('认证失败')
}

async function handleAdminStats(request, context, query) {
  return {
    articles: 10,
    categories: 3,
    tags: 15,
    views: 1000
  }
}

async function handleNotFound() {
  throw new Error('API端点未找到')
}

async function serveStaticFile(request, context) {
  // 静态文件服务逻辑
  return new Response('静态文件服务', { status: 200 })
}