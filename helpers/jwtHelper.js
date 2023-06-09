const JWT = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
  signAccessToken: (userId, userRole) => {
    return new Promise((resolve, reject) => {
      const payload = {
        aud: userId.toString(),
        userRole: userRole
      }
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '1w',
        issuer: 'dastgyr.com'
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1].toString()
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(createError.Unauthorized())
        } else {
          return next(createError.Unauthorized(err.message))
        }
      }
      // add a check to ensure the payload contains the expected values
      if (!payload.aud || !payload.iss || !payload.userRole) {
        return next(createError.Unauthorized())
      }
      req.user = {
        id: payload.aud,
        role: payload.userRole
      }
      next()
    })
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '2w',
        issuer: 'dastgyr.com',
        audience: userId.toString()
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message)
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized())
          const userId = payload.aud
          if (!userId) {
            return reject(createError.Unauthorized())
          }
          resolve(userId)
        }
      )
    })
  }
}
