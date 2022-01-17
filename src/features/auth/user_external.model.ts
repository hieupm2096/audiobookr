import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript'
import { UserAccount } from './user_account.model'

@Table({ tableName: 'user_external' })
export class UserExternal extends Model {
  @PrimaryKey
  @Column
  id?: string

  @ForeignKey(() => UserAccount)
  @Column({ field: 'user_account_id'})
  userAccountId?: string

  
}
