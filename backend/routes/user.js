const router = require('express').Router()
const User = require('../models/User')
const userValidation = require('../validation/userValidation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    /**
     * Validate data
     */
    const { error } = userValidation.registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    /**
     * Check user email&Username is exists?
     */
    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).send('Email already exists')

    /**
     * Hash the password
     */
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    /**
     * Create new user object from request body
     */
    const user = new User({
        password: hashedPassword,
        email: req.body.email
    })

    /**
     * Try the save user
     */
    try {
        const savedUser = await user.save()
        res.send({ user: user._id })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    /**
     * Validate data
     */
    const { error } = userValidation.loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    /**
     * Check user email&Username is exists?
     */
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email or password is wrong!')

    /**
     * Check password is correct? Convert hash to string
     */
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)
        return res.status(400).send('Email or password is wrong!')

    /**
     * Send token for validate user
     */
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    var userDetails = {}
    userDetails.token = token
    res.status(200).send(userDetails)
})
router.post('/forgotPassword', async (req, res) => {})
module.exports = router
