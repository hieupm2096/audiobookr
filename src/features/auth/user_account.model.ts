import { AllowNull, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'

@Table({ tableName: 'user_account' })
export class UserAccount extends Model {
  @PrimaryKey
  @Column
  id?: string

  @Column
  username!: string

  @AllowNull(false)
  @Column({ field: 'first_name' })
  firstName!: string

  @AllowNull(false)
  @Column({ field: 'last_name' })
  lastName!: string

  @Column({ field: 'profile_picture' })
  profilePicture?: string

  @AllowNull(false)
  @Column({ field: 'email' })
  email!: string

  @Column
  password?: string

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt?: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt?: Date

  @Column
  status?: number
}
