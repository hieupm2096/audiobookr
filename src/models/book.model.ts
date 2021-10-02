import { Table, Model, PrimaryKey, Column, AllowNull, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import { SubCat } from './subcat.model';

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