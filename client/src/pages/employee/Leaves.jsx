import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Chip, 
    Stack, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    MenuItem, 
    Alert 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import API from '../../api/api';

const LeaveHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyOpen, setApplyOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        leaveType: 'casual',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/leaves?self=true');
            setHistory(data.map((h, index) => ({ ...h, id: h._id || index })));
        } catch (err) {
            console.error('Fetch leave history failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleApply = async () => {
        setError(null);
        if (!formData.fromDate || !formData.toDate || !formData.reason) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setSubmitting(true);
            await API.post('/leaves', formData);
            setApplyOpen(false);
            fetchHistory();
        } catch (err) {
            console.error('Apply leave failed', err);
            setError(err.response?.data?.message || 'Failed to submit leave request.');
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            field: 'leaveType',
            headerName: 'Type',
            width: 130,
            renderCell: (p) => <Chip label={(p.value || '').toUpperCase()} size="small" variant="outlined" />
        },
        {
            field: 'startDate',
            headerName: 'From',
            width: 130,
            valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : ''
        },
        {
            field: 'endDate',
            headerName: 'To',
            width: 130,
            valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : ''
        },
        {
            field: 'approvals',
            headerName: 'Approval Status',
            width: 350,
            renderCell: (params) => {
                const mgr = params.row.managerApproval?.status || 'pending';
                const hr = params.row.hrApproval?.status || 'pending';
                return (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip label={`Manager: ${mgr}`} size="small" sx={{
                            bgcolor: mgr === 'approved' ? 'rgba(63, 185, 80, 0.1)' : mgr === 'rejected' ? 'rgba(248, 81, 73, 0.1)' : 'rgba(210, 153, 34, 0.1)',
                            color: mgr === 'approved' ? '#3fb950' : mgr === 'rejected' ? '#f85149' : '#d29922',
                            fontWeight: 700,
                            fontSize: '10px'
                        }} />
                        <Chip label={`HR: ${hr}`} size="small" sx={{
                            bgcolor: hr === 'approved' ? 'rgba(63, 185, 80, 0.1)' : hr === 'rejected' ? 'rgba(248, 81, 73, 0.1)' : 'rgba(210, 153, 34, 0.1)',
                            color: hr === 'approved' ? '#3fb950' : hr === 'rejected' ? '#f85149' : '#d29922',
                            fontWeight: 700,
                            fontSize: '10px'
                        }} />
                    </Stack>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Final Decision',
            width: 150,
            renderCell: (p) => {
                const status = p.value || 'pending';
                return (
                    <Chip
                        label={status.toUpperCase()}
                        sx={{
                            bgcolor: status === 'approved' ? 'rgba(63, 185, 80, 0.1)' : status === 'rejected' ? 'rgba(248, 81, 73, 0.1)' : 'rgba(210, 153, 34, 0.1)',
                            color: status === 'approved' ? '#3fb950' : status === 'rejected' ? '#f85149' : '#d29922',
                            fontWeight: 800,
                            fontSize: '11px'
                        }}
                    />
                );
            }
        },
    ];

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>My Leave History</Typography>
                    <Typography variant="body2" color="text.secondary">Track the real-time status of your leave applications</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setApplyOpen(true)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    Apply Leave
                </Button>
            </Box>

            <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#161b22', border: '1px solid #30363d' }}>
                <DataGrid
                    rows={history}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    pageSize={5}
                    sx={{ 
                        border: 'none',
                        '& .MuiDataGrid-cell': { borderBottom: '1px solid #30363d' },
                        '& .MuiDataGrid-columnHeaders': { borderBottom: '1px solid #30363d' },
                        color: 'white'
                    }}
                />
            </Paper>

            {/* Apply Leave Dialog */}
            <Dialog open={applyOpen} onClose={() => !submitting && setApplyOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Apply for Leave
                </DialogTitle>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Leave Type"
                            value={formData.leaveType}
                            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                        >
                            <MenuItem value="casual">Casual Leave</MenuItem>
                            <MenuItem value="sick">Sick Leave</MenuItem>
                            <MenuItem value="earned">Earned Leave</MenuItem>
                        </TextField>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                fullWidth
                                label="From"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.fromDate}
                                onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="To"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.toDate}
                                onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                            />
                        </Stack>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Reason for Leave"
                            placeholder="Please provide a brief reason for your leave request"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Button onClick={() => setApplyOpen(false)} color="inherit" disabled={submitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleApply} 
                        variant="contained" 
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LeaveHistory;
