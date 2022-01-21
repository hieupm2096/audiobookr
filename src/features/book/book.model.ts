import {
  Table,
  Model,
  PrimaryKey,
  Column,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript'
import { BookAuthor, BookSubCat } from '.'
import { Author } from '../author'
import { Chapter } from '../chapter'
import { SubCat } from '../subcat'

@Table({ tableName: 'book', underscored: true })
export class Book extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

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

  @BelongsToMany(() => SubCat, () => BookSubCat)
  subCats: SubCat[]

  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[]

  @HasMany(() => Chapter)
  chapters: Chapter[]
}
