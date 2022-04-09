const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrioritySchema = new Schema({
    label: {
        type: String,
        lowercase: true,
        required: true
    },

}, { timestamps: true, versionKey: false, selectPopulatedPaths: false, toJSON: { virtuals: true }, toObject: { virtuals: true } })

PrioritySchema.virtual('tasks', {
    localField: '_id',
    foreignField: 'priority',
    ref: 'Task',
});

module.exports = mongoose.model('Priority', PrioritySchema)