import { Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript'

@Table({ tableName: 'user_token', underscored: true })
export class UserToken extends Model {
    @PrimaryKey
    @Column
    id?: string

    @Unique
    @Column
    userAccountId!: string

    @Column
    refreshToken!: string

    @Column
    validUntil!: Date

    @CreatedAt
    @Column
    createdAt?: Date

    @UpdatedAt
    @Column
    updatedAt?: Date
}
