import { Chapter } from './chapter.model'

class ChapterService {
  async getChapterList(bookId: string): Promise<Chapter[]> {
    return await Chapter.findAll({ where: { bookId } })
  }

  async getChapter(id: string): Promise<Chapter> {
      return await Chapter.findOne({ where: { id }})
  }

  async chapterExists(id: string): Promise<boolean> {
    const exists = await Chapter.findOne({ where: { id }, attributes: ['id'] })
    return exists != null
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
    if (result[0] == 0) {
      return {} as Chapter
    }
    return result[1][0]
  }
}

export const chapterService = new ChapterService()