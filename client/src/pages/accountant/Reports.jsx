import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    LinearProgress,
    CircularProgress,
    Divider
} from '@mui/material';
import { Assessment as ReportsIcon } from '@mui/icons-material';
import API from '../../api/api';

const AccountantReports = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const { data } = await API.get('/payroll/reports');
                setReports(data);
            } catch (err) {
                console.error('Failed to fetch accountant reports', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" sx={{ color: '#58a6ff' }} />
        </Box>
    );

    const formatCurrency = (amount) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`; // 1 decimal for K here
        }
        return `₹${amount}`;
    };

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

    const summaryData = reports?.monthlySummary || [];
    const deptData = reports?.departmentBreakdown || [];
    const maxDeptAmount = Math.max(...deptData.map(d => d.amount), 1);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ReportsIcon sx={{ color: '#3fb950', mr: 1, fontSize: '24px' }} />
                <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#e6edf3' }}>
                    Payroll Reports
                </Typography>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Card sx={{
                        p: 0,
                        bgcolor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        height: '100%'
                    }}>
                        <Box sx={{ p: '14px 20px', borderBottom: '1px solid #30363d' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e6edf3' }}>
                                Monthly Summary
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'table', width: '100%', borderCollapse: 'collapse' }}>
                            <Box sx={{ display: 'table-row', borderBottom: '1px solid #30363d' }}>
                                {['MONTH', 'EMPLOYEES', 'GROSS', 'DEDUCTIONS', 'NET'].map((header) => (
                                    <Box key={header} sx={{
                                        display: 'table-cell',
                                        p: '12px 20px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: '#7d8590',
                                        letterSpacing: '0.5px'
                                    }}>
                                        {header}
                                    </Box>
                                ))}
                            </Box>
                            {summaryData.length > 0 ? summaryData.map((row, index) => (
                                <Box key={index} sx={{
                                    display: 'table-row',
                                    borderBottom: index < summaryData.length - 1 ? '1px solid #30363d' : 'none',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                                }}>
                                    <Box sx={{ display: 'table-cell', p: '16px 20px', fontSize: '13px', color: '#e6edf3', fontWeight: 500 }}>
                                        {row.month}
                                    </Box>
                                    <Box sx={{ display: 'table-cell', p: '16px 20px', fontSize: '13px', color: '#7d8590' }}>
                                        {row.employees}
                                    </Box>
                                    <Box sx={{ display: 'table-cell', p: '16px 20px', fontSize: '13px', color: '#3fb950', fontWeight: 600 }}>
                                        {formatCurrency(row.gross)}
                                    </Box>
                                    <Box sx={{ display: 'table-cell', p: '16px 20px', fontSize: '13px', color: '#f85149', fontWeight: 600 }}>
                                        {formatCurrency(row.deductions)}
                                    </Box>
                                    <Box sx={{ display: 'table-cell', p: '16px 20px', fontSize: '13px', color: '#8957e5', fontWeight: 700 }}>
                                        {formatCurrency(row.net)}
                                    </Box>
                                </Box>
                            )) : (
                                <Box sx={{ display: 'table-row' }}>
                                    <Box sx={{ display: 'table-cell', colSpan: 5, p: 4, textAlign: 'center', color: '#7d8590', fontSize: '13px' }}>
                                        No historical payroll data available.
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card sx={{
                        p: 0,
                        bgcolor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        height: '100%'
                    }}>
                        <Box sx={{ p: '14px 20px', borderBottom: '1px solid #30363d' }}>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e6edf3' }}>
                                Department Breakdown
                            </Typography>
                        </Box>
                        <Box sx={{ p: '24px 20px' }}>
                            {deptData.length > 0 ? deptData.map((dept, i) => {
                                const progress = maxDeptAmount > 0 ? (dept.amount / maxDeptAmount) * 100 : 0;
                                const color = getDeptColor(dept.name);
                                return (
                                    <Box key={dept.name} sx={{ mb: i !== deptData.length - 1 ? 3.5 : 0 }}>
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
                            }) : (
                                <Typography sx={{ color: '#7d8590', fontSize: '13px', textAlign: 'center', py: 4 }}>
                                    No department payroll data available.
                                </Typography>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccountantReports;
