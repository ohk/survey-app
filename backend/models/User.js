const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: 3,
        max: 64
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: 'user'
    }
})

module.exports = mongoose.model('User', userSchema)
