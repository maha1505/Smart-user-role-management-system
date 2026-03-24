import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
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
    Button,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Tooltip
} from '@mui/material';
import {
    Warning as WarningIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
    FilterList as FilterIcon,
    ErrorOutline as StaleIcon,
    ChevronRight as DetailsIcon
} from '@mui/icons-material';
import { fetchAllRiskScores, recalculateRiskScores, fetchEmployeeRiskHistory, clearRiskSuccess } from '../../../store/riskSlice';
import RiskBreakdownDrawer from '../../shared/RiskBreakdownDrawer';

const WorkforceRiskPanel = () => {
    const dispatch = useDispatch();
    const { scores, loading, recalculating, successMessage } = useSelector(state => state.risk);
    const { user } = useSelector(state => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        dispatch(fetchAllRiskScores());
    }, [dispatch]);

    const handleRecalculate = () => {
        dispatch(recalculateRiskScores()).then(() => {
            dispatch(fetchAllRiskScores());
        });
    };

    const handleRowClick = (scoreData) => {
        setSelectedEmployee(scoreData);
        dispatch(fetchEmployeeRiskHistory(scoreData.employeeId._id));
        setDrawerOpen(true);
    };

    const filteredScores = scores.filter(s => {
        const matchesName = s.employeeId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === 'all' || s.level === filterLevel;
        return matchesName && matchesLevel;
    });

    const stats = {
        high: scores.filter(s => s.level === 'high').length,
        medium: scores.filter(s => s.level === 'medium').length,
        low: scores.filter(s => s.level === 'low').length,
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
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>Workforce Risk Analysis</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>AI-driven burnout and unplanned leave prediction</Typography>
                </Box>
                {['admin', 'hr'].includes(user?.role) && (
                    <Button
                        variant="contained"
                        startIcon={recalculating ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                        onClick={handleRecalculate}
                        disabled={recalculating}
                        sx={{ bgcolor: '#238636', '&:hover': { bgcolor: '#2ea043' }, textTransform: 'none', fontWeight: 600 }}
                    >
                        {recalculating ? 'Recalculating...' : 'Recalculate Now'}
                    </Button>
                )}
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: 'High Risk', count: stats.high, color: '#f85149', level: 'high' },
                    { label: 'Medium Risk', count: stats.medium, color: '#d29922', level: 'medium' },
                    { label: 'Low Risk', count: stats.low, color: '#3fb950', level: 'low' }
                ].map((stat) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                        <Card 
                            onClick={() => setFilterLevel(filterLevel === stat.level ? 'all' : stat.level)}
                            sx={{ 
                                bgcolor: '#161b22', 
                                border: '1px solid', 
                                borderColor: filterLevel === stat.level ? stat.color : '#30363d',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', borderColor: stat.color }
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>{stat.count}</Typography>
                                </Box>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${stat.color}11`, color: stat.color }}>
                                    <WarningIcon />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Filters */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { bgcolor: '#0d1117' } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: 2 }}>
                <Table sx={{ minWidth: { xs: 800, sm: '100%' } }}>
                    <TableHead sx={{ bgcolor: '#0d1117' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Employee</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, display: { xs: 'none', md: 'table-cell' } }}>Department</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Risk Level</TableCell>
                            <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 700 }}>Score</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700, display: { xs: 'none', lg: 'table-cell' } }}>Top Driver</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Last Updated</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress size={30} /></TableCell></TableRow>
                        ) : filteredScores.length === 0 ? (
                            <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No risk data found.</TableCell></TableRow>
                        ) : filteredScores.map((row) => (
                            <TableRow 
                                key={row._id} 
                                hover 
                                onClick={() => handleRowClick(row)}
                                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#1c2128' } }}
                            >
                                <TableCell sx={{ fontWeight: 600 }}>{row.employeeId?.name || 'Unknown'}</TableCell>
                                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.employeeId?.department}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.level.toUpperCase()} 
                                        size="small" 
                                        sx={{ 
                                            height: 20, 
                                            fontSize: '10px', 
                                            fontWeight: 800, 
                                            bgcolor: `${getLevelColor(row.level)}22`, 
                                            color: getLevelColor(row.level),
                                            border: `1px solid ${getLevelColor(row.level)}44`
                                        }} 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Typography sx={{ fontWeight: 700, color: getLevelColor(row.level) }}>{row.score}%</Typography>
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', color: 'text.secondary', display: { xs: 'none', lg: 'table-cell' } }}>{row.topFactor}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="caption">{new Date(row.calculatedAt).toLocaleDateString()}</Typography>
                                        {isStale(row.calculatedAt) && (
                                            <Tooltip title="Data may be stale (older than 48h)">
                                                <StaleIcon sx={{ color: '#d29922', fontSize: 16 }} />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" sx={{ color: 'text.secondary' }}><DetailsIcon size="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <RiskBreakdownDrawer 
                open={drawerOpen} 
                onClose={() => setDrawerOpen(false)} 
                employeeData={selectedEmployee}
                history={useSelector(state => state.risk.selectedEmployeeHistory)}
            />
        </Box>
    );
};

export default WorkforceRiskPanel;
