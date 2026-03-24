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
        const scores = await RiskScore.find()
            .populate('employeeId', 'name email department joiningDate')
            .sort({ score: -1 });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @desc    Get risk scores for manager's own team
 * @route   GET /api/risk/scores/team
 * @access  Private (Manager)
 */
router.get('/scores/team', protect, authorize('manager'), async (req, res) => {
    try {
        const scores = await RiskScore.find()
            .populate({
                path: 'employeeId',
                match: { managerId: req.user._id },
                select: 'name email department joiningDate'
            })
            .sort({ score: -1 });

        // Filter out scores where populate didn't match (i.e., not in manager's team)
        const teamScores = scores.filter(s => s.employeeId !== null);
        res.json(teamScores);
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
        const results = await recalculateAllScores(req.user._id);
        res.status(200).json({ 
            message: `Recalculation complete for ${results.length} employees.`,
            count: results.length 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
