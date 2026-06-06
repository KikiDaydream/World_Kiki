const express = require('express')
const cors = require('cors')
const compression = require('compression')
const path = require('path')
const { errorHandler } = require('./middleware/errorHandler')
const authRoutes = require('./routes/auth')
const articleRoutes = require('./routes/articles')
const categoryRoutes = require('./routes/categories')
const profileRoutes = require('./routes/profile')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API 路由
app.use('/api/auth', authRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/profile', profileRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// 提供前端静态文件（生产构建的 dist 目录）
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// SPA 路由回退：非 API 请求返回 index.html
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'))
  }
})

// 错误处理
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Frontend: http://localhost:${PORT}`)
  console.log(`API: http://localhost:${PORT}/api/health`)
})
