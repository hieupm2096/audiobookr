import { Table, Model, Column, CreatedAt, UpdatedAt, PrimaryKey, HasMany } from 'sequelize-typescript'
import { SubCat } from '../subcat/subcat.model'

@Table({ tableName: 'category', underscored: true })
export class Category extends Model {
  @PrimaryKey
  @Column
  id?: string

  @Column
  name!: string

  @Column
  description?: string

  @Column
  slug?: string

  @CreatedAt
  @Column
  createdAt?: Date

  @UpdatedAt
  @Column
  updatedAt?: Date

  @Column
  status?: number

  @HasMany(() => SubCat)
  subcats: SubCat[]
}
