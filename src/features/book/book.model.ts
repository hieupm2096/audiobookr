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

@Table({ tableName: 'book' })
export class Book extends Model {
  @PrimaryKey
  @Column
  id?: string

  @AllowNull(false)
  @Column
  name!: string

  @Column
  description?: string

  @Column({ field: 'feature_image' })
  featureImage?: string

  @Column({ field: 'cover_image' })
  coverImage?: string

  @Column({ field: 'listen_url' })
  listenUrl?: string

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

  @BelongsToMany(() => SubCat, () => BookSubCat)
  subCats: SubCat[]

  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[]

  @HasMany(() => Chapter)
  chapters: Chapter[]
}
