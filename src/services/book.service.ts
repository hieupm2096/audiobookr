import { SubCat } from '../models/subcat.model'
import { Book } from '../models/book.model'

export class BookService {
  async getBookList(subCatId?: string): Promise<Book[]> {
    if (!subCatId) {
      return Book.findAll({ include: SubCat })
    }
    return Book.findAll({ include: SubCat, where: { subCatId } })
  }

  async getBook(id: string): Promise<Book> {
    return Book.findOne({ include: SubCat, where: { id } })
  }

  async createBook(model: {
    name: string
    subCatId: string
    description: string
    featureImage?: string
    coverImage?: string
    listenUrl?: string
  }): Promise<Book> {
    const book = new Book(model)

    const result = await book.save({
      fields: ['name', 'subCatId', 'description', 'featureImage', 'coverImage', 'listenUrl'],
    })

    return result
  }

  async updateBook(
    id: string,
    model: {
      name?: string
      subCatId?: string
      description?: string
      featureImage?: string
      coverImage?: string
      listenUrl?: string
      status?: number
    },
  ): Promise<Book> {
    const result = await Book.update(model, { where: { id }, returning: true })
    return result[1][0]
  }
}
