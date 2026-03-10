const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // Format "MM-YYYY"
    basicSalary: { type: Number, required: true },
    deductions: { type: Number, required: true, default: 0 },
    netSalary: { type: Number, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
