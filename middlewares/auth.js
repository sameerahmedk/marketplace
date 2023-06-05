const { verifyAccessToken } = require('../helpers/jwtHelper')

const authMiddleware = async (req, res, next) => {
  try {
    const payload = await verifyAccessToken(req, res, next)
    req.user = payload // Set the user object with the payload
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authMiddleware
