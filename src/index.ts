import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import './externals/dotenv/config'
import { sequelize } from './externals/networking/sequelize'
import { categoryRouter } from './features/category'
import { subCatRouter } from './features/subcat'
import { bookRouter } from './features/book'
import { uploadRouter } from './features/upload/upload.router'
import { chapterRouter } from './features/chapter'
import { authorRouter } from './features/author'
import { authRouter } from './features/auth'
import { authenticate } from './externals/passport/passport'
;(async () => {
  // get env
  if (!process.env.PORT) {
    console.log('No port configuration')
    process.exit(1)
  }
  const port: number = parseInt(process.env.PORT as string, 10)

  if (!process.env.JWT_SECRET) {
    console.log('No jwt secret configuration')
    process.exit(1)
  }

  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // db
  await sequelize.authenticate()

  // router
  app.use('/api/v1', authRouter)

  app.all('*', authenticate)
  app.use('/api/v1', categoryRouter)
  app.use('/api/v1', subCatRouter)
  app.use('/api/v1', bookRouter)
  app.use('/api/v1', chapterRouter)
  app.use('/api/v1', authorRouter)
  app.use('/api/v1', uploadRouter)

  // start the Express server
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
  })
})()
