import { AllowNull, Model , BelongsTo, Column, ForeignKey, PrimaryKey, Table, CreatedAt, UpdatedAt } from "sequelize-typescript"
import { Category } from "./category.model"

@Table({ tableName: 'sub_cat' })
export class SubCat extends Model {
    @PrimaryKey
    @Column
    id?: string

    @AllowNull(false)
    @Column
    name!: string

    @ForeignKey(() => Category)
    @Column
    catId!: string

    @BelongsTo(() => Category)
    category: Category

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