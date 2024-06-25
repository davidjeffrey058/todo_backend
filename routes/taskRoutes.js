const express = require('express');
const { addTask, deleteTask, updateTask, getAllTasks } = require('../controller/taskController');
const taskRouter = express.Router();
const requireAuth = require('../middleware/requireAuth');

taskRouter.use(requireAuth);

// Add a task
taskRouter.post('', addTask);

// get all task
taskRouter.get('', getAllTasks);

// update a task
taskRouter.patch('/:id', updateTask);

// Delete a task
taskRouter.delete('/:id', deleteTask);


module.exports = taskRouter;