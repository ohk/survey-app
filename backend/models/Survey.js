const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
    surveyName: {
        type: String,
        required: true
    },
    surveyTag: {
        type: String
    },
    surveyAuthor: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    finishDate: {
        type: String
    },
    answerLimit: {
        type: Number
    },
    reachable: {
        type: Boolean,
        default: true
    },
    answered: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Survey', surveySchema)
