const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
var cors = require('cors')

dotenv.config()

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB')
)

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.raw())
/**
 *
 * Import Routes
 *
 * User Route: User Integration
 *
 **/

const userRoute = require('./routes/user.js')
const surveyRoute = require('./routes/survey.js')
const answerRoute = require('./routes/answer.js')
const resultRoute = require('./routes/result.js')
/**
 *
 * Route Middlewares
 *
 * User Route: /api/user
 */

app.use('/api/user', userRoute)
app.use('/api/survey', surveyRoute)
app.use('/api/answer', answerRoute)
app.use('/api/result', resultRoute)

app.listen(process.env.PORT, () => {
    console.log('Server Up! Listen port ' + process.env.PORT)
})
