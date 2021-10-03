import { Router } from 'express'
import { query } from 'express-validator'
import { validate } from '../externals/validation/express-validator'
import { S3Service } from '../services/s3.service'

export const uploadRouter = Router()

const s3Service = new S3Service()

const uploadFileValidations = [query('fileType').notEmpty(), query('fileSize').isNumeric()]

uploadRouter.get('/sign-upload', validate(uploadFileValidations), async (req, res) => {
  const fileType = req.query.fileType as string
  const fileSize = parseInt(req.query.fileSize as string, 10)

  try {
    const { signedUrl, url } = await s3Service.getUploadFileUrls(fileType, fileSize)
    res.status(200).json({ message: 'success', data: { signedUrl, url } })
  } catch (e) {
    console.log('error: ' + e.message)
    res.status(500).json({ message: e.message })
  }
})
