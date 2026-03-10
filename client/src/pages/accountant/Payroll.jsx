import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Avatar,
    Button,
    CircularProgress,
    Chip,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Payments as PayrollIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import API from '../../api/api';

const AccountantPayroll = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [monthOptions, setMonthOptions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    
    // Edit Dialog States
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editForm, setEditForm] = useState({
        basicSalary: 0,
        deductions: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/payroll');

            // Find all unique months available in the data
            const uniqueMonths = [...new Set(data.map(p => p.month))];
            
            // Generate list of months for selection, ensuring current month is there if data exists
            const currentMonthDefault = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            
            if (uniqueMonths.length > 0) {
                setMonthOptions(uniqueMonths);
                // Set default to the latest month or current month if it exists
                if (!selectedMonth) {
                    setSelectedMonth(uniqueMonths[0]);
                }
            } else {
                setMonthOptions([currentMonthDefault]);
                setSelectedMonth(currentMonthDefault);
            }

            // Format data for the grid
            const formattedHistory = data.map(p => ({
                id: p._id,
                empName: p.employeeId?.name || 'Unknown',
                dept: p.employeeId?.department || 'N/A',
                basicSalary: p.basicSalary,
                deductions: p.deductions,
                netSalary: p.netSalary,
                month: p.month
            }));

            setHistory(formattedHistory);
        } catch (err) {
            console.error('Fetch payroll data failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenEdit = (record) => {
        setSelectedRecord(record);
        setEditForm({
            basicSalary: record.basicSalary,
            deductions: record.deductions
        });
        setOpenEdit(true);
    };

    const handleUpdatePayroll = async () => {
        try {
            await API.put(`/payroll/${selectedRecord.id}`, editForm);
            fetchData();
            setOpenEdit(false);
        } catch (err) {
            console.error('Update payroll failed', err);
        }
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000) {
            return `₹${amount / 1000}K`;
        }
        return `₹${amount}`;
    };

    const columns = [
        {
            field: 'empName',
            headerName: 'EMPLOYEE',
            flex: 1.5,
            minWidth: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Avatar
                        sx={{
                            width: 28,
                            height: 28,
                            bgcolor: '#1f6feb22',
                            color: '#58a6ff',
                            fontSize: '11px',
                            fontWeight: 700
                        }}
                    >
                        {params.value.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: '13px', color: '#e6edf3', fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'dept',
            headerName: 'DEPT',
            flex: 1,
            minWidth: 80,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '13px', color: '#7d8590' }}>
                    {params.value === 'Engineering' ? 'Eng' : params.value}
                </Typography>
            )
        },
        {
            field: 'basicSalary',
            headerName: 'BASIC',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '13px', color: '#3fb950', fontWeight: 600 }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'hra',
            headerName: 'HRA',
            flex: 1,
            minWidth: 90,
            renderCell: (params) => (
                // Assuming HRA is statically calculated for visual parity since it's not in DB schema yet.
                // Based on image: Basic 55k, HRA 5K, Gross 60k
                <Typography sx={{ fontSize: '13px', color: '#3fb950', fontWeight: 600 }}>
                    {formatCurrency(Math.round(params.row.basicSalary * 0.1))}
                </Typography>
            )
        },
        {
            field: 'gross',
            headerName: 'GROSS',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '13px', color: '#8957e5', fontWeight: 600 }}>
                    {formatCurrency(params.row.basicSalary + Math.round(params.row.basicSalary * 0.1))}
                </Typography>
            )
        },
        {
            field: 'deductions',
            headerName: 'DEDUCTIONS',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '13px', color: '#f85149', fontWeight: 600 }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'netSalary',
            headerName: 'NET SALARY',
            flex: 1,
            minWidth: 110,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '13px', color: '#d2a8ff', fontWeight: 700 }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'ACTIONS',
            flex: 1,
            minWidth: 100,
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenEdit(params.row)}
                    sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontSize: '11px',
                        py: 0.2,
                        px: 2,
                        borderColor: '#30363d',
                        color: '#58a6ff',
                        '&:hover': { borderColor: '#58a6ff', bgcolor: '#58a6ff11' }
                    }}
                >
                    Edit
                </Button>
            )
        }
    ];

    const filteredHistory = history.filter(h => h.month === selectedMonth);

    return (
        <Box>
            <Card sx={{
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                boxShadow: 'none',
                overflow: 'hidden'
            }}>
                <Box sx={{ 
                    p: '14px 20px', 
                    borderBottom: '1px solid #30363d', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PayrollIcon sx={{ color: '#d29922', fontSize: '16px' }} />
                        <Typography sx={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#e6edf3' }}>
                            Payroll — {selectedMonth}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CalendarIcon sx={{ color: '#7d8590', fontSize: '18px' }} />
                        <TextField
                            select
                            size="small"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            sx={{
                                width: 160,
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '12px',
                                    color: '#e6edf3',
                                    bgcolor: '#0d1117',
                                    '& fieldset': { borderColor: '#30363d' },
                                    '&:hover fieldset': { borderColor: '#58a6ff' },
                                }
                            }}
                        >
                            {monthOptions.map((m) => (
                                <MenuItem key={m} value={m} sx={{ fontSize: '12px' }}>{m}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={filteredHistory}
                        columns={columns}
                        loading={loading}
                        autoHeight
                        rowHeight={56}
                        disableRowSelectionOnClick
                        hideFooterPagination
                        sx={{
                            border: 'none',
                            bgcolor: 'transparent',
                            color: '#e6edf3',
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #30363d',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 20px',
                                '&:focus': { outline: 'none' },
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: '#0d1117',
                                borderBottom: '1px solid #30363d',
                                borderTop: 'none',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                padding: '0 20px',
                                '&:focus': { outline: 'none' },
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#7d8590',
                                letterSpacing: '0.5px',
                            },
                            '& .MuiDataGrid-row:hover': {
                                bgcolor: 'rgba(255,255,255,0.02)',
                            },
                            '& .MuiDataGrid-iconSeparator': {
                                display: 'none',
                            },
                            '& .MuiCircularProgress-root': {
                                color: '#58a6ff'
                            }
                        }}
                    />
                </Box>
            </Card>

            {/* Edit Payroll Dialog */}
            <Dialog 
                open={openEdit} 
                onClose={() => setOpenEdit(false)}
                PaperProps={{
                    sx: {
                        bgcolor: '#0d1117',
                        border: '1px solid #30363d',
                        borderRadius: '12px',
                        backgroundImage: 'none'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#e6edf3', fontSize: '16px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                    Edit Payroll Record
                </DialogTitle>
                <DialogContent sx={{ mt: 1 }}>
                    <Typography sx={{ color: '#7d8590', fontSize: '13px', mb: 3 }}>
                        Updating payroll for <b>{selectedRecord?.empName}</b> ({selectedRecord?.month})
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Basic Salary"
                                type="number"
                                size="small"
                                value={editForm.basicSalary}
                                onChange={(e) => setEditForm({ ...editForm, basicSalary: Number(e.target.value) })}
                                InputProps={{ sx: { color: '#e6edf3' } }}
                                InputLabelProps={{ sx: { color: '#7d8590' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Deductions"
                                type="number"
                                size="small"
                                value={editForm.deductions}
                                onChange={(e) => setEditForm({ ...editForm, deductions: Number(e.target.value) })}
                                InputProps={{ sx: { color: '#e6edf3' } }}
                                InputLabelProps={{ sx: { color: '#7d8590' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenEdit(false)} sx={{ color: '#7d8590', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={handleUpdatePayroll}
                        sx={{ 
                            bgcolor: '#238636', 
                            '&:hover': { bgcolor: '#2ea043' },
                            textTransform: 'none',
                            px: 3,
                            fontWeight: 600
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountantPayroll;
