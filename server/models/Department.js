const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    color: { type: String, default: '#58a6ff' },
    efficiency: { type: Number, default: 0 },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
