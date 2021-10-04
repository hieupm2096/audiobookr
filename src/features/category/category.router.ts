import { Router } from 'express'
import { body, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { Category } from './category.model'
import { categoryService } from './category.service'

export const categoryRouter = Router()

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
