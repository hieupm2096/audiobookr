import {
  AllowNull,
  Model,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsToMany,
} from 'sequelize-typescript'
import { Book, BookSubCat } from '../book'
import { Category } from '../category'

@Table({ tableName: 'sub_cat', underscored: true })
export class SubCat extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => Category)
  @Column
  categoryId!: string

  @BelongsTo(() => Category)
  category: Category

  @Column
  description?: string

  @Column
  slug?: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Column
  status?: number

  @BelongsToMany(() => Book, () => BookSubCat)
  books: Book[]
}
