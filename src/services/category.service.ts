import { Category } from '../models/category.model'

export class CategoryService {
    getCategoryList() {
        return Category.findAll()
    }
}