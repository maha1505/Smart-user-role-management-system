import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircle, Cancel, Info } from '@mui/icons-material';
import API from '../../api/api';

const LeaveApprovals = () => {
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
            setRequests(data.map(req => ({
                ...req,
                id: req._id,
                employeeName: req.employeeId?.name || 'Unknown'
            })));
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
            const endpoint = user.role === 'manager'
                ? `/leaves/${selectedReq._id}/manager-approval`
                : `/leaves/${selectedReq._id}/hr-approval`;

            await API.put(endpoint, { status: actionType, comment });
            setOpenDialog(false);
            setComment('');
            fetchRequests();
        } catch (err) {
            console.error('Approval failed', err);
        }
    };

    const columns = [
        { field: 'employeeName', headerName: 'Employee', width: 200 },
        { field: 'leaveType', headerName: 'Type', width: 120, renderCell: (params) => <Chip label={params.value.toUpperCase()} size="small" /> },
        { field: 'fromDate', headerName: 'From', width: 130, valueFormatter: (p) => new Date(p.value).toLocaleDateString() },
        { field: 'toDate', headerName: 'To', width: 130, valueFormatter: (p) => new Date(p.value).toLocaleDateString() },
        {
            field: 'status',
            headerName: 'Current Status',
            width: 250,
            renderCell: (params) => {
                const mgrStatus = params.row.managerApproval?.status || 'pending';
                const hrStatus = params.row.hrApproval?.status || 'pending';
                return (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip label={`MGR: ${mgrStatus}`} size="small" color={mgrStatus === 'approved' ? 'success' : 'warning'} variant="outlined" />
                        <Chip label={`HR: ${hrStatus}`} size="small" color={hrStatus === 'approved' ? 'success' : 'warning'} variant="outlined" />
                    </Box>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => {
                const canManagerApprove = user.role === 'manager' && params.row.managerApproval?.status === 'pending';
                const canHRApprove = user.role === 'hr' && params.row.managerApproval?.status === 'approved' && params.row.hrApproval?.status === 'pending';

                if (canManagerApprove || canHRApprove) {
                    return (
                        <Box>
                            <IconButton color="success" onClick={() => handleAction(params.row, 'approved')}><CheckCircle /></IconButton>
                            <IconButton color="error" onClick={() => handleAction(params.row, 'rejected')}><Cancel /></IconButton>
                        </Box>
                    );
                }
                return <IconButton disabled><Info /></IconButton>;
            }
        }
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="600" gutterBottom>
                Leave Requests Approval ({user.role === 'manager' ? 'Stage 1' : 'Stage 2'})
            </Typography>
            <Paper sx={{ mt: 3, p: { xs: 1, sm: 2 }, borderRadius: 3, overflowX: 'auto' }}>
                <DataGrid
                    rows={requests}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    pageSize={5}
                    sx={{ border: 'none' }}
                />
            </Paper>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{actionType === 'approved' ? 'Approve' : 'Reject'} Leave Request</DialogTitle>
                <DialogContent sx={{ minWidth: { xs: 'auto', sm: 400 } }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>Employee: {selectedReq?.employeeName}</Typography>
                    <TextField
                        fullWidth
                        label="Comment"
                        multiline
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" color={actionType === 'approved' ? 'success' : 'error'} onClick={submitApproval}>
                        Confirm {actionType}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LeaveApprovals;
