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
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
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

    const handleAction = async (id, status, stage) => {
        try {
            const endpoint = stage === 'manager' 
                ? `/leaves/${id}/manager-approval` 
                : `/leaves/${id}/hr-approval`;
            
            await API.put(endpoint, { status });
            fetchLeaves();
        } catch (err) {
            console.error('Leave action failed', err);
        }
    };

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
                                <TableCell sx={{ textAlign: 'right' }}>Actions</TableCell>
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
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            {/* Restricted Users: Single Stage Admin Approval */}
                                            {(() => {
                                                const isRestricted = ['hr', 'manager', 'accountant'].includes(leave.user?.role) || leave.user?.department === 'Management';
                                                
                                                if (isRestricted && leave.status === 'pending') {
                                                    return (
                                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                            <Typography sx={{ fontSize: '10px', color: '#7d8590', mr: 1 }}>Admin Approval:</Typography>
                                                            <Tooltip title="Approve Request (Complete)">
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleAction(leave._id, 'approved', 'manager')}
                                                                    sx={{ color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                >
                                                                    <CheckIcon sx={{ fontSize: '14px' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Reject Request (Complete)">
                                                                <IconButton 
                                                                    size="small" 
                                                                    onClick={() => handleAction(leave._id, 'rejected', 'manager')}
                                                                    sx={{ color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                >
                                                                    <CloseIcon sx={{ fontSize: '14px' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    );
                                                }

                                                // Normal Users: Two Stage Approval
                                                return (
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        {(!leave.managerApproval?.status || leave.managerApproval.status === 'pending') && leave.status === 'pending' && (
                                                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                                <Typography sx={{ fontSize: '10px', color: '#7d8590', mr: 1 }}>Stage 1:</Typography>
                                                                <Tooltip title="Approve (Manager Stage)">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleAction(leave._id, 'approved', 'manager')}
                                                                        sx={{ color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: '14px' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Reject (Manager Stage)">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleAction(leave._id, 'rejected', 'manager')}
                                                                        sx={{ color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                    >
                                                                        <CloseIcon sx={{ fontSize: '14px' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}

                                                        {leave.managerApproval?.status === 'approved' && (!leave.hrApproval?.status || leave.hrApproval.status === 'pending') && leave.status === 'pending' && (
                                                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                                                <Typography sx={{ fontSize: '10px', color: '#7d8590', mr: 1 }}>Stage 2:</Typography>
                                                                <Tooltip title="Final Approval (HR Stage)">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleAction(leave._id, 'approved', 'hr')}
                                                                        sx={{ color: '#58a6ff', border: '1px solid rgba(88, 166, 255, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                    >
                                                                        <CheckIcon sx={{ fontSize: '14px' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Final Reject (HR Stage)">
                                                                    <IconButton 
                                                                        size="small" 
                                                                        onClick={() => handleAction(leave._id, 'rejected', 'hr')}
                                                                        sx={{ color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)', borderRadius: '4px', p: '2px' }}
                                                                    >
                                                                        <CloseIcon sx={{ fontSize: '14px' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })()}
                                        </Box>
                                    </TableCell>
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
