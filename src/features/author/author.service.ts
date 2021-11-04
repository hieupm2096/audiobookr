import { Author } from '.'
import { Book } from '../book'

class AuthorService {
  async getAuthorList(): Promise<Author[]> {
    return await Author.findAll({ include: { model: Book, through: { attributes: [] } } })
  }

  async authorIdExists(id: string) {
    return await Author.findByPk(id, { attributes: ['id'] })
  }

  async validateAuthorIdList(ids: string[]): Promise<boolean> {
    const result = await Author.findAll({ attributes: ['id'], where: { id: ids } })
    return result.length == ids.length
  }

  async getAuthor(id: string) {
    return await Author.findByPk(id, { include: { model: Book, through: { attributes: [] } } })
  }

  async createAuthor(model: {
    name: string
    description?: string
    dob?: Date
    featureImage?: string
    coverImage?: string
  }): Promise<Author> {
    const author = new Author(model)

    const result = await author.save({ fields: ['name', 'description', 'dob', 'featureImage', 'coverImage'] })

    return result
  }

  async updateAuthor(
    id: string,
    model: {
      name: string
      description?: string
      dob?: Date
      featureImage?: string
      coverImage?: string
    },
  ): Promise<Author> {
    const result = await Author.update(model, { where: { id }, returning: true })

    if (result[0] == 0) {
      return {} as Author
    }
    return result[1][0]
  }
}

export const authorService = new AuthorService()
