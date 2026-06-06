const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'blog-system-secret-key-2026'
const JWT_EXPIRES_IN = '7d'

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未登录或 Token 已过期' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token 无效或已过期' })
  }
}

module.exports = { generateToken, authMiddleware, JWT_SECRET }
