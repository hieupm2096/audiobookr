import { Category } from '../models/category.model'
import { SubCat } from '../models/subcat.model'

export class SubCatService {
  async getSubCatList(catId?: string) {
    if (!catId) {
      return await SubCat.findAll({ include: Category })
    }
    return await SubCat.findAll({ where: { catId }, include: Category })
  }

  async getSubCat(id: string) {
    return await SubCat.findOne({ include: Category, where: { id } })
  }

  async createSubCat(model: { name: string; catId: string; description: string; slug: string }) {
    const subcat = new SubCat(model)

    const result = await subcat.save({ fields: ['name', 'catId', 'description', 'slug'] })

    return result
  }
}
