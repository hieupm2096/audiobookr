import { UserAccount } from './user_account.model'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { UserExternal, UserToken } from '.'
import dayjs from 'dayjs'

class AuthService {
  async getUserAccount(username: string, password: string): Promise<UserAccount | null> {
    // get user from db
    const user = await UserAccount.findOne({ where: { username } })

    // compare password
    const isIdentical = await bcrypt.compare(password, user.password)

    return isIdentical ? user : null
  }

  async getUserAccountByEmail(email: string): Promise<UserAccount> {
    const user = await UserAccount.findOne({ where: { email } })
    return user
  }

  async usernameExists(username: string): Promise<boolean> {
    const count = await UserAccount.count({ where: { username } })
    return count > 0
  }

  async userAccountIdExists(id: string): Promise<boolean> {
    const count = await UserAccount.count({ where: { id } })
    return count > 0
  }

  async createUserAccount(model: {
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
  }): Promise<UserAccount> {
    const userAccount = new UserAccount(model)

    const hashedPassword = await bcrypt.hash(model.password, 10)

    userAccount.password = hashedPassword

    const result = await userAccount.save({
      fields: ['username', 'password', 'email', 'firstName', 'lastName', 'profilePicture'],
    })
    return result
  }

  async updateUserToken(userAccountId: string): Promise<UserToken> {
    const refreshToken = uuidv4()

    const result = await UserToken.upsert({ userAccountId, refreshToken, validUntil: dayjs().add(7, 'day') })

    return result[0]
  }

  async getUserToken(userAccountId: string): Promise<UserToken> {
    const result = await UserToken.findOne({ where: { userAccountId } })
    return result
  }

  async getUserExternalByExternalId(externalUserId: string): Promise<UserExternal> {
    const result = await UserExternal.findOne({ where: { externalUserId } })
    return result
  }

  async getUserExternalById(id: string): Promise<UserExternal> {
    const result = await UserExternal.findOne({ where: { id } })
    return result
  }

  async createUserExternal(model: {
    authProvider: string
    userAccountId?: string
    externalUserId: string
    firstName: string
    lastName: string
    email: string
    profilePicture?: string
  }) {
    const userExternal = new UserExternal(model)

    const result = await userExternal.save({
      fields: ['authProvider', 'userAccountId', 'externalUserId', 'email', 'firstName', 'lastName', 'profilePicture'],
    })

    return result
  }
}

export const authService = new AuthService()
