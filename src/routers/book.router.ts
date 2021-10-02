import { Router } from 'express'
import { body, CustomValidator, ValidationChain } from 'express-validator'
import { validate } from '../cores/validation/express-validator'
import { BookService } from '../services/book.service'
import { SubCatService } from '../services/subcat.service'

export const bookRouter = Router()
const bookService = new BookService()
const subCatService = new SubCatService()

// GET: /book
bookRouter.get('/book', async (req, res) => {
  try {
    const subCatId = req.query.subCatId as string
    const books = await bookService.getBookList(subCatId)

    return res.status(200).json({ message: 'success', data: books })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /book
const isValidSubCatId: CustomValidator = async (id) => {
  const subcat = await subCatService.getSubCat(id)
  if (!subcat) return Promise.reject('Sub Category does not exists')
}

const createBookValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('subCatId').notEmpty().bail().isUUID().bail().custom(isValidSubCatId),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
  body('listenUrl').optional().isURL(),
]

bookRouter.post('/book', validate(createBookValidations), async (req, res) => {
  try {
    const result = await bookService.createBook(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
