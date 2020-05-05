const router = require('express').Router()
const Survey = require('../models/Survey')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const verify = require('../middleware/verify.js')

router.get('/all', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    try {
        const surveys = await Survey.find({ reachable: true })
        res.json(surveys)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/mys', verify, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    try {
        if (req.user.role === 'admin') {
            const surveys = await Survey.find()
            res.json(surveys)
        } else {
            const surveys = await Survey.find({
                surveyAuthor: req.user._id.toString()
            })
            res.json(surveys)
        }
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/add', verify, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    /**
     * Create survey object from data
     */
    const survey = new Survey({
        surveyName: req.body.survey.surveyName,
        surveyTag: req.body.survey.surveyTag,
        surveyAuthor: req.user,
        finishDate: req.body.survey.finishDate,
        answerLimit: req.body.survey.answerLimit,
        reachable: req.body.survey.reachable
    })
    /**
     * save survey
     */
    try {
        survey.save()
    } catch (error) {
        return res.status(400).send('Survey could not be saved' + error.message)
    }

    const questionArray = req.body.questions
    try {
        questionArray.forEach((question) => {
            let ques = new Question({
                text: question.text,
                qType: question.qType,
                qAnswer: question.qAnswer,
                surveyId: survey._id
            })
            ques.save()
        })
    } catch (error) {
        survey.remove()
        return res.status(400).send('Survey could not be saved' + error.message)
    }

    res.send({ surveyId: survey._id })
})

router.get('/:surveyId', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    try {
        const survey = await Survey.findOne({
            _id: req.params.surveyId.toString()
        })
        const questions = await Question.find({
            surveyId: survey._id.toString()
        })
        return res.send({
            surveyName: survey.surveyName,
            surveyTags: survey.surveyTags,
            questions: questions
        })
    } catch (error) {
        return res.status(400).send(error)
    }
})

router.post('/unreachable/', verify, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    const survey = await Survey.findOne({ _id: req.body.surveyId })
    if (req.user._id.toString() === survey.surveyAuthor) {
        await Survey.updateOne({ _id: req.body.surveyId }, { reachable: false })
        return res.send('Unreachable')
    } else {
        return res.status(401).send('Access denied!')
    }
})

router.post('/reachable/', verify, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    const survey = await Survey.findOne({ _id: req.body.surveyId })
    if (req.user._id.toString() === survey.surveyAuthor) {
        await Survey.updateOne({ _id: req.body.surveyId }, { reachable: true })
        return res.send('Reachable')
    } else {
        return res.status(401).send('Access denied!')
    }
})

router.delete('/:survey', verify, async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    const survey = await Survey.findOne({ _id: req.params.survey })
    if (req.user._id.toString() === survey.surveyAuthor) {
        await Survey.deleteOne({ _id: req.params.survey })
        await Question.deleteMany({ surveyId: req.params.survey })
        await Answer.deleteMany({ surveyId: req.params.survey })
        return res.send('deleted')
    } else {
        return res.status(401).send('Access denied!')
    }
})
module.exports = router
