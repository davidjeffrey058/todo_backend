const express = require('express');
const { login, signup, verify } = require('../controller/userController');
const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post('/signup', signup);

userRouter.get('/:email/verify/:token', verify)

module.exports = userRouter;