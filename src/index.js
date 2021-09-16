const express = require('express');
const app = express();
const port = 8080;

// define a route handler for default homepage
app.get('/', (req, res) => {
    res.send('Hello world');
})