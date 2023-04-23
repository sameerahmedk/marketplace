const { verifyAccessToken } = require('../helpers/jwt_helper')

const authMiddleware = async (req, res, next) => {
  try {
    await verifyAccessToken(req, res, next)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
