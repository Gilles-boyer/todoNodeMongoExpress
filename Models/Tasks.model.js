const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    title: {
        type: String,
        lowercase: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    priority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Priority'
    },
})

module.exports = mongoose.model('Task', TaskSchema)