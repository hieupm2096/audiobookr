import express from 'express'
import dotenv from 'dotenv'

// initialize configuration
dotenv.config()

// get env
const port = process.env.SERVER_PORT;
const app = express();

// define a route handler for default homepage
app.get('/', (req, res) => {
    res.send('Hello world');
})

// start the Express server
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
});