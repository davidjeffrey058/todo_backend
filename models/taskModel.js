const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    task: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    is_completed: {
        type: Boolean,
        required: true
    },
    is_important: {
        type: Boolean,
        required: true
    },
    due_date: {
        type: Date
    },
    remind_date: {
        type: Date
    }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema);