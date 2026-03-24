const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const { parseTask } = require('../services/nlpTaskService');

/**
 * @desc    Parse task description sentence into structured fields
 * @route   POST /api/nlp/parse-task
 * @access  Private (Manager, Admin)
 */
router.post('/parse-task', protect, authorize('manager', 'admin'), async (req, res) => {
    try {
        const { sentence } = req.body;
        if (!sentence) {
            return res.status(400).json({ message: 'Sentence is required' });
        }

        // Fetch active employees to help parser match names
        const employees = await User.find({ 
            role: 'employee', 
            registrationStatus: 'approved' 
        }).select('name _id');

        const result = await parseTask(sentence, employees);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('NLP Parse Error:', error);
        res.status(500).json({ message: 'Failed to parse task description', error: error.message });
    }
});

module.exports = router;
