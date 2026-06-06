function errorHandler(err, req, res, next) {
  console.error('Server Error:', err)

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({ message: '数据冲突，请检查输入' })
  }

  res.status(err.status || 500).json({
    message: err.message || '服务器内部错误',
  })
}

module.exports = { errorHandler }
