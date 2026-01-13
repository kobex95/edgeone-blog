const db = require('./Database')
const bcrypt = require('bcryptjs')

class User {
  static async findByUsername(username) {
    try {
      const result = await db.execute(
        'SELECT * FROM users WHERE username = ?', 
        [username]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  static async findById(id) {
    try {
      const result = await db.execute(
        'SELECT id, username, role, created_at FROM users WHERE id = ?', 
        [id]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('查找用户失败:', error)
      throw error
    }
  }

  static async validatePassword(username, password) {
    try {
      const user = await this.findByUsername(username)
      if (!user) return false
      
      return await bcrypt.compare(password, user.password)
    } catch (error) {
      console.error('验证密码失败:', error)
      throw error
    }
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const result = await db.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [userData.username, hashedPassword, userData.role || 'admin']
      )
      return result.lastInsertRowid
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  }
}

module.exports = User