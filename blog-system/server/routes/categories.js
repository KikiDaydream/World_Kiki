const express = require('express')
const { getDb } = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/categories — 获取全部分类（含文章数）
router.get('/', (req, res) => {
  const db = getDb()
  const categories = db.prepare(`
    SELECT c.*, COUNT(a.id) as articleCount
    FROM categories c
    LEFT JOIN articles a ON a.categoryId = c.id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.sortOrder ASC, c.id ASC
  `).all()
  res.json(categories)
})

// POST /api/categories — 创建分类
router.post('/', authMiddleware, (req, res) => {
  const { name, slug, description, sortOrder } = req.body

  if (!name || !slug) {
    return res.status(400).json({ message: '分类名称和标识不能为空' })
  }

  const db = getDb()

  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug)
  if (existing) {
    return res.status(400).json({ message: '分类标识已存在' })
  }

  const result = db.prepare(
    'INSERT INTO categories (name, slug, description, sortOrder) VALUES (?, ?, ?, ?)'
  ).run(name, slug, description || '', sortOrder || 0)

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid)
  res.status(201).json(category)
})

// PUT /api/categories/:id — 更新分类
router.put('/:id', authMiddleware, (req, res) => {
  const { name, slug, description, sortOrder } = req.body
  const db = getDb()

  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!existing) {
    return res.status(404).json({ message: '分类不存在' })
  }

  if (slug && slug !== existing.slug) {
    const slugExists = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(slug, req.params.id)
    if (slugExists) {
      return res.status(400).json({ message: '分类标识已存在' })
    }
  }

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, description = ?, sortOrder = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    slug ?? existing.slug,
    description !== undefined ? description : existing.description,
    sortOrder !== undefined ? sortOrder : existing.sortOrder,
    req.params.id
  )

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  res.json(category)
})

// DELETE /api/categories/:id — 删除分类
router.delete('/:id', authMiddleware, (req, res) => {
  const db = getDb()
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id)
  if (!existing) {
    return res.status(404).json({ message: '分类不存在' })
  }

  const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles WHERE categoryId = ?').get(req.params.id)
  if (articleCount.count > 0) {
    return res.status(400).json({ message: `该分类下有 ${articleCount.count} 篇文章，无法删除` })
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id)
  res.json({ message: '删除成功' })
})

module.exports = router
