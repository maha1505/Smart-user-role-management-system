import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Avatar,
    IconButton,
} from '@mui/material';
import {
    Visibility as ViewIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/leaves');
            setLeaves(data);
        } catch (err) {
            console.error('Failed to fetch leaves', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const getStatusStyle = (status) => {
        if (!status) return { bgcolor: 'rgba(210, 153, 34, 0.15)', color: '#e3b341' };
        switch (status.toLowerCase()) {
            case 'approved': return { bgcolor: 'rgba(63, 185, 80, 0.15)', color: '#3fb950' };
            case 'rejected': return { bgcolor: 'rgba(248, 81, 73, 0.15)', color: '#f85149' };
            default: return { bgcolor: 'rgba(210, 153, 34, 0.15)', color: '#e3b341' };
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Leave Requests Oversight
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Review and oversee employee absence applications across the organization
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Absence Registry ({leaves.length})
                    </Typography>
                    {/* <IconButton size="small"><FilterIcon sx={{ fontSize: '16px' }} /></IconButton> */}
                </Box>
                <TableContainer>
                    <Table size="small" sx={{
                        '& .MuiTableCell-root': { py: 2, fontSize: '12px', borderBottom: '1px solid #30363d' },
                        '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '10px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d' }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Leave Type</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Status</TableCell>
                                {/* <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <TableRow key={leave._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '10px', fontWeight: 700 }}>
                                                {leave.user?.name?.[0] || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{leave.user?.name || 'Unknown'}</Typography>
                                                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>@{leave.user?.username || 'user'}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={leave.leaveType || 'Annual'}
                                            size="small"
                                            sx={{ fontSize: '9px', height: '18px', fontWeight: 700, borderRadius: '4px', bgcolor: 'background.paper', border: '1px solid #30363d' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} - {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                                            {leave.startDate && leave.endDate
                                                ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
                                                : 0} Days
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={leave.status}
                                            size="small"
                                            sx={{
                                                fontSize: '9px',
                                                height: '18px',
                                                fontWeight: 800,
                                                borderRadius: '10px',
                                                ...getStatusStyle(leave.status)
                                            }}
                                        />
                                    </TableCell>
                                    {/* <TableCell sx={{ textAlign: 'right' }}>
                                        <IconButton size="small" sx={{ border: '1px solid #30363d', borderRadius: '7px' }}>
                                            <ViewIcon sx={{ fontSize: '16px' }} />
                                        </IconButton>
                                    </TableCell> */}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">No leave requests found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default LeaveRequests;
