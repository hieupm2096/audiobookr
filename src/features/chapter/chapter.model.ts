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

@Table({ tableName: 'chapter', underscored: true })
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
  listenCount?: number

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Column
  status?: number
}
