const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const Task = require('../models/Task');
router.get('/', async (req, res) => {
    try {

        const tasks = await Task.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la preluarea tasks',
            error: error.message
        });
    }

});
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const myTasks = await Task.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
        res.json({
            success: true,
            count: myTasks.length,
            data: myTasks
        });
    } catch (error) {
        console.error('Error fetching my tasks: ', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la preluarea task-urilor',
            error: error.message
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('userId', 'name email');
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost gasit'
            });
        }
        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost gasit(ID invalid)'
            });
        }
        console.error("Error fetching task: ", error);
        res.status(500).json({
            success: false,
            message: 'Eroare la preluarea task ului',
            error: error.message
        });
    }

});
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Title este obligatoriu'
            });
        }
        const newTask = await Task.create({
            title,
            description,
            status: status || 'todo',
            dueDate,
            userId: req.user.userId,
        });
        const taskWithUser = await Task.findById(newTask._id)
            .populate('userId', 'name email');
        res.status(201).json({
            success: true,
            message: 'Task creat cu succes',
            data: taskWithUser
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Eroare de validare',
                errors: messages
            });
        }
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la crearea task-ului',
            error: error.message
        });
    }
});
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost gasit'
            });
        }
        if (task.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Nu ai permisiunea sa modifici acest task'
            });
        }
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, {
            title: title || task.title,
            description: description !== undefined ? description : task.description,
            status: status || task.status,
            dueDate: dueDate !== undefined ? dueDate : task.dueDate
        }, {
            new: true,
            runValidators: true
        }
        ).populate('userId', 'name email');
        res.json({
            success: true,
            message: 'Task actualizat cu succes',
            data: updatedTask
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost gasit (ID invalid)'

            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Eroare de validare',
                errors: messages
            });
        }

        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la actualizarea task-ului',
            error: error.message
        });
    }
});

//stergere task
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost gasit'
            });
        }
        if (task.userId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Nu ai permisiunea sa stergi acest task'
            });
        }
        await Task.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: 'Task sters cu succes'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Task nu a fost găsit (ID invalid)'
            });
        }

        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Eroare la ștergerea task-ului',
            error: error.message
        });
    }
});

module.exports = router;