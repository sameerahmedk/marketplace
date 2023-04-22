import { Router } from 'express'
import { BadRequest, Conflict, NotFound, Unauthorized } from 'http-errors'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../helpers/jwtHelper'
import { authSchema, loginSchema } from '../helpers/validationSchema'
import User, { findOne } from '../models/user'
const router = Router()

router.post('/register', async (req, res, next) => {
  //res.send("Register route")
  try {
    const result = await authSchema.validateAsync(req.body)
    const doesExist = await findOne({
      email: result.email
    })
    if (doesExist) throw Conflict(`${result.email} is already registered`)

    const user = new User(result)
    const savedUser = await user.save()
    const accessToken = await signAccessToken(savedUser.id)
    const refreshToken = await signRefreshToken(savedUser.id)
    res.send({ accessToken, refreshToken })
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  //res.send("Login route")
  try {
    const result = await loginSchema.validateAsync(req.body)
    const user = await findOne({
      email: result.email
    })
    if (!user) throw NotFound('User not registered')

    const isMatchPassword = await user.isValidPassword(result.password)
    //const isMatchEmail = await user.isValidEmail(result.email)
    if (!isMatchPassword) throw Unauthorized('Username/Password not valid.')

    const accessToken = await signAccessToken(user.id)
    const refreshToken = await signRefreshToken(user.id)
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })

    res.setHeader(
      'Set-Cookie',
      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true
      })
    )
    await res.send({ accessToken, refreshToken })

    await res.send(result)
  } catch (error) {
    if (error.isJoi === true)
      return next(BadRequest('Invalid Username/Password'))
    next(error)
  }
})

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw BadRequest()
    const userId = await verifyRefreshToken(refreshToken)

    const accessToken = await signAccessToken(userId)
    const refToken = await signRefreshToken(userId)
    res.send({
      accessToken: accessToken,
      refreshToken: refToken
    })
  } catch (error) {
    next(error)
  }
})

export default router
