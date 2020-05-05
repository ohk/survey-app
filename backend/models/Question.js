const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    text: String,
    qType: Number,
    qAnswer: [{ text: String }],
    surveyId: String
})

module.exports = mongoose.model('Question', questionSchema)
