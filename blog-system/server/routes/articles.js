const express = require('express')
const { getDb } = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/articles — 前台：已发布文章列表
router.get('/', (req, res) => {
  const db = getDb()
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10))
  const { category, keyword } = req.query

  let where = "WHERE a.status = 'published'"
  const params = []

  if (category) {
    where += ' AND c.slug = ?'
    params.push(category)
  }

  if (keyword) {
    where += ' AND (a.title LIKE ? OR a.content LIKE ?)'
    params.push(`%${keyword}%`, `%${keyword}%`)
  }

  const countSql = `SELECT COUNT(*) as total FROM articles a LEFT JOIN categories c ON a.categoryId = c.id ${where}`
  const { total } = db.prepare(countSql).get(...params)

  const offset = (page - 1) * pageSize
  const dataSql = `
    SELECT a.id, a.title, a.summary, a.cover, a.status, a.viewCount,
           a.createdAt, a.updatedAt, a.categoryId, c.name as categoryName
    FROM articles a
    LEFT JOIN categories c ON a.categoryId = c.id
    ${where}
    ORDER BY a.createdAt DESC
    LIMIT ? OFFSET ?
  `
  const data = db.prepare(dataSql).all(...params, pageSize, offset)

  res.json({ data, total, page, pageSize })
})

// GET /api/articles/:id — 文章详情
router.get('/:id', (req, res) => {
  const db = getDb()
  const article = db.prepare(`
    SELECT a.*, c.name as categoryName
    FROM articles a
    LEFT JOIN categories c ON a.categoryId = c.id
    WHERE a.id = ?
  `).get(req.params.id)

  if (!article) {
    return res.status(404).json({ message: '文章不存在' })
  }

  // 增加阅读量
  db.prepare('UPDATE articles SET viewCount = viewCount + 1 WHERE id = ?').run(req.params.id)
  article.viewCount += 1

  res.json(article)
})

// GET /api/admin/articles — 后台：所有文章（含草稿）
router.get('/admin/all', authMiddleware, (req, res) => {
  const db = getDb()
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize) || 10))
  const { status } = req.query

  let where = ''
  const params = []

  if (status) {
    where = 'WHERE a.status = ?'
    params.push(status)
  }

  const { total } = db.prepare(`SELECT COUNT(*) as total FROM articles a ${where}`).get(...params)

  const offset = (page - 1) * pageSize
  const data = db.prepare(`
    SELECT a.id, a.title, a.summary, a.status, a.viewCount,
           a.createdAt, a.updatedAt, a.categoryId, c.name as categoryName
    FROM articles a
    LEFT JOIN categories c ON a.categoryId = c.id
    ${where}
    ORDER BY a.updatedAt DESC
    LIMIT ? OFFSET ?
  `).all(...params, pageSize, offset)

  res.json({ data, total, page, pageSize })
})

// POST /api/articles — 创建文章
router.post('/', authMiddleware, (req, res) => {
  const { title, content, summary, cover, categoryId, status } = req.body

  if (!title || !content) {
    return res.status(400).json({ message: '标题和内容不能为空' })
  }

  const db = getDb()
  const result = db.prepare(`
    INSERT INTO articles (title, content, summary, cover, categoryId, status, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, content, summary || '', cover || '', categoryId || null, status || 'draft', req.user.id)

  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(article)
})

// PUT /api/articles/:id — 更新文章
router.put('/:id', authMiddleware, (req, res) => {
  const { title, content, summary, cover, categoryId, status } = req.body
  const db = getDb()

  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id)
  if (!existing) {
    return res.status(404).json({ message: '文章不存在' })
  }

  db.prepare(`
    UPDATE articles
    SET title = ?, content = ?, summary = ?, cover = ?,
        categoryId = ?, status = ?, updatedAt = datetime('now')
    WHERE id = ?
  `).run(
    title ?? existing.title,
    content ?? existing.content,
    summary ?? existing.summary,
    cover ?? existing.cover,
    categoryId !== undefined ? categoryId : existing.categoryId,
    status ?? existing.status,
    req.params.id
  )

  const article = db.prepare(`
    SELECT a.*, c.name as categoryName
    FROM articles a LEFT JOIN categories c ON a.categoryId = c.id
    WHERE a.id = ?
  `).get(req.params.id)

  res.json(article)
})

// DELETE /api/articles/:id — 删除文章
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id)
  if (!existing) {
    return res.status(404).json({ message: '文章不存在' })
  }

  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id)
  res.json({ message: '删除成功' })
})

module.exports = router
