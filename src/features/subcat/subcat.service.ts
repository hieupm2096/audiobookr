import { Category } from '../category'
import { SubCat } from './subcat.model'

class SubCatService {
  async getSubCatList(catId?: string): Promise<SubCat[]> {
    if (!catId) {
      return await SubCat.findAll({ include: Category })
    }
    return await SubCat.findAll({ where: { catId }, include: Category })
  }

  async getSubCat(id: string): Promise<SubCat> {
    return SubCat.findOne({ include: Category, where: { id } })
  }

  async createSubCat(model: { name: string; catId: string; description: string; slug: string }): Promise<SubCat> {
    const subcat = new SubCat(model)

    const result = await subcat.save({ fields: ['name', 'catId', 'description', 'slug'] })

    return result
  }
}

export const subCatService = new SubCatService()