const cron = require('node-cron');
const { recalculateAllScores } = require('../services/leaveRiskService');
const AuditLog = require('../models/AuditLog');

const initRiskScoreJob = () => {
    // Run every night at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running scheduled Risk Score recalculation...');
        try {
            const results = await recalculateAllScores();
            
            // Log to Audit System (System action)
            await AuditLog.create({
                action: 'SCHEDULED_RISK_RECALCULATION',
                performedBy: null, // System
                details: `Nightly risk score update completed for ${results.length} employees.`,
                targetId: null
            });
            console.log(`Risk Score job completed. Updated ${results.length} records.`);
        } catch (error) {
            console.error('Error in scheduled Risk Score job:', error);
        }
    });
};

module.exports = initRiskScoreJob;
