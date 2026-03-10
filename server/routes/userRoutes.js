const express = require('express');
const {
    getUsers,
    getDashboardStats,
    updateUserStatus,
    getDepartments,
    getManagerDashboardStats,
    getManagerTeam,
    getManagerReports,
    getHRDashboardStats,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const logAudit = require('../middleware/auditMiddleware');
const router = express.Router();

router.use(protect); // All user routes require authentication

router.get('/', authorize('admin', 'hr', 'accountant'), getUsers);
router.get('/stats', authorize('admin'), getDashboardStats);
router.get('/departments', authorize('admin'), getDepartments);
router.get('/manager-stats', authorize('manager'), getManagerDashboardStats);
router.get('/manager-team', authorize('manager'), getManagerTeam);
router.get('/manager-reports', authorize('manager'), getManagerReports);
router.get('/hr-stats', authorize('hr'), getHRDashboardStats);

router.put('/:id/status',
    authorize('admin'),
    logAudit('UPDATE_USER_STATUS', 'user'),
    updateUserStatus
);

router.delete('/:id',
    authorize('admin'),
    logAudit('DELETE_USER', 'user'),
    deleteUser
);

module.exports = router;
