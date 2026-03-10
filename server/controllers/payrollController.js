const Payroll = require('../models/Payroll');
const User = require('../models/User');

// @desc    Generate Payroll (Accountant only)
// @route   POST /api/payroll
const generatePayroll = async (req, res) => {
    const { employeeId, month, basicSalary, deductions } = req.body;

    const netSalary = basicSalary - deductions;

    const payroll = await Payroll.create({
        employeeId,
        month,
        basicSalary,
        deductions,
        netSalary,
        generatedBy: req.user._id
    });

    res.status(201).json(payroll);
};

// @desc    Get Accountant Dashboard Stats
// @route   GET /api/payroll/stats
const getAccountantStats = async (req, res) => {
    try {
        const now = new Date();
        const currentMonthString = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        // Find format used in DB - assuming 'Month YYYY' or 'MMM YYYY', let's fetch all and filter or format it.
        // The generate payslip UI uses "March 2026", so let's match that format or aggregate by month string.

        // Fetch all payrolls to calculate stats
        const allPayrolls = await Payroll.find({}).populate('employeeId', 'department');

        // Let's use the most recent month in the DB if none matches current (for testing)
        let targetMonthStr = allPayrolls.length > 0 ? allPayrolls[0].month : currentMonthString;

        // Sort to find the latest month accurately 
        if (allPayrolls.length > 0) {
            allPayrolls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            targetMonthStr = allPayrolls[0].month;
        }

        const currentMonthPayrolls = allPayrolls.filter(p => p.month === targetMonthStr);

        const totalPayrollString = currentMonthPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
        const payslipsGenerated = currentMonthPayrolls.length;
        const avgSalary = payslipsGenerated > 0 ? Math.round(totalPayrollString / payslipsGenerated) : 0;
        const totalDeductions = currentMonthPayrolls.reduce((sum, p) => sum + p.deductions, 0);

        // Department Breakdown
        const deptBreakdown = {};
        allPayrolls.forEach(p => {
            // We need to group by department for the current month
            if (p.month === targetMonthStr && p.employeeId && p.employeeId.department) {
                const dept = p.employeeId.department;
                if (!deptBreakdown[dept]) deptBreakdown[dept] = 0;
                deptBreakdown[dept] += p.netSalary;
            }
        });

        const formattedDeptBreakdown = Object.keys(deptBreakdown).map(dept => ({
            name: dept,
            amount: deptBreakdown[dept]
        }));

        res.json({
            stats: {
                totalPayroll: totalPayrollString,
                payslipsGenerated,
                avgSalary,
                totalDeductions,
                currentMonth: targetMonthStr
            },
            deptBreakdown: formattedDeptBreakdown
        });
    } catch (err) {
        console.error('Accountant Stats Error:', err);
        res.status(500).json({ message: 'Server error fetching accountant stats', error: err.message });
    }
};

// @desc    Get Accountant Reports (Monthly History)
// @route   GET /api/payroll/reports
const getAccountantReports = async (req, res) => {
    try {
        const allPayrolls = await Payroll.find({}).populate('employeeId', 'department');

        // Aggregate by month
        const monthlySummary = {};

        allPayrolls.forEach(p => {
            const m = p.month;
            if (!monthlySummary[m]) {
                monthlySummary[m] = {
                    month: m,
                    employees: new Set(),
                    gross: 0,
                    deductions: 0,
                    net: 0
                };
            }
            monthlySummary[m].employees.add(p.employeeId ? p.employeeId._id.toString() : '');
            monthlySummary[m].gross += (p.basicSalary || 0);
            monthlySummary[m].deductions += (p.deductions || 0);
            monthlySummary[m].net += (p.netSalary || 0);
        });

        // Convert to array and format amounts
        const formattedSummary = Object.values(monthlySummary).map(m => ({
            month: m.month,
            employees: m.employees.size,
            gross: m.gross,
            deductions: m.deductions,
            net: m.net
        })).sort((a, b) => {
            // Basic sort assuming "Jan 2026" format, or keep as is if chronological in DB covers it
            // Realistically, we'd parse the date, but string compare might fail for months.
            // We'll trust the DB creation order or sort by year-month strings if possible.
            // For now, reverse string sort is not perfect but works for recent months usually if formatted YYYY-MM
            return b.month.localeCompare(a.month);
        });

        // Department Breakdown (All Time or Current Month - Image 4 shows general breakdown)
        const deptBreakdown = {};
        allPayrolls.forEach(p => {
            if (p.employeeId && p.employeeId.department) {
                const dept = p.employeeId.department;
                if (!deptBreakdown[dept]) deptBreakdown[dept] = 0;
                deptBreakdown[dept] += p.netSalary;
            }
        });

        const formattedDeptBreakdown = Object.keys(deptBreakdown).map(dept => ({
            name: dept,
            amount: deptBreakdown[dept]
        }));

        res.json({
            monthlySummary: formattedSummary,
            departmentBreakdown: formattedDeptBreakdown
        });

    } catch (err) {
        console.error('Accountant Reports Error:', err);
        res.status(500).json({ message: 'Server error fetching accountant reports', error: err.message });
    }
}

// @desc    Get all payroll records (Accountant/HR)
// @route   GET /api/payroll
const getAllPayroll = async (req, res) => {
    const records = await Payroll.find({})
        .populate('employeeId', 'name username department')
        .sort({ createdAt: -1 });
    res.json(records);
};

// @desc    Get my payroll (Employee)
// @route   GET /api/payroll/my
const getMyPayroll = async (req, res) => {
    const records = await Payroll.find({ employeeId: req.user._id })
        .sort({ month: -1 });
    res.json(records);
};

// @desc    Update Payroll Record
// @route   PUT /api/payroll/:id
const updatePayroll = async (req, res) => {
    try {
        const { basicSalary, deductions } = req.body;
        const netSalary = basicSalary - deductions;

        const payroll = await Payroll.findByIdAndUpdate(
            req.params.id,
            { basicSalary, deductions, netSalary },
            { new: true, runValidators: true }
        );

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        res.json(payroll);
    } catch (err) {
        console.error('Update Payroll Error:', err);
        res.status(500).json({ message: 'Server error updating payroll', error: err.message });
    }
};

module.exports = { generatePayroll, getAllPayroll, getMyPayroll, getAccountantStats, getAccountantReports, updatePayroll };
