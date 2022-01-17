import { Router } from 'express'
import { body, CustomValidator, param, query, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { pagination } from '../../../types/express/pagination'
import { bookService } from './book.service'
import { subCatService } from '../subcat'
import { authorService } from '../author'

export const bookRouter = Router()

const isValidSubCatId: CustomValidator = async (id: string) => {
  const exists = await subCatService.subcatIdExists(id)
  if (!exists) return Promise.reject('Sub-category does not exists')
}

const isValidSubCatIds: CustomValidator = async (ids: string[]) => {
  const exists = await subCatService.validateSubCatIdList(ids)
  if (!exists) return Promise.reject('Sub-categories do not exists')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isValidAuthorId: CustomValidator = async (id: string) => {
  const exists = await authorService.authorIdExists(id)
  if (!exists) return Promise.reject('Author does not exists')
}

const isValidAuthorIdList: CustomValidator = async (ids: string[]) => {
  const exists = await authorService.validateAuthorIdList(ids)
  if (!exists) return Promise.reject('Authors do not exist')
}

const isValidBookId: CustomValidator = async (id: string) => {
  const result = await bookService.bookIdExists(id)
  if (!result) return Promise.reject('Book does not exist')
}

// GET: /book
bookRouter.get(
  '/book',
  pagination,
  validate([query('subCatId').optional().isUUID().bail().custom(isValidSubCatId)]),
  async (req, res) => {
    try {
      const subCatId = req.query.subCatId as string
      const books = await bookService.getBookList(subCatId, req.pagination)

      return res.status(200).json({ message: 'success', data: books })
    } catch (e) {
      console.log('error: ' + e.message)
      return res.status(500).json({ message: e.message })
    }
  },
)

bookRouter.get('/book/:id', async (req, res) => {
  try {
    const id = req.params.id
    const book = await bookService.getBook(id)

    return res.status(200).json({ message: 'success', data: book })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /book
const createBookValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('subCatIds').isArray({ min: 1 }).bail().custom(isValidSubCatIds),
  body('authorIds').isArray({ min: 1 }).bail().custom(isValidAuthorIdList),
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
  body('subCatIds').optional().isArray().bail().custom(isValidSubCatIds),
  body('authorIds').optional().isArray().bail().custom(isValidAuthorIdList),
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
