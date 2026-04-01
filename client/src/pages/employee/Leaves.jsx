import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import API from '../../api/api';

const LeaveHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await API.get('/leaves?self=true');
                setHistory(data.map((h, index) => ({ ...h, id: h._id || index })));
            } catch (err) {
                console.error('Fetch leave history failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

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
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="600">My Leave History</Typography>
                <Typography variant="body2" color="text.secondary">Track the real-time status of your leave applications</Typography>
            </Box>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
                <DataGrid
                    rows={history}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    pageSize={5}
                    sx={{ border: 'none' }}
                />
            </Paper>
        </Box>
    );
};

export default LeaveHistory;
