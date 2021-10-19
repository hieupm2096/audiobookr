import { Router } from 'express'
import { body, CustomValidator, param, query, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { bookService } from './book.service'
import { subCatService } from '../subcat'
import { authorService } from '../author'

export const bookRouter = Router()

const isValidSubCatId: CustomValidator = async (id: string) => {
  const exists = await subCatService.subcatIdExists(id)
  if (!exists) return Promise.reject('Sub-category does not exists')
}

const isValidAuthorId: CustomValidator = async (id: string) => {
  const exists = await authorService.authorIdExists(id)
  if (!exists) return Promise.reject('Author does not exists')
}

const isValidBookId: CustomValidator = async (id: string) => {
  const result = await bookService.bookIdExists(id)
  if (!result) return Promise.reject('Book does not exist')
}

// GET: /book
bookRouter.get(
  '/book',
  validate([query('subCatId').optional().isUUID().bail().custom(isValidSubCatId)]),
  async (req, res) => {
    try {
      const subCatId = req.query.subCatId as string
      const books = await bookService.getBookList(subCatId)

      return res.status(200).json({ message: 'success', data: books })
    } catch (e) {
      console.log('error: ' + e.message)
      return res.status(500).json({ message: e.message })
    }
  },
)

// POST: /book
const createBookValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('subCatId').isUUID().bail().custom(isValidSubCatId),
  body('authorId').isUUID().bail().custom(isValidAuthorId),
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

// PUT: /book/:id
const updateBookValidations: ValidationChain[] = [
  param('id').isUUID().bail().custom(isValidBookId),
  body('name').optional().isString(),
  body('subCatId').optional().isUUID().bail().custom(isValidSubCatId),
  body('authorId').optional().isUUID().bail().custom(isValidAuthorId),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
  body('listenUrl').optional().isURL(),
  body('status').optional().isBoolean({ strict: false }),
]

bookRouter.put('/book/:id', validate(updateBookValidations), async (req, res) => {
  try {
    const id = req.params.id as string
    const result = await bookService.updateBook(id, req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
