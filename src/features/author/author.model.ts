import { AllowNull, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'
import { Book, BookAuthor } from '../book'

@Table({ tableName: 'author', underscored: true })
export class Author extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @Column
  description?: string

  @Column
  dob?: Date

  @Column
  featureImage?: string

  @Column
  coverImage?: string

  @Column
  likeCount?: number

  @Column
  listenCount?: number

  @Column
  viewCount?: number

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Column
  status?: number

  @BelongsToMany(() => Book, () => BookAuthor)
  books: Book[]
}
