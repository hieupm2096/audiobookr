import { Category } from '../models/category.model'
import { SubCat } from '../models/subcat.model'

export class SubCatService {
  async getSubCatList(catId?: string): Promise<SubCat[]> {
    if (!catId) {
      return SubCat.findAll({ include: Category })
    }
    return SubCat.findAll({ where: { catId }, include: Category })
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
