const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resource: { type: String, enum: ['user', 'task', 'leave', 'department', 'payroll'], required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String },
    Ip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
