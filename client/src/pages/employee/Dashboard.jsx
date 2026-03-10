import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    MenuItem,
    Paper,
    Alert,
} from '@mui/material';
import { PostAdd, TaskAlt } from '@mui/icons-material';
import API from '../../api/api';

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
        <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
            {subtext}
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

const MyDashboard = () => {
    const [stats, setStats] = useState({ pending: 0, in_progress: 0, completed: 0 });
    const [leaveApplied, setLeaveApplied] = useState(false);
    const [leaveError, setLeaveError] = useState('');
    const [leaveData, setLeaveData] = useState({
        leaveType: 'sick',
        fromDate: '',
        toDate: '',
        reason: '',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/tasks/my');
                const counts = data.reduce((acc, t) => {
                    acc[t.status] = (acc[t.status] || 0) + 1;
                    return acc;
                }, { not_started: 0, in_progress: 0, completed: 0 });
                setStats({
                    pending: counts.not_started,
                    in_progress: counts.in_progress,
                    completed: counts.completed
                });
            } catch (err) {
                console.error('Fetch stats failed', err);
            }
        };
        fetchStats();
    }, []);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        setLeaveError('');
        try {
            await API.post('/leaves', leaveData);
            setLeaveApplied(true);
            setTimeout(() => setLeaveApplied(false), 5000);
        } catch (err) {
            setLeaveError(err.response?.data?.message || 'Leave application failed');
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Tasks Pending"
                            value={stats.pending}
                            subtext="Awaiting start"
                            icon={<TaskAlt sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.manager}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="In Progress"
                            value={stats.in_progress}
                            subtext="Currently working"
                            icon={<TaskAlt sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.admin}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StatCard
                            title="Completed"
                            value={stats.completed}
                            subtext="Total tasks finished"
                            icon={<TaskAlt sx={{ fontSize: 'inherit' }} />}
                            color={theme => theme.palette.roles.employee}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ height: '100%' }}>
                        <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                My Performance Insight
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'primary.main', mb: 1 }}>
                                {Math.round((stats.completed / (stats.pending + stats.in_progress + stats.completed || 1)) * 100)}%
                            </Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 2 }}>Task Completion Rate</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', maxWidth: 400, mx: 'auto' }}>
                                Your productivity is looking great! keep up the good work and stay focused on your active assignments.
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Quick Apply Leave
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            {leaveApplied && (
                                <Alert severity="success" sx={{ mb: 2, fontSize: '12px' }}>
                                    Leave application submitted!
                                </Alert>
                            )}
                            {leaveError && <Alert severity="error" sx={{ mb: 2, fontSize: '12px' }}>{leaveError}</Alert>}

                            <form onSubmit={handleApplyLeave}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Leave Type"
                                    margin="dense"
                                    value={leaveData.leaveType}
                                    onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                                    required
                                >
                                    <MenuItem value="sick">Sick Leave</MenuItem>
                                    <MenuItem value="casual">Casual Leave</MenuItem>
                                    <MenuItem value="earned">Earned Leave</MenuItem>
                                </TextField>

                                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="From"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={leaveData.fromDate}
                                        onChange={(e) => setLeaveData({ ...leaveData, fromDate: e.target.value })}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="To"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        value={leaveData.toDate}
                                        onChange={(e) => setLeaveData({ ...leaveData, toDate: e.target.value })}
                                        required
                                    />
                                </Box>

                                <TextField
                                    fullWidth
                                    size="small"
                                    multiline
                                    rows={2}
                                    label="Reason"
                                    margin="normal"
                                    value={leaveData.reason}
                                    onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                                    required
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    sx={{ mt: 1, py: 1, borderRadius: '8px' }}
                                >
                                    Submit Request
                                </Button>
                            </form>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MyDashboard;
