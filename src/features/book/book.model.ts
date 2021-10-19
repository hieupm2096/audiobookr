import {
  Table,
  Model,
  PrimaryKey,
  Column,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript'
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

  @ForeignKey(() => SubCat)
  @Column
  subCatId!: string

  @BelongsTo(() => SubCat)
  subCat: SubCat

  @ForeignKey(() => Author)
  @Column
  authorId!: string

  @BelongsTo(() => Author)
  author: Author

  @HasMany(() => Chapter)
  chapters: Chapter[]

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
  createdAt?: Date

  @UpdatedAt
  updatedAt?: Date

  @Column
  status?: number
}
