const express = require('express');
const { applyLeave, managerApproval, hrApproval, getAllLeaves } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');
const logAudit = require('../middleware/auditMiddleware');
const router = express.Router();

router.use(protect);

router.get('/', getAllLeaves);

router.post('/',
    logAudit('APPLY_LEAVE', 'leave'),
    applyLeave
);

router.put('/:id/manager-approval',
    authorize('admin', 'manager'),
    logAudit('MANAGER_APPROVE_LEAVE', 'leave'),
    managerApproval
);

router.put('/:id/hr-approval',
    authorize('admin', 'hr'),
    logAudit('HR_APPROVE_LEAVE', 'leave'),
    hrApproval
);

module.exports = router;
