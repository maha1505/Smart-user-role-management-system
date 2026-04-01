const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const auditRoutes = require('./routes/auditRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const riskRoutes = require('./routes/riskRoutes');
const nlpRoutes = require('./routes/nlpRoutes');
const initRiskScoreJob = require('./jobs/riskScoreJob');
const autoSeedData = require('./utils/seed');

dotenv.config();
connectDB().then(() => {
    // Run auto-seeding after DB connection
    autoSeedData();
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/logs', auditRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/nlp', nlpRoutes);

// Initialize Jobs
initRiskScoreJob();

// Root Endpoint
app.get('/', (req, res) => {
    res.send('RoleCore - Intelligent Workforce Control System API is running...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
