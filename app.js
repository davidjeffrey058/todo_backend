const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/todo-api/user', userRouter);

mongoose.connect('mongodb://localhost:27017/todo').then(() => {
    app.listen(4000, () => {
        console.log('listening at port 4000');
    });
}).catch((error) => {
    console.log(error);
})
