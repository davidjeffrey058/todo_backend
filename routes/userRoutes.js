const express = require('express');
const { login, signup, verify, changePassword, resetPassword } = require('../controller/userController');
const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post('/signup', signup);

userRouter.get('/:email/verify/:token', verify);

userRouter.post('/:email/change-password/:token', changePassword);

userRouter.post('/pass-reset-otp', resetPassword);

module.exports = userRouter;