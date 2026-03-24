const Task = require('../models/Task');
const User = require('../models/User');

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, deadline } = req.body;

        // Security Check: Manager can only assign to their own department
        if (req.user.role === 'manager') {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser || assignedUser.department !== req.user.department) {
                return res.status(403).json({ message: 'Managers can only assign tasks to employees within their own department.' });
            }
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            department: req.user.department,
            priority,
            deadline
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks (Admin only)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
    const tasks = await Task.find({}).populate('assignedTo', 'name username').populate('assignedBy', 'name username');
    res.json(tasks);
};

// @desc    Get my tasks (Employee)
// @route   GET /api/tasks/my
const getMyTasks = async (req, res) => {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
        task.status = status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

// @desc    Get team tasks (Manager)
// @route   GET /api/tasks/team
const getTeamTasks = async (req, res) => {
    const tasks = await Task.find({ department: req.user.department })
        .populate('assignedTo', 'name username');
    res.json(tasks);
};

// @desc    Update task details (Manager only)
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
    const { title, description, assignedTo, priority, deadline, status } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
        // Security Check: Manager can only update tasks in their department
        if (req.user.role === 'manager' && task.department !== req.user.department) {
            return res.status(403).json({ message: 'Managers can only manage tasks within their own department.' });
        }

        // If reassigning, check if new user is in department
        if (assignedTo && assignedTo !== task.assignedTo.toString()) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser || assignedUser.department !== req.user.department) {
                return res.status(403).json({ message: 'Managers can only reassign tasks to employees within their own department.' });
            }
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.priority = priority || task.priority;
        task.deadline = deadline || task.deadline;
        task.status = status || task.status;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

module.exports = { createTask, getTasks, getMyTasks, updateTaskStatus, getTeamTasks, updateTask };
