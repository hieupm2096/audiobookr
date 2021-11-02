import { Book } from '../book'
import { Category } from '../category'
import { SubCat } from './subcat.model'

class SubCatService {
  async getSubCatList(catId?: string): Promise<SubCat[]> {
    if (!catId) {
      return await SubCat.findAll({
        include: [
          { model: Category, attributes: ['id', 'name'] },
          { model: Book, attributes: ['id', 'name'], through: { attributes: [] } },
        ],
      })
    }
    return await SubCat.findAll({
      where: { catId },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Book, attributes: ['id', 'name'], through: { attributes: [] } },
      ],
    })
  }

  async getSubCat(id: string): Promise<SubCat> {
    return await SubCat.findOne({
      where: { id },
      include: [
        { model: Category, attributes: ['id', 'name'] },
        { model: Book, through: { attributes: [] } },
      ],
    })
  }

  async validateSubCatIdList(ids: string[]): Promise<boolean> {
    const result = await SubCat.findAll({ attributes: ['id'], where: { id: ids } })
    return result.length == ids.length
  }

  async subcatIdExists(id: string): Promise<boolean> {
    const exists = await SubCat.findOne({ where: { id }, attributes: ['id'] })
    return exists != null
  }

  async createSubCat(model: { name: string; catId: string; description: string; slug: string }): Promise<SubCat> {
    const subcat = new SubCat(model)

    const result = await subcat.save({ fields: ['name', 'catId', 'description', 'slug'] })

    return result
  }
}

export const subCatService = new SubCatService()
