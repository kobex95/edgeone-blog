const express = require('express')
const Article = require('../models/Article')

const router = express.Router()

// 获取文章列表
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category = '',
      tags = '',
      search = ''
    } = req.query

    const result = await Article.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      tags,
      search,
      status: 'published'
    })

    res.json(result)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    res.status(500).json({ message: '获取文章列表失败' })
  }
})

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    
    if (!article) {
      return res.status(404).json({ message: '文章不存在' })
    }

    if (article.status !== 'published') {
      return res.status(403).json({ message: '文章未发布' })
    }

    res.json({ article })
  } catch (error) {
    console.error('获取文章失败:', error)
    res.status(500).json({ message: '获取文章失败' })
  }
})

// 增加文章浏览量
router.post('/:id/view', async (req, res) => {
  try {
    await Article.incrementViews(req.params.id)
    res.json({ message: '浏览量增加成功' })
  } catch (error) {
    console.error('增加浏览量失败:', error)
    res.status(500).json({ message: '操作失败' })
  }
})

// 给文章点赞
router.post('/:id/like', async (req, res) => {
  try {
    await Article.incrementLikes(req.params.id)
    res.json({ message: '点赞成功' })
  } catch (error) {
    console.error('点赞失败:', error)
    res.status(500).json({ message: '操作失败' })
  }
})

module.exports = router