import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    HourglassTop as PendingIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const PendingApprovals = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionDialog, setActionDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');
    const [formData, setFormData] = useState({
        role: 'employee',
        department: '',
        rejectionReason: ''
    });

    const fetchDepartments = async () => {
        try {
            const { data } = await API.get('/users/departments');
            setDepartments(data);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        }
    };

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users');
            setPendingUsers(data.filter(u => u.registrationStatus === 'pending'));
        } catch (err) {
            console.error('Failed to fetch pending users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
        fetchDepartments();
    }, []);

    const handleOpenAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setFormData({
            role: 'employee',
            department: user.department || '', // Pre-fill with registered department
            rejectionReason: ''
        });
        setActionDialog(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const payload = {
                registrationStatus: actionType === 'approve' ? 'approved' : 'rejected',
                role: formData.role,
                department: formData.department,
                rejectionReason: formData.rejectionReason
            };
            await API.put(`/users/${selectedUser._id}/status`, payload);
            setActionDialog(false);
            fetchPendingUsers();
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Pending Approvals
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Review and authorize new system registration requests
                </Typography>
            </Box>

            <Card>
                <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Waiting for Authorization ({pendingUsers.length})
                    </Typography>
                </Box>
                <TableContainer>
                    <Table size="small" sx={{
                        minWidth: { xs: 700, sm: '100%' },
                        '& .MuiTableCell-root': { py: 2, fontSize: '12px', borderBottom: '1px solid #30363d' },
                        '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '10px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d' }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Requester</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Requested On</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '12px', fontWeight: 700 }}>
                                                {user.name[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{user.name}</Typography>
                                                <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>@{user.username}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label="External Registration"
                                            size="small"
                                            sx={{ fontSize: '9px', height: '18px', bgcolor: 'rgba(210, 153, 34, 0.15)', color: '#d29922', fontWeight: 700, borderRadius: '10px' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
                                                onClick={() => handleOpenAction(user, 'approve')}
                                                sx={{ fontSize: '10px', height: '26px', border: '1px solid #30363d', color: '#3fb950', '&:hover': { bgcolor: 'rgba(63, 185, 80, 0.1)' } }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<CancelIcon sx={{ fontSize: '14px !important' }} />}
                                                onClick={() => handleOpenAction(user, 'reject')}
                                                sx={{ fontSize: '10px', height: '26px', border: '1px solid #30363d', color: '#f85149', '&:hover': { bgcolor: 'rgba(248, 81, 73, 0.1)' } }}
                                            >
                                                Reject
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">No pending registration requests found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={actionDialog} onClose={() => setActionDialog(false)}>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    {actionType === 'approve' ? 'Approve Participant' : 'Reject Participant'}
                </DialogTitle>
                <DialogContent sx={{ minWidth: { xs: 'auto', sm: 400 }, pt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '12px' }}>
                        You are {actionType}ing <strong>{selectedUser?.name}</strong>. This action will define their system access.
                    </Typography>

                    {actionType === 'approve' ? (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                select
                                fullWidth
                                label="System Role"
                                size="small"
                                margin="dense"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="employee">Employee</MenuItem>
                                <MenuItem value="hr">HR</MenuItem>
                                <MenuItem value="accountant">Accountant</MenuItem>
                            </TextField>
                            <TextField
                                select
                                fullWidth
                                label="Assigned Department"
                                size="small"
                                margin="dense"
                                required={formData.role === 'manager'}
                                error={formData.role === 'manager' && !formData.department}
                                helperText={formData.role === 'manager' && !formData.department ? 'Department is required for Managers' : ''}
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    ) : (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Reason for Rejection"
                            margin="normal"
                            size="small"
                            placeholder="State the reason for declining this request..."
                            value={formData.rejectionReason}
                            onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setActionDialog(false)} color="inherit" sx={{ fontSize: '12px' }}>Hold</Button>
                    <Button
                        onClick={handleUpdateStatus}
                        variant="contained"
                        disabled={actionType === 'approve' && formData.role === 'manager' && !formData.department}
                        sx={{ fontSize: '12px', bgcolor: actionType === 'approve' ? '#238636' : '#da3633' }}
                    >
                        {actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PendingApprovals;
