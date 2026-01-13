const db = require('./Database')

class Article {
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        category = '',
        tags = '',
        search = '',
        status = 'published'
      } = options

      let sql = 'SELECT * FROM articles WHERE 1=1'
      const args = []

      // 状态过滤
      if (status) {
        sql += ' AND status = ?'
        args.push(status)
      }

      // 分类过滤
      if (category) {
        sql += ' AND category = ?'
        args.push(category)
      }

      // 标签过滤
      if (tags) {
        const tagList = tags.split(',').map(tag => tag.trim())
        tagList.forEach(tag => {
          sql += ' AND tags LIKE ?'
          args.push(`%${tag}%`)
        })
      }

      // 搜索过滤
      if (search) {
        sql += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)'
        const searchTerm = `%${search}%`
        args.push(searchTerm, searchTerm, searchTerm)
      }

      // 计算总数
      const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count')
      const countResult = await db.execute(countSql, args)
      const total = countResult.rows[0].count

      // 添加排序和分页
      sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
      args.push(limit, (page - 1) * limit)

      const result = await db.execute(sql, args)
      
      return {
        articles: result.rows,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const result = await db.execute(
        'SELECT * FROM articles WHERE id = ?',
        [id]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('查找文章失败:', error)
      throw error
    }
  }

  static async create(articleData) {
    try {
      const tags = Array.isArray(articleData.tags) 
        ? articleData.tags.join(',') 
        : articleData.tags || ''

      const result = await db.execute(
        `INSERT INTO articles 
         (title, content, excerpt, category, tags, status, author) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          articleData.title,
          articleData.content,
          articleData.excerpt || '',
          articleData.category || '',
          tags,
          articleData.status || 'draft',
          articleData.author || 'admin'
        ]
      )
      return result.lastInsertRowid
    } catch (error) {
      console.error('创建文章失败:', error)
      throw error
    }
  }

  static async update(id, articleData) {
    try {
      const tags = Array.isArray(articleData.tags) 
        ? articleData.tags.join(',') 
        : articleData.tags || ''

      await db.execute(
        `UPDATE articles SET 
         title = ?, content = ?, excerpt = ?, category = ?, 
         tags = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          articleData.title,
          articleData.content,
          articleData.excerpt || '',
          articleData.category || '',
          tags,
          articleData.status || 'draft',
          id
        ]
      )
      return true
    } catch (error) {
      console.error('更新文章失败:', error)
      throw error
    }
  }

  static async delete(id) {
    try {
      await db.execute('DELETE FROM articles WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('删除文章失败:', error)
      throw error
    }
  }

  static async incrementViews(id) {
    try {
      await db.execute(
        'UPDATE articles SET views = views + 1 WHERE id = ?',
        [id]
      )
      return true
    } catch (error) {
      console.error('增加浏览量失败:', error)
      throw error
    }
  }

  static async incrementLikes(id) {
    try {
      await db.execute(
        'UPDATE articles SET likes = likes + 1 WHERE id = ?',
        [id]
      )
      return true
    } catch (error) {
      console.error('增加点赞数失败:', error)
      throw error
    }
  }

  static async getCategories() {
    try {
      const result = await db.execute(
        'SELECT DISTINCT category FROM articles WHERE category IS NOT NULL AND category != ""'
      )
      return result.rows.map(row => row.category)
    } catch (error) {
      console.error('获取分类失败:', error)
      throw error
    }
  }

  static async getTags() {
    try {
      const result = await db.execute(
        'SELECT DISTINCT tags FROM articles WHERE tags IS NOT NULL AND tags != ""'
      )
      
      const allTags = []
      result.rows.forEach(row => {
        const tags = row.tags.split(',').map(tag => tag.trim())
        allTags.push(...tags)
      })
      
      return [...new Set(allTags)].filter(tag => tag)
    } catch (error) {
      console.error('获取标签失败:', error)
      throw error
    }
  }
}

module.exports = Article