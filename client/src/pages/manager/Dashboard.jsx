import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    IconButton,
    Button,
    LinearProgress,
} from '@mui/material';
import {
    People as PeopleIcon,
    TaskAlt as TaskIcon,
    CalendarMonth as LeaveIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useSelector } from 'react-redux';
import TeamRiskPanel from './components/TeamRiskPanel';


const StatCard = ({ title, value, subtext, icon, color, gradient }) => (
    <Card sx={{
        p: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: '#161b22',
        border: '1px solid #30363d',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient || color
        }
    }}>
        <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.5 }}>
            {title}
        </Typography>
        <Typography variant="h4" sx={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '32px',
            color: '#e6edf3',
            mb: 0.5
        }}>
            {value}
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#7d8590', fontWeight: 500 }}>
            {subtext}
        </Typography>
        <Box sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '32px',
            opacity: 0.1,
            color: color,
            display: 'flex'
        }}>
            {icon}
        </Box>
    </Card>
);

const ManagerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const { data } = await API.get('/users/manager-stats');
            setStats(data);
        } catch (err) {
            console.error('Fetch manager dashboard data failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await API.put(`/leaves/${id}/manager-approval`, { status });
            fetchDashboardData();
        } catch (err) {
            console.error('Leave action failed', err);
        }
    };

    if (loading) return null;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Team Size"
                            value={stats.stats.teamSize}
                            subtext={`${stats.department} dept`}
                            icon={<PeopleIcon sx={{ fontSize: '40px' }} />}
                            color="#58a6ff"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Pending Leaves"
                            value={stats.stats.pendingLeavesCount}
                            subtext="Needs review"
                            icon={<LeaveIcon sx={{ fontSize: '40px' }} />}
                            color="#d29922"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Tasks"
                            value={stats.stats.activeTasksCount}
                            subtext="Processing in team"
                            icon={<TaskIcon sx={{ fontSize: '40px' }} />}
                            color="#3fb950"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Overdue"
                            value={stats.stats.overdueTasksCount}
                            subtext="Attention needed"
                            icon={<WarningIcon sx={{ fontSize: '40px' }} />}
                            color="#f85149"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', minHeight: '400px' }}>
                        <Box sx={{ p: '16px 20px', display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #30363d' }}>
                            <LeaveIcon sx={{ color: '#58a6ff', fontSize: '18px' }} />
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                Leave Approvals (Stage 1)
                            </Typography>
                        </Box>
                        <Box sx={{ p: 0 }}>
                            {stats.recentLeaves.length > 0 ? stats.recentLeaves.map((leave, idx) => (
                                <Box key={leave._id} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: '16px 20px',
                                    borderBottom: idx === stats.recentLeaves.length - 1 ? 'none' : '1px solid #30363d'
                                }}>
                                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '14px', fontWeight: 700 }}>
                                        {leave.employeeId?.name?.[0]}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>
                                            {leave.employeeId?.name} — {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: '#f85149', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                                            <WarningIcon sx={{ fontSize: '12px' }} /> Needs approval
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAction(leave._id, 'approved')}
                                            sx={{ bgcolor: 'rgba(63, 185, 80, 0.1)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)', borderRadius: '6px' }}
                                        >
                                            <CheckIcon sx={{ fontSize: '18px' }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleAction(leave._id, 'rejected')}
                                            sx={{ bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '6px' }}
                                        >
                                            <CloseIcon sx={{ fontSize: '18px' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary" fontSize="13px">No pending leave requests.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', height: '100%' }}>
                        <Box sx={{ p: '16px 20px', display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #30363d' }}>
                            <TaskIcon sx={{ color: '#3fb950', fontSize: '18px' }} />
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                Task Summary
                            </Typography>
                        </Box>
                        <Box sx={{ p: '24px 20px' }}>
                            {[
                                { label: 'Completed', value: stats.stats.taskSummary.completed, color: '#3fb950' },
                                { label: 'In Progress', value: stats.stats.taskSummary.inProgress, color: '#58a6ff' },
                                { label: 'Not Started', value: stats.stats.taskSummary.notStarted, color: '#7d8590' },
                                { label: 'Overdue', value: stats.stats.taskSummary.overdue, color: '#f85149' },
                            ].map((item) => (
                                <Box key={item.label} sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</Typography>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(item.value / (Object.values(stats.stats.taskSummary).reduce((a, b) => a + b, 0) || 1)) * 100}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: 'rgba(110, 118, 129, 0.1)',
                                            '& .MuiLinearProgress-bar': { bgcolor: item.color }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <TeamRiskPanel />
            </Box>
        </Box>
    );
};

export default ManagerDashboard;
