const Task = require('../models/taskModel');
const { errorMessage } = require('../controller/userController');
const CustomError = require('../models/customError');
const mongoose = require('mongoose');

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

const addTask = async (req, res) => {
    try {

        const {
            task,
            category,
            is_completed,
            is_important,
            due_date,
            remind_date
        } = req.body;

        await Task.create({
            user_id: req.user._id,
            task,
            category,
            is_completed,
            is_important,
            due_date,
            remind_date
        });

        res.status(200).json({ message: 'Task added' });
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.user._id });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) throw new CustomError('Enter a valid id', 401);

        await Task.deleteOne({ _id: id });

        res.status(200).json({ message: 'Task deleted' });

    } catch (error) {
        console.log(error)
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) throw new CustomError('Enter a valid id', 401);

        await Task.updateOne({ _id: id }, { $set: req.body });

        res.status(200).json({ message: 'Task updated' });
    } catch (error) {
        res.status(error.code || 500).json({ error: errorMessage(error) });
    }
}

module.exports = {
    addTask,
    getAllTasks,
    deleteTask,
    updateTask
}