import { Column, ForeignKey, Table, Model } from 'sequelize-typescript'
import { Book } from '.'
import { Author } from '../author'

@Table({ tableName: 'book_author', timestamps: false })
export class BookAuthor extends Model {
  @ForeignKey(() => Book)
  @Column({ field: 'book_id' })
  bookId: string

  @ForeignKey(() => Author)
  @Column({ field: 'author_id' })
  authorId: string
}
