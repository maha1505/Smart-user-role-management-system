import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Chip, Button, Stack } from '@mui/material';
import { ReceiptLong, Download, Visibility } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import API from '../../api/api';

const MyPayroll = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlip, setSelectedSlip] = useState(null);

    const fetchMyPayroll = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/payroll/my');
            setPayslips(data.map(p => ({ ...p, id: p._id })));
        } catch (err) {
            console.error('Fetch my payroll failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPayroll();
    }, []);

    const columns = [
        { field: 'month', headerName: 'Month', width: 150 },
        {
            field: 'basicSalary',
            headerName: 'Basic Pay',
            width: 150,
            valueFormatter: (value) => value ? `₹${value}` : '₹0'
        },
        {
            field: 'deductions',
            headerName: 'Deductions',
            width: 150,
            valueFormatter: (value) => value ? `₹${value}` : '₹0'
        },
        {
            field: 'netSalary',
            headerName: 'Net Payable',
            width: 180,
            renderCell: (p) => <Typography fontWeight="bold" color="primary">₹{p.value || 0}</Typography>
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    startIcon={<Visibility />}
                    size="small"
                    onClick={() => setSelectedSlip(params.row)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    View Slip
                </Button>
            )
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="600">My Payslips</Typography>
                <Typography variant="body1" color="text.secondary">View your monthly salary statements</Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={selectedSlip ? 7 : 12}>
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <DataGrid
                            rows={payslips}
                            columns={columns}
                            loading={loading}
                            autoHeight
                            pageSize={5}
                            sx={{ border: 'none' }}
                        />
                    </Paper>
                </Grid>

                {selectedSlip && (
                    <Grid item xs={12} md={5}>
                        <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: 'primary.light', position: 'sticky', top: 100 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="700">PAYSLIP</Typography>
                                        <Typography variant="caption" color="text.secondary">{selectedSlip.month}</Typography>
                                    </Box>
                                    <ReceiptLong color="primary" sx={{ fontSize: 40 }} />
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Basic Salary</Typography>
                                        <Typography variant="body2" fontWeight="500">₹{selectedSlip.basicSalary}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">Deductions</Typography>
                                        <Typography variant="body2" fontWeight="500" color="error">- ₹{selectedSlip.deductions}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Typography variant="h6" fontWeight="600">Total Net Pay</Typography>
                                        <Typography variant="h6" fontWeight="700" color="primary">₹{selectedSlip.netSalary}</Typography>
                                    </Box>
                                </Box>

                                <Stack direction="row" spacing={2}>
                                    {/* <Button variant="contained" fullWidth startIcon={<Download />}>Download PDF</Button> */}
                                    <Button variant="outlined" onClick={() => setSelectedSlip(null)}>Close</Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default MyPayroll;
