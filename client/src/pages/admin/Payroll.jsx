import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Avatar,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Stack
} from '@mui/material';
import {
    Payments as PayIcon,
    ReceiptLong as ReceiptIcon,
    Download as DownloadIcon,
    TrendingUp as ChartIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const Payroll = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: 'Total Monthly Payroll', value: '₹0', change: '0%', color: '#58a6ff' },
        { label: 'Avg Salary / Employee', value: '₹0', change: '0%', color: '#a371f7' },
        { label: 'Next Payment Date', value: 'Not Set', change: 'Upcoming', color: '#3fb950' },
    ]);
    const [payrollData, setPayrollData] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, payrollRes] = await Promise.all([
                API.get('/payroll/stats'),
                API.get('/payroll')
            ]);

            const s = statsRes.data.stats;
            setStats([
                {
                    label: `Total Payroll (${s.currentMonth || 'Current'})`,
                    value: `₹${s.totalPayroll.toLocaleString()}`,
                    change: `+${s.payslipsGenerated} slips`,
                    color: '#58a6ff'
                },
                {
                    label: 'Avg Salary / Employee',
                    value: `₹${s.avgSalary.toLocaleString()}`,
                    change: 'Current Month',
                    color: '#a371f7'
                },
                {
                    label: 'Total Deductions',
                    value: `₹${s.totalDeductions.toLocaleString()}`,
                    change: 'Current Month',
                    color: '#3fb950'
                },
            ]);

            setPayrollData(payrollRes.data);
        } catch (err) {
            console.error('Failed to fetch payroll data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExportCSV = () => {
        if (!payrollData || payrollData.length === 0) return;

        const headers = ['Recipient Name', 'Username', 'Department', 'Net Salary', 'Month', 'Last Activity'];
        const csvRows = [headers.join(',')];

        payrollData.forEach((p) => {
            const row = [
                p.employeeId?.name || 'Unknown',
                p.employeeId?.username || 'Unknown',
                p.employeeId?.department || 'N/A',
                p.netSalary,
                p.month,
                new Date(p.createdAt).toLocaleDateString()
            ];
            const formattedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
            csvRows.push(formattedRow);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `payroll_records_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                        Payroll Management
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Financial oversight, payslip generation and compensation tracking
                    </Typography>
                </Box>
                {/* <Button
                    variant="contained"
                    startIcon={<PayIcon />}
                    sx={{ bgcolor: '#1f6feb', '&:hover': { bgcolor: '#1a5fb4' }, fontSize: '12px' }}
                >
                    Run Payroll Cycle
                </Button> */}
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {stats.map((s, i) => (
                    <Grid item xs={12} md={4} key={i}>
                        <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, position: 'relative', overflow: 'hidden' }}>
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', bgcolor: s.color
                            }} />
                            <Box sx={{ p: 1, borderRadius: '8px', bgcolor: 'rgba(56, 139, 253, 0.1)', color: s.color }}>
                                <ChartIcon />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600 }}>{s.label}</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{s.value}</Typography>
                                <Typography sx={{ fontSize: '10px', color: s.color, fontWeight: 700 }}>{s.change}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card>
                <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Compensation registry
                    </Typography>
                    <Button size="small" onClick={handleExportCSV} startIcon={<DownloadIcon />} sx={{ fontSize: '10px' }}>Export CSV</Button>
                </Box>
                <TableContainer>
                    <Table size="small" sx={{
                        '& .MuiTableCell-root': { py: 2, fontSize: '12px', borderBottom: '1px solid #30363d' },
                        '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '10px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d' }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Recipient</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Net Salary</TableCell>
                                <TableCell>Month</TableCell>
                                <TableCell>Last Activity</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payrollData.length > 0 ? payrollData.map((p) => (
                                <TableRow key={p._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '10px', fontWeight: 700 }}>
                                                {p.employeeId?.name?.[0] || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{p.employeeId?.name || 'Unknown'}</Typography>
                                                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>@{p.employeeId?.username}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{p.employeeId?.department || 'N/A'}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>${p.netSalary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.month}
                                            size="small"
                                            sx={{
                                                fontSize: '9px', height: '18px', fontWeight: 800, borderRadius: '10px',
                                                bgcolor: 'rgba(56, 139, 253, 0.15)',
                                                color: '#58a6ff'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            size="small"
                                            onClick={() => setSelectedSlip(p)}
                                            sx={{ border: '1px solid #30363d', borderRadius: '7px', color: '#8957e5', '&:hover': { bgcolor: 'rgba(137, 87, 229, 0.1)' } }}
                                        >
                                            <ReceiptIcon sx={{ fontSize: '16px' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8, color: 'text.secondary' }}>
                                        No payroll records found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog
                open={!!selectedSlip}
                onClose={() => setSelectedSlip(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { bgcolor: '#161b22', border: '1px solid #30363d', backgroundImage: 'none', borderRadius: '12px' }
                }}
            >
                <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>PAYSLIP</Typography>
                        <Typography variant="caption" color="text.secondary">{selectedSlip?.month}</Typography>
                    </Box>
                    <ReceiptIcon sx={{ color: '#8957e5', fontSize: '32px' }} />
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 600, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMPLOYEE DETAILS</Typography>
                        <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>{selectedSlip?.employeeId?.name || 'Unknown'}</Typography>
                        <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>@{selectedSlip?.employeeId?.username} — {selectedSlip?.employeeId?.department || 'N/A'}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#30363d', mb: 3 }} />
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>Basic Salary</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>₹{selectedSlip?.basicSalary?.toLocaleString() || 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>Total Deductions</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#f85149' }}>- ₹{selectedSlip?.deductions?.toLocaleString() || 0}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: '#30363d', mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography sx={{ fontSize: '16px', fontWeight: 700 }}>Net Payable</Typography>
                            <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#58a6ff' }}>₹{selectedSlip?.netSalary?.toLocaleString() || 0}</Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid #30363d' }}>
                    <Button onClick={() => setSelectedSlip(null)} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}>Close</Button>
                    {/* <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        sx={{ bgcolor: '#1f6feb', '&:hover': { bgcolor: '#1a5fb4' }, textTransform: 'none', fontWeight: 600, fontSize: '12px' }}
                    >
                        Download PDF
                    </Button> */}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Payroll;
