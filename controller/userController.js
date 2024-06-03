const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id, expiresIn = '30d') => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: expiresIn });
}
function errorMessage(error) {
    return error.code ? error.message : 'Internal server error';
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

        if (user) {
            res.status(200).json({ message: 'New User created' });
        }
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

module.exports = {
    login: loginUser,
    signup: signupUser
}