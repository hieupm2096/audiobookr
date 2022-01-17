import {
  Model,
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Book } from '../book'

@Table({ tableName: 'chapter' })
export class Chapter extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @ForeignKey(() => Book)
  @Column({ field: 'book_id' })
  bookId!: string

  @BelongsTo(() => Book)
  book: Book

  @Column
  description?: string

  @Column({ field: 'feature_image' })
  featureImage?: string

  @Column({ field: 'cover_image' })
  coverImage?: string

  @Column({ field: 'listen_url' })
  listenUrl?: string

  @Column({ field: 'listen_count' })
  listenCount?: number

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt?: Date

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt?: Date

  @Column
  status?: number
}
