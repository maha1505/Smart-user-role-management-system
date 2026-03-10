const express = require('express');
const { createTask, getTasks, getMyTasks, updateTaskStatus, getTeamTasks, updateTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');
const logAudit = require('../middleware/auditMiddleware');
const router = express.Router();

router.use(protect);

router.post('/',
    authorize('admin', 'manager'),
    logAudit('ASSIGN_TASK', 'task'),
    createTask
);

router.get('/', authorize('admin'), getTasks);

router.get('/my', getMyTasks);
router.get('/team', authorize('admin', 'manager'), getTeamTasks);

router.put('/:id',
    authorize('admin', 'manager'),
    logAudit('UPDATE_TASK', 'task'),
    updateTask
);

router.put('/:id/status',
    logAudit('UPDATE_TASK_STATUS', 'task'),
    updateTaskStatus
);

module.exports = router;
