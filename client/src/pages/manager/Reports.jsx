import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import {
    BarChart as ReportsIcon,
    TrendingUp as TrendIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const ReportsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users/manager-reports');
            setData(data);
        } catch (err) {
            console.error('Fetch reports failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <ReportsIcon sx={{ color: '#fff', fontSize: '18px' }} />
                </Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#f0f6fc' }}>
                    Progress Reports
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Team Task Progress */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        p: 3, 
                        bgcolor: '#0d1117', 
                        border: '1px solid #21262d', 
                        borderRadius: '12px',
                        height: '100%'
                    }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: 4, color: '#f0f6fc' }}>
                            Team Task Progress
                        </Typography>
                        
                        {data.teamProgress && data.teamProgress.length > 0 ? data.teamProgress.map((member, index) => {
                            const colors = ['#58a6ff', '#3fb950', '#f85149', '#a371f7', '#ffb347'];
                            const memberColor = colors[index % colors.length];
                            return (
                                <Box key={index} sx={{ mb: 3.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#f0f6fc' }}>{member.name}</Typography>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: memberColor }}>{member.value}%</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={member.value} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4, 
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: memberColor,
                                                borderRadius: 4
                                            }
                                        }} 
                                    />
                                </Box>
                            );
                        }) : (
                            <Typography sx={{ color: '#8b949e', fontSize: '13px', textAlign: 'center', py: 4 }}>No team members found.</Typography>
                        )}
                    </Card>
                </Grid>

                {/* Task Status Breakdown */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ 
                        p: 3, 
                        bgcolor: '#0d1117', 
                        border: '1px solid #21262d', 
                        borderRadius: '12px',
                        height: '100%'
                    }}>
                        <Typography sx={{ fontSize: '15px', fontWeight: 700, mb: 4, color: '#f0f6fc' }}>
                            Task Status Breakdown
                        </Typography>

                        {data.distribution && data.distribution.length > 0 ? data.distribution.filter(d => d.name !== 'Not Started').map((status, index) => {
                            const colors = {
                                'Completed': '#3fb950',
                                'In Progress': '#58a6ff',
                                'Overdue': '#f85149'
                            };
                            const totalTasks = data.distribution.reduce((acc, curr) => acc + curr.value, 0);
                            return (
                                <Box key={index} sx={{ mb: 3.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#f0f6fc' }}>{status.name}</Typography>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors[status.name] || '#8b949e' }}>{status.value} tasks</Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={totalTasks > 0 ? (status.value / totalTasks) * 100 : 0} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4, 
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: colors[status.name] || '#8b949e',
                                                borderRadius: 4
                                            }
                                        }} 
                                    />
                                </Box>
                            );
                        }) : (
                            <Typography sx={{ color: '#8b949e', fontSize: '13px', textAlign: 'center', py: 4 }}>No task data available.</Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReportsPage;
