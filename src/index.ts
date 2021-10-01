import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import './cores/dotenv/config'
import { sequelize } from './cores/networking/sequelize'
import { categoryRouter } from './routers/category.router'
import { subCatRouter } from './routers/subcat.router'

(async () => {
    // get env
    if (!process.env.PORT) {
        console.log('No port configuration')
        process.exit(1)
    }
    const port: number = parseInt(process.env.PORT as string, 10)

    const app = express();

    app.use(helmet())
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    // db
    await sequelize.authenticate();

    // router
    app.use('/api/v1', categoryRouter)
    app.use('/api/v1', subCatRouter)

    // start the Express server
    app.listen(port, () => {
        console.log(`server is listening on port ${port}`)
    });
})();