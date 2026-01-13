// EdgeOne Pages 管理后台处理函数
export default async function handler(request, context) {
  const { pathname, method } = request
  
  // 只允许特定路径访问管理功能
  if (!pathname.startsWith('/admin')) {
    return new Response('Forbidden', { status: 403 })
  }
  
  try {
    // 管理功能路由
    if (pathname === '/admin/login') {
      return handleAdminLogin(request, context)
    } else if (pathname === '/admin/dashboard') {
      return handleAdminDashboard(request, context)
    } else {
      // 默认返回管理页面
      return serveAdminPage(request, context)
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function handleAdminLogin(request, context) {
  if (request.method === 'POST') {
    const body = await request.json()
    
    // 简单的管理员验证
    if (body.username === process.env.ADMIN_USERNAME && 
        body.password === process.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({
        success: true,
        token: 'admin-session-token'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: '用户名或密码错误'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // GET请求返回登录页面HTML
  return new Response(getLoginPageHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  })
}

async function handleAdminDashboard(request, context) {
  // 验证管理员权限（简化版）
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.includes('admin-session-token')) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  return new Response(getDashboardHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  })
}

async function serveAdminPage(request, context) {
  return new Response(getAdminPanelHtml(), {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  })
}

// HTML模板
function getLoginPageHtml() {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>管理员登录 - Mu Blog</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
      .login-container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      .form-group { margin-bottom: 20px; }
      label { display: block; margin-bottom: 5px; font-weight: bold; }
      input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
      button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
      button:hover { background: #0056b3; }
      .error { color: red; margin-top: 10px; }
    </style>
  </head>
  <body>
    <div class="login-container">
      <h2>管理员登录</h2>
      <form id="loginForm">
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" id="username" required>
        </div>
        <div class="form-group">
          <label>密码:</label>
          <input type="password" id="password" required>
        </div>
        <button type="submit">登录</button>
        <div id="errorMessage" class="error"></div>
      </form>
    </div>
    
    <script>
      document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        
        try {
          const response = await fetch('/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          
          const data = await response.json();
          
          if (data.success) {
            localStorage.setItem('adminToken', data.token);
            window.location.href = '/admin/dashboard';
          } else {
            errorMessage.textContent = data.message;
          }
        } catch (error) {
          errorMessage.textContent = '登录失败，请重试';
        }
      });
    </script>
  </body>
  </html>
  `
}

function getDashboardHtml() {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>管理后台 - Mu Blog</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
      .header { background: #333; color: white; padding: 20px; }
      .container { max-width: 1200px; margin: 20px auto; padding: 0 20px; }
      .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
      .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
      .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
      .actions { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
      button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
      button:hover { background: #0056b3; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Mu Blog 管理后台</h1>
    </div>
    
    <div class="container">
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number" id="articleCount">0</div>
          <div>文章总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="viewCount">0</div>
          <div>总浏览量</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="userCount">1</div>
          <div>管理员数量</div>
        </div>
      </div>
      
      <div class="actions">
        <h2>管理操作</h2>
        <button onclick="createArticle()">新建文章</button>
        <button onclick="manageArticles()">文章管理</button>
        <button onclick="logout()">退出登录</button>
      </div>
    </div>
    
    <script>
      // 获取统计数据
      async function loadStats() {
        try {
          const response = await fetch('/api/admin/stats');
          const data = await response.json();
          
          document.getElementById('articleCount').textContent = data.articles;
          document.getElementById('viewCount').textContent = data.views;
        } catch (error) {
          console.error('获取统计数据失败:', error);
        }
      }
      
      function createArticle() {
        alert('文章创建功能待实现');
      }
      
      function manageArticles() {
        alert('文章管理功能待实现');
      }
      
      function logout() {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
      
      // 页面加载时获取统计数据
      loadStats();
    </script>
  </body>
  </html>
  `
}

function getAdminPanelHtml() {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>管理面板 - Mu Blog</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
      .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      h1 { color: #333; text-align: center; }
      .nav { text-align: center; margin: 20px 0; }
      .nav a { display: inline-block; padding: 10px 20px; margin: 0 10px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
      .nav a:hover { background: #0056b3; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Mu Blog 管理中心</h1>
      <div class="nav">
        <a href="/admin/login">登录</a>
        <a href="/admin/dashboard">仪表板</a>
        <a href="/">返回首页</a>
      </div>
      <p style="text-align: center; color: #666;">
        请选择相应的管理功能
      </p>
    </div>
  </body>
  </html>
  `
}