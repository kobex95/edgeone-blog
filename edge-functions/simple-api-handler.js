// 简化版API处理器 - 用于快速测试
export default async function handler(request, context) {
  const url = new URL(request.url)
  const pathname = url.pathname
  
  console.log('📥 收到请求:', {
    method: request.method,
    pathname: pathname,
    headers: Object.fromEntries(request.headers)
  })
  
  // 处理OPTIONS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    })
  }
  
  // API路由处理
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, context, pathname)
  }
  
  // 默认返回404
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: `路径 ${pathname} 未找到处理函数`
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

async function handleApiRequest(request, context, pathname) {
  try {
    console.log('🔧 处理API请求:', pathname)
    
    // 简单的路由映射
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      return handleLogin(request)
    }
    
    if (pathname === '/api/articles' && request.method === 'GET') {
      return handleGetArticles(request)
    }
    
    if (pathname.startsWith('/api/auth/') && request.method === 'GET') {
      return handleAuthCheck(request)
    }
    
    // 默认API响应
    return new Response(JSON.stringify({
      message: `API端点 ${pathname} 已收到请求`,
      method: request.method,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('❌ API处理错误:', error)
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

async function handleLogin(request) {
  try {
    const body = await request.json()
    console.log('🔐 登录请求数据:', body)
    
    // 简单的认证逻辑
    if (body.username === 'admin' && body.password === 'admin123') {
      return new Response(JSON.stringify({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        user: {
          id: 1,
          username: 'admin',
          role: 'admin'
        },
        message: '登录成功'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } else {
      return new Response(JSON.stringify({
        message: '用户名或密码错误'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({
      message: '请求数据格式错误'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}

async function handleGetArticles(request) {
  // 模拟文章数据
  const articles = [
    {
      id: 1,
      title: '欢迎使用Mu Blog',
      excerpt: '这是一个现代化的博客系统，支持EdgeOne Pages部署',
      created_at: new Date().toISOString(),
      category: '技术',
      tags: ['Vue.js', 'EdgeOne', '博客']
    },
    {
      id: 2,
      title: 'EdgeOne Pages部署指南',
      excerpt: '详细的部署教程和最佳实践',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      category: '教程',
      tags: ['部署', '教程', 'EdgeOne']
    }
  ]
  
  return new Response(JSON.stringify({
    articles: articles,
    total: articles.length,
    page: 1,
    totalPages: 1
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  })
}

async function handleAuthCheck(request) {
  // 简单的认证检查
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')) {
    return new Response(JSON.stringify({
      user: {
        id: 1,
        username: 'admin',
        role: 'admin'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } else {
    return new Response(JSON.stringify({
      message: '未授权访问'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}