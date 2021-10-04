import { Chapter } from '../models/chapter.model'

export class ChapterService {
  async getChapterList(bookId: string): Promise<Chapter[]> {
    return Chapter.findAll({ where: { bookId } })
  }

  async getChapter(id: string): Promise<Chapter> {
      return Chapter.findOne({ where: { id }})
  }

  async createChapter(model: {
    name: string
    bookId: string
    description: string
    featureImage?: string
    coverImage?: string
    listenUrl?: string
  }): Promise<Chapter> {
    const chapter = new Chapter(model)

    const result = await chapter.save({
      fields: ['name', 'bookId', 'description', 'featureImage', 'coverImage', 'listenUrl'],
    })

    return result
  }

  async updateChapter(
    id: string,
    model: {
      name?: string
      description?: string
      featureImage?: string
      coverImage?: string
      listenUrl?: string
      status?: number
    },
  ): Promise<Chapter> {
    const result = await Chapter.update(model, { where: { id }, returning: true })
    return result[1][0]
  }
}
