import { Router } from 'express'
import { body, CustomValidator, param, ValidationChain } from 'express-validator'
import { isAlphaWithUnicode, validate } from '../../externals/validation/express-validator'
import { authService } from '.'
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
  body('firstName').optional().custom(isAlphaWithUnicode),
  body('lastName').optional().custom(isAlphaWithUnicode),
  body('username').notEmpty().bail().custom(isValidUsername),
  body('profilePicture').optional().isURL(),
  body('password').notEmpty().bail().isLength({ min: 6 }),
]

authRouter.post('/signup', validate(signUpValidations), async (req, res) => {
  try {
    const result = await authService.createUserAccount(req.body)
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

// POST: /auth/facebook
const facebookValidations: ValidationChain[] = [
  body('facebookId').notEmpty(),
  body('email').isEmail(),
  body('firstName').optional().custom(isAlphaWithUnicode),
  body('lastName').optional().custom(isAlphaWithUnicode),
  body('profilePicture').optional().isURL(),
]
authRouter.post('/auth/facebook', validate(facebookValidations), async (req, res) => {
  try {
    const { facebookId, email, firstName, lastName } = req.body

    const userExternal = await authService.getUserExternalByExternalId(facebookId)

    // new user external
    if (!userExternal) {
      // get user account by email
      const userAccount = await authService.getUserAccountByEmail(email)
      const userAccountId = userAccount?.id

      // create user external and link to user account (if already exists)
      const createdUserExternal = await authService.createUserExternal({
        authProvider: 'facebook',
        email,
        userAccountId,
        externalUserId: facebookId,
        firstName,
        lastName,
      })

      if (!userAccount) {
        // return external user id and request create user account
        return res.status(200).json({ message: 'success', data: { id: createdUserExternal.id, requestCreate: true } })
      }

      const token = await issueToken(userAccountId)

      return res.status(200).json({ message: 'success', data: { profile: userAccount, token, merged: true } })
    }

    const userAccount = await authService.getUserAccountByEmail(userExternal.email)

    // user external exists, but no user account (user hasn't finished request create user account)
    if (!userAccount) {
      // return request create user account
      return res
        .status(200)
        .json({ message: 'success', data: { id: userExternal.externalUserId, requestCreate: true } })
    }

    // edge case, it should not happen, user hasn't linked account
    if (userAccount.id != userExternal.userAccountId) {
      // update user external
      userExternal.userAccountId = userAccount.id
      await userExternal.save() // not clean, but convenient
    }

    const token = await issueToken(userAccount.id)
    return res.status(200).json({ message: 'success', data: { profile: userAccount, token } })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /signup/:userExternalId
const signUpExternalValidations: ValidationChain[] = [
  param('userExternalId').isUUID().bail(),
  body('username').notEmpty().bail().custom(isValidUsername),
  body('password').notEmpty().bail().isLength({ min: 6 }),
]

authRouter.post('/signup/:userExternalId', validate(signUpExternalValidations), async (req, res) => {
  try {
    const userExternalId = req.params.userExternalId
    const { username, password } = req.body
    const userExternal = await authService.getUserExternalById(userExternalId)

    if (!userExternal) {
      return res.status(400).json({ message: 'Invalid id' })
    }

    const createdUserAccount = await authService.createUserAccount({
      email: userExternal.email,
      username,
      password,
      firstName: userExternal.firstName,
      lastName: userExternal.lastName,
    })

    // update user external
    userExternal.userAccountId = createdUserAccount.id

    await userExternal.save() // not clean, but convenient

    return res.status(200).json({ message: 'success', data: createdUserAccount })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
