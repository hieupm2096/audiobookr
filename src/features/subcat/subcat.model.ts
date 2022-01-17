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

@Table({ tableName: 'sub_cat' })
export class SubCat extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => Category)
  @Column({ field: 'category_id' })
  categoryId!: string

  @BelongsTo(() => Category)
  category: Category

  @Column
  description?: string

  @Column
  slug?: string

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt?: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt?: Date

  @Column
  status?: number

  @BelongsToMany(() => Book, () => BookSubCat)
  books: Book[]
}
