import { Router } from 'express'
import { SubCatService } from '../services/subcat.service'
import { body, CustomValidator, ValidationChain } from 'express-validator'
import { CategoryService } from '../services/category.service'
import { validate } from '../cores/validation/express-validator'

export const subCatRouter = Router()
const subCatService = new SubCatService()
const categoryService = new CategoryService()

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
  const category = await categoryService.getCategory(id)
  if (!category) return Promise.reject('Category does not exists')
}

// POST: /subcat
const creteSubCatValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('catId').notEmpty().bail().isUUID().bail().custom(isValidCategoryId),
  body('slug').exists(),
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
