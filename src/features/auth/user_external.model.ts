import { BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'
import { UserAccount } from './user_account.model'

@Table({ tableName: 'user_external', underscored: true })
export class UserExternal extends Model {
  @PrimaryKey
  @Column
  id?: string

  @ForeignKey(() => UserAccount)
  @Column
  userAccountId?: string

  @BelongsTo(() => UserAccount)
  userAccount: UserAccount

  @Column
  authProvider!: string

  @Column
  externalUserId?: string

  @Column
  name?: string

  @Column
  firstName!: string

  @Column
  lastName!: string

  @Column
  email!: string

  @Column
  profilePicture?: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date
}
