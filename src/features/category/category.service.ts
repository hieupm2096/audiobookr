import { Category } from './category.model'

class CategoryService {
  async getCategoryList(): Promise<Category[]> {
    return await Category.findAll()
  }

  async getCategory(id: string): Promise<Category> {
    return await Category.findOne({ where: { id } })
  }

  async createCategory(model: { name: string; description: string; slug: string }): Promise<Category> {
    const category = new Category(model)

    const result = await category.save({ fields: ['name', 'description', 'slug'] })

    return result
  }
}

export const categoryService = new CategoryService()
