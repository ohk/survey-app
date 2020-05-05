const router = require('express').Router()
const Survey = require('../models/Survey')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const verify = require('../middleware/verify.js')

router.get('/:survey', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    let result = []
    const quIDs = await Question.find({ surveyId: req.params.survey })
    for (let i = 0; i < quIDs.length; i++) {
        let tmp = {
            text: quIDs[i].text,
            questionId: quIDs[i]._id,
            qType: quIDs[i].qType
        }
        if (quIDs[i].qType === 1) {
            let answers = []
            answerList = await Answer.find({ questionId: quIDs[i]._id })
            answerList.forEach((element) => {
                answers.push(element.answer)
            })
            tmp.answers = answers
        } else {
            let answers = []
            let count = quIDs[i].qAnswer

            for (let index = 1; index < count.length + 1; index++) {
                counts = await Answer.countDocuments({
                    questionId: quIDs[i]._id,
                    answer: index
                })
                tmp2 = {}
                tmp2.text = quIDs[i].qAnswer[index - 1].text
                tmp2.count = counts
                answers.push(tmp2)
            }
            tmp.answers = answers
        }
        result.push(tmp)
    }

    res.json(result)
})
module.exports = router
