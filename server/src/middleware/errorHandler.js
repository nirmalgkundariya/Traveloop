export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack)

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that value already exists' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    })
  }

  // Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Max 10MB.' })
  }

  const status = err.status || err.statusCode || 500
  const message = status < 500 ? err.message : 'Internal server error'
  res.status(status).json({ error: message })
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
