import { Sequelize } from 'sequelize-typescript'
import { SubCat } from '../../models/subcat.model'
import { Category } from '../../models/category.model'
import { Book } from '../../models/book.model'
import { Chapter } from '../../models/chapter.model'

const db = process.env.DATABASE_NAME
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const host = process.env.DATABASE_HOST

if (!process.env.DATABASE_PORT) {
  console.log('No database port configuration')
  process.exit(1)
}
const port: number = parseInt(process.env.DATABASE_PORT as string, 10)

export const sequelize = new Sequelize(db, username, password, {
  host,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  port,
  models: [Category, SubCat, Book, Chapter],
})
