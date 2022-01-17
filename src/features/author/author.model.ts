import { AllowNull, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript'
import { Book, BookAuthor } from '../book'

@Table({ tableName: 'author' })
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

  @Column({ field: 'feature_image' })
  featureImage?: string

  @Column({ field: 'cover_image' })
  coverImage?: string

  @Column({ field: 'like_count' })
  likeCount?: number

  @Column({ field: 'listen_count' })
  listenCount?: number

  @Column({ field: 'view_count' })
  viewCount?: number

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt?: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt?: Date

  @Column
  status?: number

  @BelongsToMany(() => Book, () => BookAuthor)
  books: Book[]
}
