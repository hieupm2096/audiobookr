import { Router } from 'express'
import { body, CustomValidator, param, ValidationChain } from 'express-validator'
import { validate } from '../../externals/validation/express-validator'
import { authorService } from '.'

export const authorRouter = Router()

const isValidAuthorId: CustomValidator = async (id: string) => {
  const isExists = await authorService.authorIdExists(id)
  if (!isExists) return Promise.reject('Author does not exist')
}

// GET: /author
authorRouter.get('/author', async (req, res) => {
  try {
    const authors = await authorService.getAuthorList()

    return res.status(200).json({ message: 'success', data: authors })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// POST: /author
const createAuthorValidations: ValidationChain[] = [
  body('name').notEmpty(),
  body('dob').optional().isDate(),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
]

authorRouter.post('/author', validate(createAuthorValidations), async (req, res) => {
  try {
    const result = await authorService.createAuthor(req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})

// PUT: /author
const updateAuthorValidations: ValidationChain[] = [
  param('id').isUUID().bail().custom(isValidAuthorId),
  body('name').optional().isString(),
  body('dob').optional().isDate(),
  body('featureImage').optional().isURL(),
  body('coverImage').optional().isURL(),
  body('status').optional().isBoolean({ strict: false }),
]

authorRouter.put('/author/:id', validate(updateAuthorValidations), async (req, res) => {
  try {
    const id = req.params.id as string
    const result = await authorService.updateAuthor(id, req.body)
    return res.status(200).json({ message: 'success', data: result })
  } catch (e) {
    console.log('error: ' + e.message)
    return res.status(500).json({ message: e.message })
  }
})
