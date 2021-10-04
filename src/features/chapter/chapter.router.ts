import { Router } from 'express'
import { body, CustomValidator, param, query, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { bookService } from '../book'
import { chapterService } from './chapter.service'

export const chapterRouter = Router()

const isValidBookId: CustomValidator = async (id: string) => {
  const book = await bookService.getBook(id)
  if (!book) return Promise.reject('Book does not exists')
}

const isValidChapterId: CustomValidator = async (id: string) => {
  const chapter = await chapterService.getChapter(id)
  if (!chapter) return Promise.reject('Chapter does not exist')
}

// GET: /chapter
chapterRouter.get('/chapter', validate([query('bookId').isUUID().bail().custom(isValidBookId)]), async (req, res) => {
  try {
    const bookId = req.query.bookId as string
    const chapters = await chapterService.getChapterList(bookId)

    return res.status(200).json({ message: 'success', data: chapters })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /chapter
const createChapterValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('bookId').isUUID().bail().custom(isValidBookId),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
  body('listenUrl').optional().isURL(),
]

chapterRouter.post('/chapter', validate(createChapterValidations), async (req, res) => {
  try {
    const result = await chapterService.createChapter(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// PUT: /chapter/:id
const updateChapterValidations: ValidationChain[] = [
  param('id').isUUID().bail().custom(isValidChapterId),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
  body('listenUrl').optional().isURL(),
  body('status').optional().isBoolean({ strict: false }),
]

chapterRouter.put('/chapter/:id', validate(updateChapterValidations), async (req, res) => {
  try {
    const id = req.params.id as string
    const result = await chapterService.updateChapter(id, req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
