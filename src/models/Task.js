const mongoose = require('mongoose');
const validator = require('validator');

const TaskSchema = new mongoose.Schema({
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Status: {
        type: Boolean,
        default: false

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task;