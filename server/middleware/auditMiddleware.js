const AuditLog = require('../models/AuditLog');

const logAudit = (action, resource, description) => {
    return async (req, res, next) => {
        // Only log successful actions usually, or explicitly log everything
        // We'll wrap the res.send/json to log after business logic completes
        const originalJson = res.json;

        res.json = function (data) {
            // Logic to determine if we should log (e.g., successful status)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Construct log entry
                const entry = {
                    userId: req.user?._id || data?.user?._id, // Handle login case where user is in data
                    action,
                    resource,
                    resourceId: data?._id || req.params?.id || req.user?._id,
                    description: description || `User ${req.user?.username || 'unknown'} performed ${action} on ${resource}`,
                    Ip: req.ip || req.connection.remoteAddress
                };

                // Fire and forget or handle error silently
                AuditLog.create(entry).catch(err => console.error('Audit Log Error:', err));
            }
            return originalJson.call(this, data);
        };

        next();
    };
};

module.exports = logAudit;
