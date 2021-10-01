import { Router } from 'express'
import { body, validationResult } from 'express-validator'
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

categoryRouter.post(
    '/category',
    body('name').notEmpty(),
    body('slug').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const { name, description, slug } = req.body
            const result = await categoryService.createCategory(name, description, slug)
            return res.status(200).json({ message: 'success', data: result })
        } catch (e) {
            console.log('error: ' + e.message)
            res.status(500).json({ message: e.message })
        }
    }
)
