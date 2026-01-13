// EdgeOne 函数 - 简化版API处理器
export default async function handler(request, context) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // 处理OPTIONS预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  
  // API路由处理
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(request, pathname);
  }
  
  // 默认404
  return new Response(JSON.stringify({
    error: 'Not Found',
    message: `路径 ${pathname} 未找到`
  }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function handleApiRequest(request, pathname) {
  try {
    // 登录接口
    if (pathname === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json();
      
      if (body.username === 'admin' && body.password === 'admin123') {
        return new Response(JSON.stringify({
          token: 'mock-jwt-token',
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
    }
    
    // 文章列表接口
    if (pathname === '/api/articles' && request.method === 'GET') {
      return new Response(JSON.stringify({
        articles: [
          {
            id: 1,
            title: '欢迎使用Mu Blog',
            excerpt: '现代化的博客系统',
            created_at: new Date().toISOString()
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
    
    // 默认API响应
    return new Response(JSON.stringify({
      message: `API端点 ${pathname} 已收到请求`,
      method: request.method
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}