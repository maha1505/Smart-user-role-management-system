const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs (Admin only)
// @route   GET /api/logs
const getAuditLogs = async (req, res) => {
    const logs = await AuditLog.find({})
        .populate('userId', 'name username role')
        .sort({ createdAt: -1 });
    res.json(logs);
};

module.exports = { getAuditLogs };
