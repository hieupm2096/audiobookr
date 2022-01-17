import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import { Book } from '.'
import { SubCat } from '../subcat'

@Table({ tableName: 'book_sub_cat', timestamps: false })
export class BookSubCat extends Model {
  @ForeignKey(() => Book)
  @Column({ field: 'book_id' })
  bookId: string

  @ForeignKey(() => SubCat)
  @Column({ field: 'sub_cat_id' })
  subCatId: string
}
