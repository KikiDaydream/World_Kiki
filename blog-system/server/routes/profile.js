const express = require('express')
const { getDb } = require('../config/db')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/profile — 公开，获取个人信息
router.get('/', (req, res) => {
  const db = getDb()
  const user = db.prepare(`
    SELECT id, username, nickname, avatar, title, bio, location,
           website, github, twitter, skills
    FROM users WHERE id = 1
  `).get()

  if (!user) {
    return res.status(404).json({ message: '用户不存在' })
  }

  // skills 是 JSON 字符串，解析成数组
  try {
    user.skills = JSON.parse(user.skills || '[]')
  } catch {
    user.skills = []
  }

  // 同时返回文章统计数据
  const articleStats = db.prepare(`
    SELECT
      COUNT(*) as totalArticles,
      COALESCE(SUM(viewCount), 0) as totalViews,
      COALESCE(SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END), 0) as draftCount
    FROM articles
  `).get()

  const categoryStats = db.prepare(`
    SELECT c.id, c.name, c.slug, COUNT(a.id) as count
    FROM categories c
    LEFT JOIN articles a ON a.categoryId = c.id AND a.status = 'published'
    GROUP BY c.id
    ORDER BY c.sortOrder ASC
  `).all()

  res.json({
    ...user,
    stats: articleStats,
    categoryStats,
  })
})

// PUT /api/profile — 需认证，更新个人信息
router.put('/', authMiddleware, (req, res) => {
  const { nickname, avatar, title, bio, location, website, github, twitter, skills } = req.body

  const db = getDb()
  db.prepare(`
    UPDATE users
    SET nickname = ?, avatar = ?, title = ?, bio = ?, location = ?,
        website = ?, github = ?, twitter = ?, skills = ?
    WHERE id = ?
  `).run(
    nickname || '',
    avatar || '',
    title || '',
    bio || '',
    location || '',
    website || '',
    github || '',
    twitter || '',
    JSON.stringify(skills || []),
    req.user.id
  )

  const user = db.prepare(`
    SELECT id, username, nickname, avatar, title, bio, location,
           website, github, twitter, skills
    FROM users WHERE id = ?
  `).get(req.user.id)

  try {
    user.skills = JSON.parse(user.skills || '[]')
  } catch {
    user.skills = []
  }

  res.json(user)
})

module.exports = router
