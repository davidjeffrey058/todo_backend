const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email: {
        type: String,
        ref: 'users',
        unique: true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
});

module.exports = mongoose.model('Otp', otpSchema);