import { Category } from '../models/category.model'

export class CategoryService {
    async getCategoryList() {
        return await Category.findAll()
    }

    async getCategory(id: string) {
        return await Category.findOne({ where: { id } })
    }

    async createCategory(name: string, description: string, slug: string) {
        const category = new Category({ name, description, slug })

        const result = await category.save({ fields: ['name', 'description', 'slug'] })

        return result
    }
}