import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    LinearProgress,
    Avatar,
    Grid,
    Paper,
    Chip,
    Tooltip
} from '@mui/material';
import {
    Close as CloseIcon,
    TrendingUp as TrendingUpIcon,
    InfoOutlined as InfoIcon,
    CalendarMonth as LeaveIcon,
    Assignment as TaskIcon,
    Timer as OvertimeIcon,
    Block as RejectedIcon,
    History as HistoryIcon
} from '@mui/icons-material';

const RiskBreakdownDrawer = ({ open, onClose, employeeData, history }) => {
    if (!employeeData) return null;

    const latest = history[0] || employeeData;
    const { score, level, topFactor, breakdown, calculatedAt } = latest;
    const employee = latest.employeeId || {};

    const getLevelColor = (level) => {
        switch (level) {
            case 'high': return '#f85149';
            case 'medium': return '#d29922';
            default: return '#3fb950';
        }
    };

    const signals = [
        { label: 'Unplanned Leaves', value: breakdown.leaveScore, icon: <LeaveIcon fontSize="small" />, color: '#58a6ff', weight: '30%' },
        { label: 'Pending Tasks', value: breakdown.taskScore, icon: <TaskIcon fontSize="small" />, color: '#bc8cff', weight: '25%' },
        { label: 'Overtime Risk', value: breakdown.overtimeScore, icon: <OvertimeIcon fontSize="small" />, color: '#79c0ff', weight: '25%' },
        { label: 'Rejected Leaves', value: breakdown.rejectedScore, icon: <RejectedIcon fontSize="small" />, color: '#ffa657', weight: '15%' },
        { label: 'Low Tenure', value: breakdown.tenureScore, icon: <HistoryIcon fontSize="small" />, color: '#ff7b72', weight: '5%' },
    ];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, bgcolor: '#0d1117', color: '#c9d1d9', borderLeft: '1px solid #30363d' }
            }}
        >
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>Risk Breakdown</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'inherit' }}><CloseIcon /></IconButton>
                </Box>

                {/* Profile Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, borderRadius: 2, bgcolor: '#161b22', border: '1px solid #30363d' }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: '#1f3958', color: '#58a6ff', fontWeight: 700 }}>{employee.name?.[0]}</Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{employee.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{employee.department}</Typography>
                        <Chip 
                            label={level.toUpperCase()} 
                            size="small" 
                            sx={{ mt: 1, height: 20, fontSize: '10px', fontWeight: 800, bgcolor: `${getLevelColor(level)}22`, color: getLevelColor(level), border: `1px solid ${getLevelColor(level)}44` }} 
                        />
                    </Box>
                </Box>

                {/* Overall Score */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: getLevelColor(level), mb: 1 }}>{score}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Overall Risk Probability</Typography>
                    <LinearProgress 
                        variant="determinate" 
                        value={score} 
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#30363d', '& .MuiLinearProgress-bar': { bgcolor: getLevelColor(level) } }} 
                    />
                </Box>

                {/* Top Factor Alert */}
                <Paper sx={{ p: 2, mb: 4, bgcolor: 'rgba(56, 139, 253, 0.1)', border: '1px solid rgba(56, 139, 253, 0.2)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TrendingUpIcon sx={{ color: '#58a6ff', fontSize: 20 }} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#58a6ff' }}>Primary Driver</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#c9d1d9' }}>
                        The highest risk contribution (<b>{topFactor}</b>) is primarily driving this score.
                    </Typography>
                </Paper>

                {/* Breakdown Bars */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: 1, color: 'text.secondary' }}>Contributor Breakdown</Typography>
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {signals.map((sig) => (
                        <Grid size={{ xs: 12 }} key={sig.label}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ color: sig.color, display: 'flex' }}>{sig.icon}</Box>
                                    <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{sig.label}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: sig.color }}>+{sig.value}%</Typography>
                            </Box>
                            <LinearProgress 
                                variant="determinate" 
                                value={(sig.value / parseInt(sig.weight)) * 100} 
                                sx={{ height: 4, borderRadius: 2, bgcolor: '#30363d', '& .MuiLinearProgress-bar': { bgcolor: sig.color } }} 
                            />
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ mb: 3, borderColor: '#30363d' }} />

                {/* History placeholder (mini chart or simple list) */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: 1, color: 'text.secondary' }}>Score History (Last {history.length})</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', height: 60, mb: 4 }}>
                    {[...history].reverse().map((h, i) => (
                        <Tooltip key={i} title={`${new Date(h.calculatedAt).toLocaleDateString()}: ${h.score}`}>
                            <Box sx={{ 
                                flex: 1, 
                                height: `${h.score}%`, 
                                bgcolor: getLevelColor(h.level), 
                                opacity: 0.6 + (i * 0.05),
                                borderRadius: '2px 2px 0 0'
                            }} />
                        </Tooltip>
                    ))}
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', display: 'block' }}>
                    Calculated on {new Date(calculatedAt).toLocaleString()}
                </Typography>
            </Box>
        </Drawer>
    );
};

export default RiskBreakdownDrawer;
