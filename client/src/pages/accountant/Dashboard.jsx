import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    LinearProgress,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    Payments as PayrollIcon,
    Receipt as ReceiptIcon,
    TrendingDown as DeductionsIcon,
    BarChart as AvgSalaryIcon,
    AccountBalance as DeptIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const StatCard = ({ title, value, subtext, icon, gradient, valueColor, subIcon }) => (
    <Card sx={{
        p: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        bgcolor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: 'none',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient
        }
    }}>
        <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1 }}>
            {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="h4" sx={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '28px',
                    color: valueColor || '#e6edf3',
                    mb: 0.5
                }}>
                    {value}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#7d8590' }}>
                    {subtext}
                </Typography>
            </Box>
            <Box sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7d8590',
            }}>
                {subIcon || icon}
            </Box>
        </Box>
    </Card>
);

const AccountantDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/payroll/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch accountant stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    const formatCurrency = (amount) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(0)}K`;
        }
        return `₹${amount}`;
    };

    const safeStats = stats?.stats || { totalPayroll: 0, payslipsGenerated: 0, avgSalary: 0, totalDeductions: 0, currentMonth: 'N/A' };
    const deptBreakdown = stats?.deptBreakdown || [];

    const getDeptColor = (deptName) => {
        const colors = {
            'Engineering': '#58a6ff',
            'Finance': '#8957e5',
            'HR': '#f85149',
            'Sales': '#3fb950',
            'Marketing': '#d29922'
        };
        return colors[deptName] || '#7d8590';
    };

    const maxDeptAmount = Math.max(...deptBreakdown.map(d => d.amount), 1);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Payroll"
                            value={formatCurrency(safeStats.totalPayroll)}
                            subtext={safeStats.currentMonth}
                            gradient="linear-gradient(90deg, #8957e5, #d2a8ff)"
                            subIcon={<PayrollIcon sx={{ fontSize: '16px', color: '#d29922' }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Payslips Generated"
                            value={safeStats.payslipsGenerated.toString()}
                            subtext="All done"
                            gradient="linear-gradient(90deg, #238636, #3fb950)"
                            subIcon={<CheckIcon sx={{ fontSize: '18px', color: '#3fb950' }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Avg Salary"
                            value={formatCurrency(safeStats.avgSalary)}
                            subtext="Per employee"
                            gradient="linear-gradient(90deg, #1f6feb, #58a6ff)"
                            subIcon={<AvgSalaryIcon sx={{ fontSize: '18px', color: '#f85149', opacity: 0.6 }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Deductions"
                            value={formatCurrency(safeStats.totalDeductions)}
                            subtext="This month"
                            gradient="linear-gradient(90deg, #da3633, #ff7b72)"
                            subIcon={<DeductionsIcon sx={{ fontSize: '18px', color: '#f85149', opacity: 0.6 }} />}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', height: '100%', boxShadow: 'none' }}>
                        <Box sx={{ p: '14px 20px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PayrollIcon sx={{ color: '#d29922', fontSize: '16px' }} />
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e6edf3' }}>
                                    {safeStats.currentMonth} Payroll
                                </Typography>
                            </Box>
                                <Typography 
                                    sx={{ fontSize: '11px', color: '#58a6ff', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                    onClick={() => navigate('/accountant/payroll')}
                                >
                                    View All
                                </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                <Box sx={{ flex: 1, border: '1px solid #30363d', borderRadius: '8px', p: 2, textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '10px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>Gross</Typography>
                                    <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#3fb950' }}>{formatCurrency(safeStats.totalPayroll + safeStats.totalDeductions)}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, border: '1px solid #30363d', borderRadius: '8px', p: 2, textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '10px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>Deductions</Typography>
                                    <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#f85149' }}>{formatCurrency(safeStats.totalDeductions)}</Typography>
                                </Box>
                                <Box sx={{ flex: 1, border: '1px solid #30363d', borderRadius: '8px', p: 2, textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '10px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 0.5 }}>Net Pay</Typography>
                                    <Typography sx={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, color: '#8957e5' }}>{formatCurrency(safeStats.totalPayroll)}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', height: '100%', boxShadow: 'none' }}>
                        <Box sx={{ p: '14px 20px', borderBottom: '1px solid #30363d', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DeptIcon sx={{ color: '#7d8590', fontSize: '16px' }} />
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e6edf3' }}>
                                Dept. Breakdown
                            </Typography>
                        </Box>
                        <Box sx={{ p: '24px 20px' }}>
                            {deptBreakdown.map((dept, i) => {
                                const progress = maxDeptAmount > 0 ? (dept.amount / maxDeptAmount) * 100 : 0;
                                const color = getDeptColor(dept.name);
                                return (
                                    <Box key={dept.name} sx={{ mb: i !== deptBreakdown.length - 1 ? 2.5 : 0 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#e6edf3' }}>{dept.name}</Typography>
                                            <Typography sx={{ fontSize: '12px', color: color, fontWeight: 700 }}>{formatCurrency(dept.amount)}</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={progress}
                                            sx={{
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 2 }
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                            {deptBreakdown.length === 0 && (
                                <Typography sx={{ color: '#7d8590', fontSize: '13px', textAlign: 'center', py: 2 }}>
                                    No department payroll data available for this month.
                                </Typography>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccountantDashboard;
