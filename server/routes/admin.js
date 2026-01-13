const express = require('express')
const Article = require('../models/Article')
const { authenticateToken, authorizeAdmin } = require('../middleware/auth')

const router = express.Router()

// 管理员权限验证中间件
router.use(authenticateToken, authorizeAdmin)

// 获取统计信息
router.get('/stats', async (req, res) => {
  try {
    const articlesResult = await Article.findAll({ limit: 1000 })
    const categories = await Article.getCategories()
    const tags = await Article.getTags()
    
    const totalViews = articlesResult.articles.reduce((sum, article) => sum + (article.views || 0), 0)
    
    res.json({
      articles: articlesResult.total,
      categories: categories.length,
      tags: tags.length,
      views: totalViews
    })
  } catch (error) {
    console.error('获取统计信息失败:', error)
    res.status(500).json({ message: '获取统计信息失败' })
  }
})

// 获取所有文章（包括草稿）
router.get('/articles', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = ''
    } = req.query

    const result = await Article.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      status: status || undefined
    })

    res.json(result)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({ message: '获取文章列表失败' })
  }
})

// 创建文章
router.post('/articles', async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' })
    }

    const articleId = await Article.create({
      title,
      content,
      excerpt,
      category,
      tags,
      status,
      author: req.user.username
    })

    res.status(201).json({ 
      message: '文章创建成功',
      articleId 
    })
  } catch (error) {
    console.error('创建文章失败:', error)
    res.status(500).json({ message: '创建文章失败' })
  }
})

// 更新文章
router.put('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: '文章不存在' })
    }

    const { title, content, excerpt, category, tags, status } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: '标题和内容不能为空' })
    }

    await Article.update(req.params.id, {
      title,
      content,
      excerpt,
      category,
      tags,
      status
    })

    res.json({ message: '文章更新成功' })
  } catch (error) {
    console.error('更新文章失败:', error)
    res.status(500).json({ message: '更新文章失败' })
  }
})

// 删除文章
router.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ message: '文章不存在' })
    }

    await Article.delete(req.params.id)
    res.json({ message: '文章删除成功' })
  } catch (error) {
    console.error('删除文章失败:', error)
    res.status(500).json({ message: '删除文章失败' })
  }
})

module.exports = router