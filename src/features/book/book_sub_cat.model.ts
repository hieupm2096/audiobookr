import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Book } from '.'
import { SubCat } from '../subcat'

@Table({ tableName: 'book_sub_cat', timestamps: false })
export class BookSubCat extends Model {
  @ForeignKey(() => Book)
  @Column
  bookId: string

  @ForeignKey(() => SubCat)
  @Column
  subCatId: string
}
