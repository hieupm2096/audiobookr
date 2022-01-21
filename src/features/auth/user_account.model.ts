import { AllowNull, Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript'

@Table({ tableName: 'user_account', underscored: true })
export class UserAccount extends Model {
  @PrimaryKey
  @Column
  id?: string

  @Unique
  @AllowNull(false)
  @Column
  username!: string

  @AllowNull(false)
  @Column
  firstName!: string

  @AllowNull(false)
  @Column
  lastName!: string

  @Column
  profilePicture?: string

  @Unique
  @AllowNull(false)
  @Column
  email!: string

  @Column
  password?: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Column
  status?: number
}

UserAccount.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
 
  delete values.password;
  return values;
 };
