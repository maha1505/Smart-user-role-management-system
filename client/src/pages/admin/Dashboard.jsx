import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Button,
    Avatar,
    Chip,
    IconButton,
} from '@mui/material';
import {
    People as PeopleIcon,
    HourglassTop as PendingIcon,
    TaskAlt as TaskIcon,
    Event as LeaveIcon,
    History as AuditIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Terminal as TerminalIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, subtext, icon, color, gradient }) => (
    <Card sx={{
        p: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: gradient || `linear-gradient(90deg, ${color}, ${color}88)`
        }
    }}>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
            {title}
        </Typography>
        <Typography variant="h4" sx={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            color: 'text.primary',
            mb: 0.5
        }}>
            {value}
        </Typography>
        <Typography sx={{ fontSize: '11px', color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box component="span" sx={{ color: color, fontWeight: 700 }}>{subtext.split(' ')[0]}</Box> {subtext.split(' ').slice(1).join(' ')}
        </Typography>
        <Box sx={{
            position: 'absolute',
            right: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '32px',
            opacity: 0.15,
            color: color,
            display: 'flex'
        }}>
            {icon}
        </Box>
    </Card>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        counts: {
            totalEmployees: 0,
            newThisMonth: 0,
            pendingApprovalsCount: 0,
            activeTasksCount: 0,
            totalLeaves: 0
        },
        recentRegistrations: [],
        recentLogs: [],
        departments: []
    });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const { data } = await API.get('/users/stats');
            setStats({
                counts: data.stats,
                recentRegistrations: data.recentRegistrations,
                recentLogs: data.recentLogs,
                departments: data.departments
            });
        } catch (err) {
            console.error('Fetch dashboard data failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApproveUser = async (id) => {
        try {
            await API.put(`/users/${id}/status`, { registrationStatus: 'approved' });
            fetchDashboardData(); // Refresh all stats
        } catch (err) {
            console.error('Approve failed', err);
        }
    };

    const handleRejectUser = async (id) => {
        try {
            await API.put(`/users/${id}/status`, { registrationStatus: 'rejected' });
            fetchDashboardData();
        } catch (err) {
            console.error('Reject failed', err);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Total Employees"
                            value={stats.counts.totalEmployees}
                            subtext={`+${stats.counts.newThisMonth} this month`}
                            icon={<PeopleIcon sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.employee}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Pending Approvals"
                            value={stats.counts.pendingApprovalsCount}
                            subtext="Requires attention"
                            icon={<PendingIcon sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.manager}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Active Tasks"
                            value={stats.counts.activeTasksCount}
                            subtext="Tasks in progress"
                            icon={<TaskIcon sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.admin}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Leave Requests"
                            value={stats.counts.totalLeaves}
                            subtext="Across all stages"
                            icon={<LeaveIcon sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.hr}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <Box sx={{ p: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Pending Registrations
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/admin/pending')}
                                sx={{ fontSize: '11px', color: 'primary.main', minWidth: 'auto', p: 0, textTransform: 'none' }}
                            >
                                View All
                            </Button>
                        </Box>
                        <Box sx={{ p: '14px 16px' }}>
                            {stats.recentRegistrations.length > 0 ? stats.recentRegistrations.map((user) => (
                                <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
                                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '11px', fontWeight: 700 }}>
                                        {user.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{user.name}</Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>{user.department?.name || user.department || 'Unassigned'} · {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</Typography>
                                    </Box>
                                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleApproveUser(user._id)}
                                            sx={{ p: '4px', bgcolor: 'rgba(63, 185, 80, 0.1)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)', borderRadius: '6px' }}
                                        >
                                            <CheckIcon sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRejectUser(user._id)}
                                            sx={{ p: '4px', bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '6px' }}
                                        >
                                            <CancelIcon sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            )) : (
                                <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">No pending registrations found.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Departments
                            </Typography>
                        </Box>
                        <Box sx={{ p: '14px 16px' }}>
                            {stats.departments.length > 0 ? stats.departments.map((dept, index) => {
                                const colors = ['#58a6ff', '#a371f7', '#f85149', '#3fb950', '#d29922'];
                                const color = colors[index % colors.length];
                                return (
                                    <Box key={dept.name} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 500 }}>{dept.name}</Typography>
                                            <Typography sx={{ fontSize: '11px', color: color, fontWeight: 700 }}>{dept.count}</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={(dept.count / (stats.counts.totalEmployees || 1)) * 100}
                                            sx={{
                                                height: 5,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                                '& .MuiLinearProgress-bar': { bgcolor: color }
                                            }}
                                        />
                                    </Box>
                                );
                            }) : (
                                <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">No department data available.</Typography>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <Box sx={{ p: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Recent Audit Logs
                            </Typography>
                            <Button
                                size="small"
                                onClick={() => navigate('/admin/logs')}
                                sx={{ fontSize: '11px', color: 'primary.main', minWidth: 'auto', p: 0, textTransform: 'none' }}
                            >
                                View All
                            </Button>
                        </Box>
                        <TableContainer sx={{ px: 2, pb: 2 }}>
                            <Table size="small" sx={{
                                '& .MuiTableCell-root': { py: 1.5, fontSize: '12px', borderBottom: '1px solid #30363d' },
                                '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '10px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d' }
                            }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Resource</TableCell>
                                        <TableCell>IP</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.recentLogs.length > 0 ? stats.recentLogs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{ width: 22, height: 22, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '9px', fontWeight: 700 }}>
                                                        {log.userId?.name?.[0] || 'S'}
                                                    </Avatar>
                                                    <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{log.userId?.name || 'System'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.action}
                                                    size="small"
                                                    sx={{
                                                        fontSize: '8px',
                                                        height: '16px',
                                                        bgcolor: 'rgba(56, 139, 253, 0.1)',
                                                        color: '#58a6ff',
                                                        fontWeight: 800,
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(56, 139, 253, 0.2)'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{log.resource}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '10px', fontFamily: 'monospace' }}>{log.Ip || '192.168.1.1'}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '11px' }}>
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                                <Typography color="text.secondary">No activity logs recorded yet.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
