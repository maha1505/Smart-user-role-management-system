import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    Avatar,
    Button,
    Divider,
    IconButton,
    CircularProgress,
    List,
    ListItem,
} from '@mui/material';
import {
    People as PeopleIcon,
    Event as LeaveIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    ArrowForward as ViewAllIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StatCard = ({ title, value, subtext, icon, headerColor }) => (
    <Card sx={{
        bgcolor: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        p: 2.5,
        position: 'relative',
        height: '100%',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            bgcolor: headerColor,
            borderRadius: '12px 12px 0 0'
        }
    }}>
        <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', mb: 1.5 }}>
            {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: '#e6edf3', lineHeight: 1, mb: 0.5, fontFamily: 'Syne, sans-serif' }}>
                    {value}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#7d8590' }}>
                    {subtext}
                </Typography>
            </Box>
            <Box sx={{ color: '#30363d', opacity: 0.5 }}>
                {icon}
            </Box>
        </Box>
    </Card>
);

const ProgressBar = ({ label, value, maxValue, color }) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    return (
        <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#e6edf3' }}>{label}</Typography>
                <Typography sx={{ fontSize: '12px', color: color, fontWeight: 700 }}>{value}</Typography>
            </Box>
            <Box sx={{ width: '100%', height: '6px', bgcolor: 'rgba(48, 54, 61, 0.5)', borderRadius: '3px', overflow: 'hidden' }}>
                <Box
                    sx={{
                        width: `${percentage}%`,
                        height: '100%',
                        bgcolor: color,
                        borderRadius: '3px',
                        transition: 'width 1s ease-in-out'
                    }}
                />
            </Box>
        </Box>
    );
};

const HRDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users/hr-stats');
            setStats(data);
        } catch (err) {
            console.error('HR Dashboard fetch failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await API.put(`/leaves/${id}/hr-approval`, { status: action });
            fetchData();
        } catch (err) {
            console.error('Leave action failed', err);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Employees"
                        value={stats?.stats.totalEmployees || 0}
                        subtext="Active accounts"
                        icon={<PeopleIcon sx={{ fontSize: '40px' }} />}
                        headerColor="#388bfd"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Leave (Stage 2)"
                        value={stats?.stats.pendingLeavesCount || 0}
                        subtext="Needs HR approval"
                        icon={<LeaveIcon sx={{ fontSize: '40px' }} />}
                        headerColor="#f85149"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Approved This Month"
                        value={stats?.stats.approvedThisMonth || 0}
                        subtext="Leave requests"
                        icon={<ApprovedIcon sx={{ fontSize: '40px' }} />}
                        headerColor="#3fb950"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Rejected"
                        value={stats?.stats.rejectedThisMonth || 0}
                        subtext="This month"
                        icon={<RejectedIcon sx={{ fontSize: '40px' }} />}
                        headerColor="#d29922"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Pending Approvals */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ApprovedIcon sx={{ color: '#58a6ff', fontSize: '18px' }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                    Pending Final Approvals
                                </Typography>
                            </Box>
                            <Button
                                size="small"
                                onClick={() => navigate('/hr/leaves')}
                                sx={{ color: '#58a6ff', fontSize: '12px', textTransform: 'none', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                            >
                                View All
                            </Button>
                        </Box>
                        <List sx={{ p: 0, flexGrow: 1 }}>
                            {stats?.recentApprovals?.length > 0 ? stats.recentApprovals.map((leave, index) => (
                                <ListItem
                                    key={leave._id}
                                    sx={{
                                        px: 2.5,
                                        py: 2,
                                        borderBottom: index === stats.recentApprovals.length - 1 ? 'none' : '1px solid #30363d',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            bgcolor: 'rgba(88, 166, 255, 0.1)',
                                            color: '#58a6ff',
                                            width: 36,
                                            height: 36,
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            fontFamily: 'Syne, sans-serif'
                                        }}>
                                            {leave.employeeId.name[0]}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                                {leave.employeeId.name} — {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: 'rgba(63, 185, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ApprovedIcon sx={{ fontSize: '8px', color: '#3fb950' }} />
                                                </Box>
                                                <Typography sx={{ fontSize: '11px', color: '#7d8590' }}>Manager approved</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleAction(leave._id, 'approved')}
                                            sx={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                borderColor: 'rgba(63, 185, 80, 0.4)',
                                                bgcolor: 'rgba(63, 185, 80, 0.1)',
                                                color: '#3fb950',
                                                '&:hover': { bgcolor: 'rgba(63, 185, 80, 0.2)', borderColor: '#3fb950' },
                                                px: 2,
                                                borderRadius: '6px'
                                            }}
                                        >
                                            ✓ Final
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleAction(leave._id, 'rejected')}
                                            sx={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                borderColor: 'rgba(248, 81, 73, 0.4)',
                                                bgcolor: 'rgba(248, 81, 73, 0.1)',
                                                color: '#f85149',
                                                '&:hover': { bgcolor: 'rgba(248, 81, 73, 0.2)', borderColor: '#f85149' },
                                                minWidth: '32px',
                                                px: 1.5,
                                                borderRadius: '6px'
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                </ListItem>
                            )) : (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="#7d8590" fontSize="13px">No pending final approvals at the moment.</Typography>
                                </Box>
                            )}
                        </List>
                    </Card>
                </Grid>

                {/* Leave Stats */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', p: 3, height: '100%' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Syne, sans-serif', mb: 3.5 }}>
                            Leave Stats
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {stats?.stats.leaveStats && (
                                <>
                                    <ProgressBar
                                        label="Approved"
                                        value={stats.stats.leaveStats.approvedDept}
                                        maxValue={stats.stats.totalEmployees * 2} // Scaled for visual representation
                                        color="#3fb950"
                                    />
                                    <ProgressBar
                                        label="Pending"
                                        value={stats.stats.leaveStats.pendingDept}
                                        maxValue={stats.stats.totalEmployees * 2}
                                        color="#d29922"
                                    />
                                    <ProgressBar
                                        label="Rejected"
                                        value={stats.stats.leaveStats.rejectedDept}
                                        maxValue={stats.stats.totalEmployees * 2}
                                        color="#f85149"
                                    />
                                </>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HRDashboard;
