import { Router } from 'express'
import { body, CustomValidator, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { authService } from './auth.service'
import jwt from 'jsonwebtoken'

export const authRouter = Router()

const isValidUsername: CustomValidator = async (username: string) => {
  const exists = await authService.usernameExists(username)
  if (exists) return Promise.reject('Username already exists')
}

const issueToken = async (userId: string) => {
  const jwtSecret = process.env.JWT_SECRET

  const accessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' })

  const result = await authService.updateUserToken(userId)

  return { accessToken, refreshToken: result.refreshToken }
}

// POST: /login
const loginValidations: ValidationChain[] = [body('username').notEmpty(), body('password').notEmpty()]

authRouter.post('/login', validate(loginValidations), async (req, res) => {
  try {
    const { username, password } = req.body
    const result = await authService.getUserAccount(username, password)

    if (result == null) return res.status(401).json({ message: 'Incorrect username or password' })

    const token = await issueToken(result.id)

    return res.status(200).json({ message: 'success', data: { profile: result, token } })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /signup
const signUpValidations: ValidationChain[] = [
  body('email').isEmail(),
  body('firstName').isAlpha(),
  body('lastName').isAlpha(),
  body('username').notEmpty().bail().custom(isValidUsername),
  body('password').notEmpty().bail().isLength({ min: 6 }),
]

authRouter.post('/signup', validate(signUpValidations), async (req, res) => {
  try {
    const result = await authService.createNormalUserAccount(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /auth/token - re-issue token
const reIssueTokenValidations: ValidationChain[] = [body('refreshToken').isUUID(), body('id').isUUID()]
authRouter.post('/auth/token', validate(reIssueTokenValidations), async (req, res) => {
  try {
    const { id, refreshToken } = req.body

    const result = await authService.getUserToken(id)

    console.log(result.validUntil)
    console.log(new Date())
    console.log(result.validUntil > new Date())

    if (result.refreshToken != refreshToken || result.validUntil < new Date()) {
      return res.status(400).json({ message: 'invalid token' })
    }

    const token = await issueToken(id)

    return res.status(200).json({ message: 'success', data: token })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
