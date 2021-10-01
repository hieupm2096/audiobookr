import { Router } from 'express'
import { Category } from '../models/category.model'
import { CategoryService } from '../services/category.service'

export const categoryRouter = Router()
const categoryService = new CategoryService()

categoryRouter.get('/category', async (req, res) => {
    try {
        const categories: Category[] = await categoryService.getCategoryList()
        res.status(200).json({ message: 'success', data: categories })
    } catch (e) {
        console.log('error: ' + e.message)
        res.status(500).json({ message: e.message })
    }
})
