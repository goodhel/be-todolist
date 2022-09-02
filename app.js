const express = require('express')
const response = require('./helpers/response')
const routes = require('./routes')
const cors = require('cors')
const app = express()

// This is the route the API will call
const port = process.env.PORT || 5001

// Handle Cors
app.use(cors())
// Serialize dan Deserialize Input
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Welcome API
app.get('/', async (req, res, next) => {
    res.status(200).send({
        message: 'Welcome to API Todo List Edited'
    })
})

// Routes
routes(app)

// Error handler
app.use(response.errorHandler)

// app listen
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`)
})
