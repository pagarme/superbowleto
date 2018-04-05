const redirectHttp = (req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production'
  const isNotHttps = req.header('X-Forwarded-Proto') !== 'https'

  if (isNotHttps && isProduction) {
    return res.redirect(`https://${req.host}${req.originalUrl}`)
  }
  return next()
}

module.exports = redirectHttp
