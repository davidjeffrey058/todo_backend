const jwt = require('jsonwebtoken');
const { errorMessage } = require('../controller/userController');
const CustomError = require('../models/customError');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new CustomError('Authorization token required', 400);
        }

        const token = authorization.split(' ')[1];

        const { _id } = jwt.verify(token, process.env.SECRET);

        req.user = await User.findOne({ _id }).select('_id');
        next();
    } catch (error) {
        // console.log(error);
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

module.exports = requireAuth;