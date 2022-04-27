import { sequelize } from '../../externals/networking/sequelize'
import { Pagination } from '../../../types/express/pagination'
import { Author } from '../author'
import { Chapter } from '../chapter'
import { SubCat } from '../subcat'
import { Book } from './book.model'
import { Sequelize } from 'sequelize-typescript'
import { Op, WhereOptions } from 'sequelize'

class BookService {
  async getBookList(subCatId?: string, keywords?: string, pagination?: Pagination): Promise<Book[]> {
    let subCatWhere: WhereOptions
    let keywordsWhere: WhereOptions
    const combinedWhere: WhereOptions[] = []

    if (subCatId != null) {
      // using Sequelize.col instead of string to specify column name
      subCatWhere = Sequelize.where(Sequelize.col('subCats.id'), subCatId)
    }

    if (keywords != null && keywords.length > 0) {
      // lowercase and remove accents
      const normalizedKeywords = keywords
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      keywordsWhere = {
        [Op.or]: [
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('Book.name')), {
            [Op.iLike]: `%${normalizedKeywords}%`,
          }),
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('authors.name')), {
            [Op.iLike]: `%${normalizedKeywords}%`,
          }),
        ],
      }
    }

    if (subCatWhere != null) {
      combinedWhere.push(subCatWhere)
    }
    if (keywordsWhere != null) {
      combinedWhere.push(keywordsWhere)
    }

    return await Book.findAll({
      include: [
        { model: SubCat, attributes: ['id', 'name'], through: { attributes: [] }, subQuery: false },
        { model: Author, attributes: ['id', 'name'], through: { attributes: [] }, subQuery: false },
      ],
      where: {
        [Op.and]: combinedWhere,
      },
      subQuery: false,
      limit: pagination?.limit,
      offset: pagination?.skip,
      order: pagination?.sort != null ? [[pagination.sort.key, pagination.sort.order]] : [],
    })
  }

  async getBook(id: string): Promise<Book> {
    return await Book.findByPk(id, {
      include: [
        { model: SubCat, attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Author, attributes: ['id', 'name'], through: { attributes: [] } },
        { model: Chapter },
      ],
    })
  }

  async bookIdExists(id: string): Promise<boolean> {
    const result = await Book.findByPk(id, { attributes: ['id'] })
    return result != null
  }

  async createBook(model: {
    name: string
    subCatIds: string[]
    authorIds: string[]
    description?: string
    featureImage?: string
    coverImage?: string
    listenUrl?: string
  }): Promise<Book> {
    const authors = model.authorIds.map((id) => new Author({ id }))

    const subCats = model.subCatIds.map((id) => new SubCat({ id }))

    const book = new Book(model)

    const transaction = await sequelize.transaction()

    try {
      const createdBook = await book.save({
        fields: ['name', 'description', 'feature_image', 'cover_image', 'listen_url'],
        transaction,
      })

      await Promise.all([
        createdBook.$set('subCats', subCats, { transaction }),
        createdBook.$set('authors', authors, { transaction }),
      ])

      await transaction.commit()

      const result = await this.getBook(createdBook.id)

      return result
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }

  async updateBook(
    id: string,
    model: {
      name?: string
      subCatIds?: string[]
      authorIds?: string[]
      description?: string
      featureImage?: string
      coverImage?: string
      listenUrl?: string
      status?: number
    },
  ): Promise<Book> {
    const authors = model.authorIds?.map((id) => new Author({ id })) ?? []

    const subCats = model.subCatIds?.map((id) => new SubCat({ id })) ?? []

    const transaction = await sequelize.transaction()

    const book = await this.getBook(id)

    book.name = model.name ?? book.name
    book.description = model.description ?? book.description
    book.featureImage = model.featureImage ?? book.featureImage
    book.coverImage = model.coverImage ?? book.coverImage
    book.listenUrl = model.listenUrl ?? book.listenUrl
    book.status = model.status ?? book.status

    const promises: Promise<unknown>[] = [book.save({ transaction })]

    if (subCats.length > 0) {
      promises.push(book.$set('subCats', subCats, { transaction }))
    }

    if (authors.length > 0) {
      promises.push(book.$set('authors', authors, { transaction }))
    }

    try {
      await Promise.all(promises)

      await transaction.commit()

      const result = await this.getBook(book.id)

      return result
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}

export const bookService = new BookService()
