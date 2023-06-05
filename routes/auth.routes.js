const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User = require('../models/user')
const { authSchema, loginSchema } = require('../helpers/validationSchema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken
} = require('../helpers/jwtHelper')

router.get('/profile', verifyAccessToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      throw createError.NotFound('User not found')
    }
    res.send(user)
  } catch (error) {
    next(error)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body)
    const doesExist = await User.findOne({
      email: result.email.toLowerCase().trim()
    })
    if (doesExist)
      throw createError.Conflict(`${result.email} is already registered`)

    const user = new User(result)
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser.id)
    const refreshToken = await signRefreshToken(savedUser.id)
    res.send({ accessToken, refreshToken })
  } catch (error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest(error.message))
    }
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body)
    const user = await User.findOne({
      email: result.email.toLowerCase().trim()
    })
    if (!user) {
      throw createError.NotFound('User not registered')
    }

    const isMatchPassword = await user.isValidPassword(result.password)
    if (!isMatchPassword) {
      throw createError.Unauthorized('Username/Password not valid.')
    }

    const accessToken = await signAccessToken(user.id, user.role)
    const refreshToken = await signRefreshToken(user.id)
    const userRole = await user.role
    const userId = await user._id
    res.send({ accessToken, refreshToken, userRole, userId })
  } catch (error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest(error.message))
    }
    next(error)
  }
})

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      throw createError.BadRequest('Refresh token missing')
    }

    const userId = await verifyRefreshToken(refreshToken)

    const accessToken = await signAccessToken(userId)
    const refToken = await signRefreshToken(userId)
    res.send({
      accessToken: accessToken,
      refreshToken: refToken
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createError.BadRequest('Refresh token expired'))
    }
    next(error)
  }
})

module.exports = router
