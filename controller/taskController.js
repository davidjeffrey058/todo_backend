const Task = require('../models/taskModel');
const addTask = async (req, res) => {
    try {
        const body = req.body;

        const result = await Task.create(body);

        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'internal server error' });
    }
}

const getAllTasks = (req, res) => { }

const deleteTask = (req, res) => { }

const updateTask = (req, res) => { }

module.exports = {
    addTask,
    getAllTasks,
    deleteTask,
    updateTask
}