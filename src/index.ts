import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'

// initialize configuration
dotenv.config()

// get env
if (!process.env.PORT) {
    process.exit(1)
}
const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// start the Express server
app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});