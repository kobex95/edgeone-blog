// 增强版API处理器 - 修复路由问题
export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  console.log('🔧 函数接收请求:', {
    method: request.method,
    pathname: pathname,
    userAgent: request.headers.get('user-agent')
  });

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
    });
  }

  try {
    // 测试端点
    if (pathname === '/test') {
      return new Response(JSON.stringify({
        status: 'success',
        message: '函数部署验证成功',
        timestamp: new Date().toISOString(),
        endpoint: '/test'
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // API路由处理
    if (pathname.startsWith('/api/')) {
      return await handleApiRequest(request, pathname);
    }

    // 管理路由处理
    if (pathname.startsWith('/admin/')) {
      return await handleAdminRequest(request, pathname);
    }

    // 默认404
    return new Response(JSON.stringify({
      error: 'Not Found',
      message: `路径 ${pathname} 未找到处理函数`,
      availableRoutes: ['/test', '/api/*', '/admin/*']
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('❌ 函数处理错误:', error);
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function handleApiRequest(request, pathname) {
  // 文章列表
  if (pathname === '/api/articles' && request.method === 'GET') {
    return new Response(JSON.stringify({
      articles: [
        {
          id: 1,
          title: '欢迎使用Mu Blog',
          excerpt: '这是一个现代化的博客系统',
          created_at: new Date().toISOString(),
          category: '技术'
        }
      ],
      total: 1,
      page: 1,
      totalPages: 1
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 登录接口
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    try {
      const body = await request.json();
      if (body.username === 'admin' && body.password === 'admin123') {
        return new Response(JSON.stringify({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
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
        });
      } else {
        return new Response(JSON.stringify({
          message: '用户名或密码错误'
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
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
      });
    }
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
  });
}

async function handleAdminRequest(request, pathname) {
  // 简单的管理端点测试
  return new Response(JSON.stringify({
    message: '管理功能需要认证',
    endpoint: pathname,
    method: request.method
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}