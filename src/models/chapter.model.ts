import { Model, AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'
import { Book } from './book.model'

@Table({ tableName: 'chapter' })
export class Chapter extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => Book)
  @Column
  bookId!: string

  @BelongsTo(() => Book)
  book: Book

  @Column
  description?: string

  @Column
  featureImage?: string

  @Column
  coverImage?: string

  @Column
  listenUrl?: string

  @Column
  likeCount?: number

  @Column
  listenCount?: number

  @CreatedAt
  createdAt?: Date

  @UpdatedAt
  updatedAt?: Date

  @Column
  status?: number
}
