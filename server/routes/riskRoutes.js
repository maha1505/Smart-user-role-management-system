const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const RiskScore = require('../models/RiskScore');
const { recalculateAllScores } = require('../services/leaveRiskService');

/**
 * @desc    Get all employee risk scores
 * @route   GET /api/risk/scores
 * @access  Private (Admin, HR)
 */
router.get('/scores', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        let query = {};
        
        // If HR, only show employees in their department
        if (req.user.role === 'hr') {
            const department = req.user.department;
            if (!department) {
                return res.status(400).json({ message: 'HR must be assigned to a department' });
            }
            
            const deptUsers = await User.find({ 
                department: new RegExp(`^${department}$`, 'i') 
            }).select('_id');
            const deptIds = deptUsers.map(u => u._id);
            
            query = { employeeId: { $in: deptIds } };
        }

        const scores = await RiskScore.find(query)
            .populate('employeeId', 'name email department joiningDate')
            .sort({ score: -1 });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const User = require('../models/User');

/**
 * @desc    Get risk scores for manager's own team
 * @route   GET /api/risk/scores/team
 * @access  Private (Manager)
 */
router.get('/scores/team', protect, authorize('manager'), async (req, res) => {
    try {
        const teamUsers = await User.find({ department: req.user.department }).select('_id');
        const teamIds = teamUsers.map(u => u._id);

        const scores = await RiskScore.find({ employeeId: { $in: teamIds } })
            .populate('employeeId', 'name email department joiningDate')
            .sort({ score: -1 });

        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Get full score breakdown for one employee
 * @route   GET /api/risk/scores/:employeeId
 * @access  Private (Admin, HR)
 */
router.get('/scores/:employeeId', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        // Fetch up to 7 latest calculations (for history chart)
        const history = await RiskScore.find({ employeeId: req.params.employeeId })
            .populate('employeeId', 'name email department joiningDate')
            .sort({ calculatedAt: -1 })
            .limit(7);

        if (!history || history.length === 0) {
            return res.status(404).json({ message: 'Risk score data not found for this employee' });
        }

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Trigger immediate recalculation for all employees
 * @route   POST /api/risk/recalculate
 * @access  Private (Admin, HR)
 */
router.post('/recalculate', protect, authorize('admin', 'hr'), async (req, res) => {
    try {
        const department = req.user.role === 'hr' ? req.user.department : null;
        const results = await recalculateAllScores(req.user._id, department);
        res.status(200).json({ 
            message: `Recalculation complete for ${results.length} employees${department ? ` in ${department}` : ''}.`,
            count: results.length 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
