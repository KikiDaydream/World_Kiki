const express = require('express')
const bcrypt = require('bcryptjs')
const { getDb } = require('../config/db')
const { generateToken } = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: '请输入用户名和密码' })
  }

  const db = getDb()
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  const valid = bcrypt.compareSync(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  const token = generateToken(user)
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
    },
  })
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录' })
  }

  const jwt = require('jsonwebtoken')
  const { JWT_SECRET } = require('../middleware/auth')

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET)
    const db = getDb()
    const user = db.prepare('SELECT id, username, nickname, avatar FROM users WHERE id = ?').get(decoded.id)
    if (!user) return res.status(404).json({ message: '用户不存在' })
    res.json(user)
  } catch {
    res.status(401).json({ message: 'Token 无效' })
  }
})

module.exports = router
