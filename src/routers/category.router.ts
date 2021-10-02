import { Router } from 'express'
import { body, ValidationChain, validationResult } from 'express-validator'
import { validate } from '../cores/validation/express-validator'
import { Category } from '../models/category.model'
import { CategoryService } from '../services/category.service'

export const categoryRouter = Router()
const categoryService = new CategoryService()

// GET: /category
categoryRouter.get('/category', async (req, res) => {
  try {
    const categories: Category[] = await categoryService.getCategoryList()
    res.status(200).json({ message: 'success', data: categories })
  } catch (e) {
    console.log('error: ' + e.message)
    res.status(500).json({ message: e.message })
  }
})

// POST: /category
const createCategoryValidations: ValidationChain[] = [body('name').notEmpty(), body('slug').notEmpty()]

categoryRouter.post('/category', validate(createCategoryValidations), async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
