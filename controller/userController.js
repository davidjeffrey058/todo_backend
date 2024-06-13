const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const CustomError = require('../models/customError');
const Otp = require('../models/otp');

const createToken = (_id, expiresIn = '30d') => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
}

function errorMessage(error) {
    return error.code ? error.message : 'Internal server error';
}

function otp() {
    let randomNumbers = '';
    for (let i = 0; i < 4; i++) {
        const number = Math.floor(Math.random() * 10);
        randomNumbers += number.toString();
    }
    return randomNumbers;
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({ fullname: user.fullname, email, token });
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const signupUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await User.signup(fullname, email, password);

        const otpToken = await Otp.create({ email: user.email, otp: otp() });

        const sent = await sendEmail(email, 'Verify your email address', `Enter the following code in the application to verify your account:\n 
            ${otpToken.otp}\n\n This code expires in 1 hour`);

        if (!sent) throw new CustomError("Unable to send email verification otp", 500);

        res.status(201).json({ message: 'An otp sent to your email address. Verify' });

    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const verify = async (req, res) => {
    try {
        const { email, token } = req.params;
        // console.log(req.params);

        const user = await User.findOne({ email });
        if (!user) throw new CustomError('Invalid OTP', 401);

        const otpToken = await Otp.findOne({ email, otp: token });
        if (!otpToken) throw new CustomError('Invalid OTP', 400);

        await User.updateOne({ email }, { $set: { verified: true } });
        await Otp.deleteOne({ email });

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

module.exports = {
    login: loginUser,
    signup: signupUser,
    verify
}