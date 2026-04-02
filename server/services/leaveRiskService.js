const User = require('../models/User');
const LeaveRequest = require('../models/LeaveRequest');
const Task = require('../models/Task');
const RiskScore = require('../models/RiskScore');
const AuditLog = require('../models/AuditLog');

/**
 * Normalizes a value to 0-1 range based on a max threshold
 */
const normalize = (val, max) => Math.min(val / max, 1);

/**
 * Calculates risk score for a single employee
 */
const calculateEmployeeRisk = async (employeeId) => {
    const employee = await User.findById(employeeId);
    if (!employee) return null;

    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    // 1. Leave Days Taken (30%) - Threshold: 20 days
    const leaves = await LeaveRequest.find({
        employeeId,
        finalStatus: 'approved',
        fromDate: { $gte: startOfYear }
    });
    let leaveDays = 0;
    leaves.forEach(l => {
        const diff = Math.ceil((new Date(l.toDate) - new Date(l.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
        leaveDays += diff;
    });
    const leaveScoreRaw = normalize(leaveDays, 20);

    // 2. Overdue / Pending Tasks (25%) - Threshold: 10 tasks
    const pendingTasksCount = await Task.countDocuments({
        assignedTo: employeeId,
        status: { $ne: 'completed' }
    });
    const taskScoreRaw = normalize(pendingTasksCount, 10);

    // 3. Overtime Days (25%) - Data missing in current models, treat as 0
    const overtimeScoreRaw = 0;

    // 4. Rejected Leave Requests (15%) - Threshold: 5 requests
    const rejectedCount = await LeaveRequest.countDocuments({
        employeeId,
        finalStatus: 'rejected'
    });
    const rejectedScoreRaw = normalize(rejectedCount, 5);

    // 5. Tenure (5%) - Threshold: 12 months (Newer = higher risk)
    const tenureMonths = employee.joiningDate 
        ? Math.floor((now - new Date(employee.joiningDate)) / (1000 * 60 * 60 * 24 * 30.44))
        : 0;
    const tenureScoreRaw = Math.max(0, 1 - normalize(tenureMonths, 12));

    // Weighted Calculation
    const weightedLeave = leaveScoreRaw * 30;
    const weightedTask = taskScoreRaw * 25;
    const weightedOvertime = overtimeScoreRaw * 25;
    const weightedRejected = rejectedScoreRaw * 15;
    const weightedTenure = tenureScoreRaw * 5;

    const totalScore = Math.round(weightedLeave + weightedTask + weightedOvertime + weightedRejected + weightedTenure);

    // Level Classification (Showcase thresholds)
    let level = 'low';
    if (totalScore >= 25) level = 'high';
    else if (totalScore >= 15) level = 'medium';

    // Top Factor Identification
    const factors = [
        { name: 'Recent Approved Leaves', value: weightedLeave },
        { name: 'Unfinished Tasks', value: weightedTask },
        { name: 'Overtime Workload', value: weightedOvertime },
        { name: 'Rejected Leave Requests', value: weightedRejected },
        { name: 'Low Tenure', value: weightedTenure }
    ];
    const topFactor = factors.reduce((prev, curr) => (prev.value > curr.value) ? prev : curr).name;

    const riskData = {
        employeeId,
        score: totalScore,
        level,
        topFactor,
        breakdown: {
            leaveScore: Math.round(weightedLeave),
            taskScore: Math.round(weightedTask),
            overtimeScore: Math.round(weightedOvertime),
            rejectedScore: Math.round(weightedRejected),
            tenureScore: Math.round(weightedTenure)
        },
        calculatedAt: now
    };

    // Save/Update Risk Score
    return await RiskScore.findOneAndUpdate(
        { employeeId },
        riskData,
        { upsert: true, new: true }
    );
};

/**
 * Calculates risk scores for employees (optionally filtered by department)
 */
const recalculateAllScores = async (triggeredBy = null, department = null) => {
    let query = { role: 'employee', registrationStatus: 'approved' };
    
    if (department) {
        query.department = new RegExp(`^${department}$`, 'i');
    }

    const employees = await User.find(query);
    
    const results = [];
    for (const emp of employees) {
        const score = await calculateEmployeeRisk(emp._id);
        if (score) results.push(score);
    }

    if (triggeredBy) {
        await AuditLog.create({
            action: 'RECALCULATE_RISK_SCORES',
            performedBy: triggeredBy,
            details: `Manual recalculation triggered for ${results.length} employees.`,
            targetId: null
        });
    }

    return results;
};

module.exports = {
    calculateEmployeeRisk,
    recalculateAllScores
};
