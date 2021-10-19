import { Router } from 'express'
import { body, CustomValidator, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { categoryService } from '../category'
import { subCatService } from './subcat.service'

export const subCatRouter = Router()

// GET: /subcat
subCatRouter.get('/subcat', async (req, res) => {
  try {
    const catId = req.query.catId as string
    const subcats = await subCatService.getSubCatList(catId)
    return res.status(200).json({ message: 'success', data: subcats })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

const isValidCategoryId: CustomValidator = async (id) => {
  const category = await categoryService.categoryExists(id)
  if (!category) return Promise.reject('Category does not exists')
}

// POST: /subcat
const creteSubCatValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('catId').isUUID().bail().custom(isValidCategoryId),
  body('description').optional().isString(),
  body('slug').optional().isString(),
]

subCatRouter.post('/subcat', validate(creteSubCatValidations), async (req, res) => {
  try {
    const result = await subCatService.createSubCat(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
