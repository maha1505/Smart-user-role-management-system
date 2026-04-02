import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    ErrorOutline as StaleIcon,
    ChevronRight as DetailsIcon
} from '@mui/icons-material';
import { fetchTeamRiskScores, fetchEmployeeRiskHistory } from '../../../store/riskSlice';
import RiskBreakdownDrawer from '../../shared/RiskBreakdownDrawer';

const TeamRiskPanel = () => {
    const dispatch = useDispatch();
    const { scores, loading } = useSelector(state => state.risk);
    const riskHistory = useSelector(state => state.risk.selectedEmployeeHistory);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        dispatch(fetchTeamRiskScores());
    }, [dispatch]);

    const handleRowClick = (scoreData) => {
        setSelectedEmployee(scoreData);
        dispatch(fetchEmployeeRiskHistory(scoreData.employeeId._id));
        setDrawerOpen(true);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'high': return '#f85149';
            case 'medium': return '#d29922';
            default: return '#3fb950';
        }
    };

    const isStale = (date) => {
        const hours = (new Date() - new Date(date)) / (1000 * 60 * 60);
        return hours > 48;
    };

    return (
        <Card sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: 2, mb: 4 }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>My Team's Risk Risk Signals</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Monitoring employee well-being and leave probability</Typography>
                </Box>

                <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1px solid #30363d' }}>Employee</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1px solid #30363d' }}>Risk Level</TableCell>
                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 700, borderBottom: '1px solid #30363d' }}>Score</TableCell>
                                <TableCell align="right" sx={{ borderBottom: '1px solid #30363d' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><CircularProgress size={24} /></TableCell></TableRow>
                            ) : scores.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No team risk data found.</TableCell></TableRow>
                            ) : scores.map((row) => (
                                <TableRow 
                                    key={row._id} 
                                    hover
                                    onClick={() => handleRowClick(row)}
                                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#1c2128' }, '& td': { borderBottom: '1px solid #30363d' } }}
                                >
                                    <TableCell sx={{ fontWeight: 600 }}>{row.employeeId?.name || 'Unknown'}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.level.toUpperCase()} 
                                            size="small" 
                                            sx={{ 
                                                height: 18, 
                                                fontSize: '9px', 
                                                fontWeight: 800, 
                                                bgcolor: `${getLevelColor(row.level)}22`, 
                                                color: getLevelColor(row.level),
                                                border: `1px solid ${getLevelColor(row.level)}44`
                                            }} 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            <Typography sx={{ fontWeight: 700, fontSize: '13px', color: getLevelColor(row.level) }}>{row.score}%</Typography>
                                            {isStale(row.calculatedAt) && <StaleIcon sx={{ color: '#d29922', fontSize: 14 }} />}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" sx={{ color: 'text.secondary' }}><DetailsIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>

            <RiskBreakdownDrawer 
                open={drawerOpen} 
                onClose={() => setDrawerOpen(false)} 
                employeeData={selectedEmployee}
                history={riskHistory}
            />
        </Card>
    );
};

export default TeamRiskPanel;
