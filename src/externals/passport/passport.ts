import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { authService } from '../../features/auth/auth.service'
import express from 'express'

const JWT_SECRET = process.env.JWT_SECRET

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      const expire = new Date(jwtPayload.exp * 1000)

      if (expire < new Date()) {
        return done(null, false)
      }

      const userAccountId = jwtPayload.id

      if (!userAccountId) {
        return done(null, false)
      }

      const result = await authService.userAccountIdExists(userAccountId)

      return done(null, result)
    },
  ),
)

export const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'unauthenticated' })
    }
    return next()
  })(req, res, next)
  /* passport.authentication returns a function,
  we invoke it with normal req..res arguments 
  to override default functionality */
}
