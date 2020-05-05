const router = require('express').Router()
const Survey = require('../models/Survey')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const verify = require('../middleware/verify.js')

router.post('/add', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    try {
        answers = req.body.answers
        console.log(answers)
        console.log()
        if (
            (await Answer.countDocuments({
                email: req.body.email,
                surveyId: req.body.surveyId
            })) === 0
        ) {
            for (let i = 0; i < answers.length; i++) {
                let answer = new Answer({
                    email: req.body.email,
                    surveyId: req.body.surveyId,
                    questionId: answers[i].questionId,
                    answer: answers[i].answer,
                    ipAddress: req.connection.remoteAddress
                })
                await answer.save()
                console.log(answer)
            }
            res.status(200).send('Added')
        } else {
            res.status(400).send('Email address already exist')
        }
    } catch (error) {
        res.status(400).send('Error: ' + error)
    }
})

module.exports = router
