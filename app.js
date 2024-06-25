const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');

const app = express();
app.use(express.json());

app.use('/todo-api/user', userRouter);
app.use('/todo-api/task', taskRouter);

mongoose.connect(process.env.DB_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('listening at port ' + process.env.PORT);
    });
}).catch((error) => {
    console.log(error);
})
