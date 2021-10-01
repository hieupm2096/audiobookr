import { Router } from 'express'
import { SubCatService } from '../services/subcat.service'
import { body, CustomValidator, validationResult } from 'express-validator'
import { Category } from '../models/category.model'
import { CategoryService } from '../services/category.service'

export const subCatRouter = Router()
const subCatService = new SubCatService()
const categoryService = new CategoryService()

subCatRouter.get('/subcat', async (req, res) => {
    try {
        const catId: any = req.query.catId
        const subcats = await subCatService.getSubCatList(catId)
        res.status(200).json({ message: 'success', data: subcats })
    } catch (e) {
        console.log('error: ' + e.message)
        res.status(500).json({ message: e.message })
    }
})

const isValidCategoryId: CustomValidator = async id => {
    const category = await categoryService.getCategory(id)
    if (!category) return Promise.reject('Category does not exists')
}

subCatRouter.post(
    '/subcat',
    body('name').notEmpty(),
    body('catId').notEmpty().custom(isValidCategoryId),
    body('slug').exists(),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const { name, catId, description, slug } = req.body
            const result = await subCatService.createSubCat(name, catId, description, slug)
            return res.status(200).json({ message: 'success', data: result })
        } catch (e) {
            console.log('error: ' + e.message)
            res.status(500).json({ message: e.message })
        }
    },
)
