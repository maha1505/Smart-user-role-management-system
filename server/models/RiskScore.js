const mongoose = require('mongoose');

const riskScoreSchema = new mongoose.Schema({
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    score: { 
        type: Number, 
        min: 0, 
        max: 100, 
        required: true 
    },
    level: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        required: true 
    },
    topFactor: { 
        type: String, 
        required: true 
    },
    breakdown: {
        leaveScore: { type: Number, default: 0 },
        taskScore: { type: Number, default: 0 },
        overtimeScore: { type: Number, default: 0 },
        rejectedScore: { type: Number, default: 0 },
        tenureScore: { type: Number, default: 0 }
    },
    calculatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index for performance and history tracking
riskScoreSchema.index({ employeeId: 1, calculatedAt: -1 });

module.exports = mongoose.model('RiskScore', riskScoreSchema);
