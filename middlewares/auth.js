const { verifyAccessToken } = require('../helpers/jwtHelper')

const authMiddleware = async (req, res, next) => {
  try {
    await verifyAccessToken(req, res, next)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
