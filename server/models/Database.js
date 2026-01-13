const { createClient } = require('@libsql/client')

class Database {
  constructor() {
    this.client = null
    this.init()
  }

  init() {
    try {
      this.client = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_TOKEN
      })
      console.log('数据库连接成功')
    } catch (error) {
      console.error('数据库连接失败:', error)
      throw error
    }
  }

  async initializeTables() {
    try {
      // 创建用户表
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // 创建文章表
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          category TEXT,
          tags TEXT,
          status TEXT DEFAULT 'draft',
          author TEXT,
          views INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // 创建分类表
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // 创建标签表
      await this.client.execute(`
        CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log('数据表初始化完成')
    } catch (error) {
      console.error('数据表初始化失败:', error)
      throw error
    }
  }

  async createDefaultAdmin() {
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    
    try {
      await this.client.execute({
        sql: `
          INSERT OR IGNORE INTO users (username, password, role) 
          VALUES (?, ?, ?)
        `,
        args: [process.env.ADMIN_USERNAME, hashedPassword, 'admin']
      })
      console.log('默认管理员账户创建完成')
    } catch (error) {
      console.error('创建默认管理员失败:', error)
    }
  }

  async execute(sql, args = []) {
    return await this.client.execute({ sql, args })
  }

  async transaction(callback) {
    return await this.client.transaction(callback)
  }
}

const db = new Database()
module.exports = db