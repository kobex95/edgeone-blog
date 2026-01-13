require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

// 初始化数据库
const db = require('./server/models/Database')

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist/client')))

// 路由
const authRoutes = require('./routes/auth')
const articleRoutes = require('./routes/articles')
const adminRoutes = require('./routes/admin')

app.use('/api/auth', authRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/admin', adminRoutes)

// 处理 Vue Router 的历史模式
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'))
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

app.listen(PORT, async () => {
  console.log(`服务器运行在端口 ${PORT}`)
  
  try {
    // 初始化数据库表
    await db.initializeTables()
    // 创建默认管理员账户
    await db.createDefaultAdmin()
    console.log('数据库初始化完成')
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }
})

module.exports = app