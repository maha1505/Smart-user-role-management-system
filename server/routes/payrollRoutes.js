const express = require('express');
const { generatePayroll, getAllPayroll, getMyPayroll, getAccountantStats, getAccountantReports, updatePayroll } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');
const logAudit = require('../middleware/auditMiddleware');
const router = express.Router();

router.use(protect);

router.post('/',
    authorize('accountant', 'admin'),
    logAudit('GENERATE_PAYROLL', 'payroll'),
    generatePayroll
);

router.get('/', authorize('accountant', 'hr', 'admin'), getAllPayroll);
router.put('/:id', authorize('accountant', 'admin'), logAudit('UPDATE_PAYROLL', 'payroll'), updatePayroll);
router.get('/stats', authorize('accountant', 'admin'), getAccountantStats);
router.get('/reports', authorize('accountant', 'admin'), getAccountantReports);

router.get('/my', authorize('employee'), getMyPayroll);

module.exports = router;
