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
    Avatar,
    IconButton,
    CircularProgress,
    Tooltip,
    Chip,
} from '@mui/material';
import {
    CalendarMonth as LeaveIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const LeaveApprovalsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/leaves');
            setLeaves(data);
        } catch (err) {
            console.error('Fetch leaves failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleAction = async (id, status) => {
        try {
            await API.put(`/leaves/${id}/manager-approval`, { status });
            fetchLeaves();
        } catch (err) {
            console.error('Leave action failed', err);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LeaveIcon sx={{ color: '#58a6ff', fontSize: '24px' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                    Employee Leave Requests
                </Typography>
            </Box>

            <TableContainer component={Card} sx={{
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px'
            }}>
                <Table>
                    <TableHead sx={{ borderBottom: '1px solid #30363d' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Employee</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Type</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Duration</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Reason</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2, textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaves.map((leave) => (
                            <TableRow key={leave._id} sx={{ borderBottom: '1px solid #30363d' }}>
                                <TableCell sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '13px', fontWeight: 700 }}>
                                            {leave.user?.name?.[0]}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                            {leave.user?.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: '13px', color: '#8b949e' }}>
                                        {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: '13px', color: '#e6edf3' }}>
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#7d8590' }}>
                                        ({Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days)
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontSize: '13px', color: '#8b949e', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {leave.reason}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    {!leave.managerApproval?.status || leave.managerApproval.status === 'pending' ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Approve">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleAction(leave._id, 'approved')}
                                                    sx={{ bgcolor: 'rgba(63, 185, 80, 0.1)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)', borderRadius: '6px' }}
                                                >
                                                    <CheckIcon sx={{ fontSize: '18px' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reject">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleAction(leave._id, 'rejected')}
                                                    sx={{ bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '6px' }}
                                                >
                                                    <CloseIcon sx={{ fontSize: '18px' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    ) : (
                                        <Chip
                                            label={leave.managerApproval.status.toUpperCase()}
                                            size="small"
                                            sx={{
                                                bgcolor: leave.managerApproval.status === 'approved' ? 'rgba(63, 185, 80, 0.1)' : 'rgba(248, 81, 73, 0.1)',
                                                color: leave.managerApproval.status === 'approved' ? '#3fb950' : '#f85149',
                                                fontWeight: 700,
                                                fontSize: '10px'
                                            }}
                                        />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default LeaveApprovalsPage;
