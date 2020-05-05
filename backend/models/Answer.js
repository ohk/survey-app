const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    email: String,
    surveyId: String,
    questionId: String,
    answer: String,
    qType: Number,
    ipAddress: String
})

module.exports = mongoose.model('Answer', answerSchema)
