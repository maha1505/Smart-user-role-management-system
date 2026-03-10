const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
const applyLeave = async (req, res) => {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const leave = await LeaveRequest.create({
        employeeId: req.user._id,
        leaveType,
        fromDate,
        toDate,
        reason
    });
    res.status(201).json(leave);
};

// @desc    Approve/Reject Stage 1 (Manager)
// @route   PUT /api/leaves/:id/manager-approval
const managerApproval = async (req, res) => {
    const { status, comment } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (leave) {
        // Security Check: Manager can only approve leaves for their own department
        const employee = await User.findById(leave.employeeId);
        if (req.user.role === 'manager' && employee.department !== req.user.department) {
            return res.status(403).json({ message: 'Managers can only manage leave requests for their own department.' });
        }

        leave.managerApproval = {
            status,
            approvedBy: req.user._id,
            comment,
            actionDate: new Date()
        };
        if (status === 'rejected') leave.finalStatus = 'rejected';
        const updated = await leave.save();
        res.json(updated);
    } else {
        res.status(404).json({ message: 'Leave request not found' });
    }
};

// @desc    Approve/Reject Stage 2 (HR)
// @route   PUT /api/leaves/:id/hr-approval
const hrApproval = async (req, res) => {
    const { status, comment } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (leave && leave.managerApproval.status === 'approved') {
        leave.hrApproval = {
            status,
            approvedBy: req.user._id,
            comment,
            actionDate: new Date()
        };
        leave.finalStatus = status;
        const updated = await leave.save();
        res.json(updated);
    } else {
        res.status(400).json({ message: 'Manager approval required before HR approval' });
    }
};

// @desc    Get all leave requests (Filtered by User role)
// @route   GET /api/leaves
const getAllLeaves = async (req, res) => {
    let query = {};

    if (req.user.role === 'manager') {
        // Only see leaves from their department
        const usersInDept = await User.find({ department: req.user.department }).select('_id');
        const userIds = usersInDept.map(u => u._id);
        query = { employeeId: { $in: userIds } };
    } else if (req.user.role === 'employee') {
        query = { employeeId: req.user._id };
    }
    // HR/Admin see all

    const leaves = await LeaveRequest.find(query)
        .populate('employeeId', 'name username department')
        .sort({ createdAt: -1 });

    const formattedLeaves = leaves.map(leave => ({
        _id: leave._id,
        user: leave.employeeId,
        leaveType: leave.leaveType,
        startDate: leave.fromDate,
        endDate: leave.toDate,
        reason: leave.reason,
        status: leave.finalStatus,
        managerApproval: leave.managerApproval,
        hrApproval: leave.hrApproval,
        createdAt: leave.createdAt
    }));

    res.json(formattedLeaves);
};

module.exports = { applyLeave, managerApproval, hrApproval, getAllLeaves };
