import { Table, Model, Column, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript'

@Table({ tableName: 'category' })
export class Category extends Model {
    @PrimaryKey
    @Column
    id?: string

    @Column
    name!: string

    @Column
    description?: string

    @Column
    slug!: string

    @CreatedAt
    createdAt?: Date

    @UpdatedAt
    updatedAt?: Date

    @Column
    status?: number
}

