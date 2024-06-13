const express = require('express');
const { addTask, deleteTask, updateTask, getAllTasks } = require('../controller/taskController');
const taskRouter = express.Router();

// Add a task
taskRouter.post('', addTask);

// get all task
taskRouter.get('', getAllTasks);

// update a task
taskRouter.patch('', updateTask);

// Delete a task
taskRouter.delete('', deleteTask);


module.exports = taskRouter;