import { Category } from '../models/category.model'

export class CategoryService {
  async getCategoryList(): Promise<Category[]> {
    return Category.findAll()
  }

  async getCategory(id: string): Promise<Category> {
    return Category.findOne({ where: { id } })
  }

  async createCategory(model: { name: string; description: string; slug: string }): Promise<Category> {
    const category = new Category(model)

    const result = await category.save({ fields: ['name', 'description', 'slug'] })

    return result
  }
}
