import { AllowNull, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import { Book, BookAuthor } from '../book';

@Table({ tableName: 'author' })
export class Author extends Model {
    @PrimaryKey
    @Column
    id?: string

    @AllowNull(false)
    @Column
    name!: string

    @Column
    description?: string

    @Column
    dob?: Date

    @Column
    featureImage?: string

    @Column
    coverImage?: string

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

    @BelongsToMany(() => Book, () => BookAuthor)
    books: Book[]
}