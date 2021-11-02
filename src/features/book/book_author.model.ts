import { Column, ForeignKey, Table, Model } from 'sequelize-typescript'
import { Book } from '.'
import { Author } from '../author'

@Table({ tableName: 'book_author', timestamps: false })
export class BookAuthor extends Model {
  @ForeignKey(() => Book)
  @Column
  bookId: string

  @ForeignKey(() => Author)
  @Column
  authorId: string
}
