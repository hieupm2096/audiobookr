import { AllowNull, Model , BelongsTo, Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript"
import { Category } from "./category.model"

@Table({ tableName: 'sub_cat' })
export class SubCat extends Model {
    @PrimaryKey
    @Column
    id: string

    @AllowNull(false)
    @Column
    name: string

    @ForeignKey(() => Category)
    @Column
    catId: string

    @BelongsTo(() => Category)
    category: Category
}