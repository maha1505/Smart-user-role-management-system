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
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    EventNote as LeaveIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const HRLeaveApprovals = () => {
    const { user } = useSelector((state) => state.auth);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [actionType, setActionType] = useState('');
    const [comment, setComment] = useState('');

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/leaves');
            // HR sees all Stage 2 pending leaves
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch leave requests', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = (req, type) => {
        setSelectedReq(req);
        setActionType(type);
        setOpenDialog(true);
    };

    const submitApproval = async () => {
        try {
            await API.put(`/leaves/${selectedReq._id}/hr-approval`, { status: actionType, comment });
            setOpenDialog(false);
            setComment('');
            fetchRequests();
        } catch (err) {
            console.error('Approval failed', err);
        }
    };

    const getDuration = (start, end) => {
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = Math.abs(e - s);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LeaveIcon sx={{ color: '#f85149', fontSize: '24px' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                    Final Leave Approvals
                </Typography>
            </Box>

            <TableContainer component={Card} sx={{
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                boxShadow: 'none'
            }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ borderBottom: '1px solid #30363d' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Employee</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager Status</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.filter(r => r.managerApproval?.status === 'approved' && r.status === 'pending').map((req) => (
                            <TableRow key={req._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid #30363d' }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{
                                            width: 30,
                                            height: 30,
                                            bgcolor: 'rgba(56, 139, 253, 0.1)',
                                            color: '#58a6ff',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            fontFamily: 'Syne, sans-serif'
                                        }}>
                                            {req.user.name[0]}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                            {req.user.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={req.leaveType.toUpperCase()}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(110, 118, 129, 0.1)',
                                            color: '#7d8590',
                                            fontWeight: 700,
                                            fontSize: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid rgba(110, 118, 129, 0.2)'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#e6edf3', fontSize: '13px' }}>
                                    {getDuration(req.startDate, req.endDate)}
                                    <Typography sx={{ fontSize: '11px', color: '#7d8590' }}>
                                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '13px', maxWidth: '200px' }}>
                                    {req.reason}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <CheckIcon sx={{ color: '#3fb950', fontSize: '16px' }} />
                                        <Typography sx={{ color: '#3fb950', fontSize: '12px', fontWeight: 600 }}>Approved</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleAction(req, 'approved')}
                                            sx={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                bgcolor: '#238636',
                                                '&:hover': { bgcolor: '#2ea043' },
                                                px: 2,
                                                borderRadius: '6px',
                                                textTransform: 'none'
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleAction(req, 'rejected')}
                                            sx={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                borderColor: '#30363d',
                                                color: '#f85149',
                                                '&:hover': { bgcolor: 'rgba(248, 81, 73, 0.1)', borderColor: '#f85149' },
                                                px: 1.5,
                                                borderRadius: '6px',
                                                textTransform: 'none'
                                            }}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {requests.filter(r => r.managerApproval?.status === 'approved' && r.status === 'pending').length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '0 0 12px 12px' }}>
                    <Typography color="#7d8590" fontSize="14px">No pending final approvals at the moment.</Typography>
                </Box>
            )}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: { bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', color: '#e6edf3' }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                    {actionType === 'approved' ? 'Final Approval' : 'Reject Request'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: '#7d8590' }}>
                        Providing a comment for {selectedReq?.user.name}'s leave request.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Comment (Optional)"
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#e6edf3',
                                '& fieldset': { borderColor: '#30363d' },
                                '&:hover fieldset': { borderColor: '#8b949e' },
                                '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
                            },
                            '& .MuiInputLabel-root': { color: '#7d8590' }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setOpenDialog(false)} sx={{ color: '#7d8590', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={actionType === 'approved' ? 'success' : 'error'}
                        onClick={submitApproval}
                        sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HRLeaveApprovals;
