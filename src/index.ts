import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import './cores/dotenv/config'
import { sequelize } from './cores/networking/sequelize'

// get env
if (!process.env.PORT) {
    console.log('No port configuration')
    process.exit(1)
}
const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

sequelize.authenticate()

// start the Express server
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});