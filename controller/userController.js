const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const CustomError = require('../models/customError');
const Otp = require('../models/otp');
const PassOtp = require('../models/passOtp');
const bcrypt = require('bcrypt');

const createToken = (_id, expiresIn = '30d') => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
}

function errorMessage(error) {
    return error.code ? error.message : 'Internal server error';
}

function createOtp() {
    let randomNumbers = '';
    for (let i = 0; i < 4; i++) {
        const number = Math.floor(Math.random() * 10);
        randomNumbers += number.toString();
    }
    return randomNumbers;
}

async function emailSent(otp, email) {
    return await sendEmail(email, 'Verify your email address', `Enter the following code in the application to verify your account:\n 
        ${otp}\n\n This code expires in 1 hour`);
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        if (!user.verified) {
            const otpToken = await Otp.findOne({ email: user.email });

            if (otpToken) {
                return res.status(201).json({ message: 'Otp already sent to your email please verify account' });
            }

            const token = await Otp.create({ email: user.email, otp: createOtp() });

            const sent = emailSent(token.otp, user.email);

            if (!sent) throw new CustomError("Unable to send email verification otp", 500);

            res.status(201).json({ message: 'Otp sent to your email please verify account' });

        }

        const token = createToken(user._id);

        res.status(200).json({ fullname: user.fullname, email, token });
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const signupUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await User.signup(fullname, email, password);

        const otpToken = await Otp.create({ email: user.email, otp: createOtp() });

        const sent = await emailSent(otpToken.otp, user.email);

        if (!sent) throw new CustomError("Unable to send email verification otp", 500);

        res.status(201).json({ message: 'An otp sent to your email address. Verify' });

    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const verify = async (req, res) => {
    // console.log(req.query);
    // res.json(req.query);
    try {
        const { email, token } = req.params;

        if (req.query.q) {
            const passOtp = await PassOtp.findOne({ email, otp: token });
            if (!passOtp) throw new CustomError('Not a valid OTP', 400);

            res.status(200).json({ message: "Success" });
        } else {
            const user = await User.findOne({ email });
            if (!user) throw new CustomError('Invalid OTP', 401);

            const otpToken = await Otp.findOne({ email, otp: token });
            if (!otpToken) throw new CustomError('Invalid OTP', 400);

            await User.updateOne({ email }, { $set: { verified: true } });
            await Otp.deleteOne({ email });

            res.status(200).json({ message: "Email verified successfully" });
        }
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, token } = req.params;
        const { password } = req.body;

        const passOtp = await PassOtp.findOne({ email, otp: token });
        if (!passOtp) throw new CustomError('OTP has expired', 400);

        const hash = await bcrypt.hash(password, Number(process.env.SALT));

        await User.updateOne({ email }, { $set: { password: hash } });
        await PassOtp.deleteOne({ email });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw CustomError('Email not found', 404);

        var otp = await PassOtp.findOne({ email });

        if (otp) await PassOtp.deleteOne({ email });

        otp = await PassOtp.create({ email, otp: createOtp() });

        if (await emailSent(otp.otp, email)) {
            res.status(200).json({ message: "Otp sent to your email" })
        } else {
            throw new CustomError('Unable to send otp to your email');
        }

    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

module.exports = {
    login: loginUser,
    signup: signupUser,
    verify,
    changePassword,
    resetPassword
}