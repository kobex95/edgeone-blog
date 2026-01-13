const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    const isValid = await User.validatePassword(username, password)
    if (!isValid) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    const user = await User.findByUsername(username)
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '登录失败' })
  }
})

// 获取当前用户信息
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }
    res.json({ user })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({ message: '获取用户信息失败' })
  }
})

module.exports = router