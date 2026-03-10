import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
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
    Grid,
    Divider,
    Stack,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Visibility as ViewIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('All');
    const [loading, setLoading] = useState(true);
    const [viewDialog, setViewDialog] = useState(false);
    const [actionDialog, setActionDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState('');
    const [roleStats, setRoleStats] = useState({
        all: 0, admin: 0, manager: 0, employee: 0, hr: 0, accountant: 0
    });
    const [formData, setFormData] = useState({
        role: 'employee',
        department: '',
        rejectionReason: ''
    });

    const roles = [
        { label: 'All', key: 'all' },
        { label: 'Admin', key: 'admin' },
        { label: 'Manager', key: 'manager' },
        { label: 'Employee', key: 'employee' },
        { label: 'HR', key: 'hr' },
        { label: 'Accountant', key: 'accountant' }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, statsRes] = await Promise.all([
                API.get('/users'),
                API.get('/users/stats')
            ]);
            setUsers(usersRes.data);
            setFilteredUsers(usersRes.data);
            setRoleStats(statsRes.data.stats.roleCounts);
        } catch (err) {
            console.error('Failed to fetch user data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRole === 'All') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(u => u.role.toLowerCase() === selectedRole.toLowerCase()));
        }
    }, [selectedRole, users]);

    const handleOpenView = (user) => {
        setSelectedUser(user);
        setViewDialog(true);
    };

    const handleOpenAction = (user, type) => {
        setSelectedUser(user);
        setActionType(type);
        setFormData({
            role: user.role || 'employee',
            department: user.department || '',
            rejectionReason: ''
        });
        setActionDialog(true);
    };

    const handleUpdateStatus = async () => {
        try {
            const payload = {
                registrationStatus: actionType === 'approve' ? 'approved' : 
                                   actionType === 'reject' ? 'rejected' : selectedUser.registrationStatus,
                role: formData.role,
                department: formData.department,
                rejectionReason: formData.rejectionReason
            };
            await API.put(`/users/${selectedUser._id}/status`, payload);
            setActionDialog(false);
            fetchData();
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const handleDeleteUser = async (user) => {
        if (window.confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
            try {
                await API.delete(`/users/${user._id}`);
                fetchData();
            } catch (err) {
                console.error('Delete failed', err);
                alert('Failed to delete user.');
            }
        }
    };

    const getRoleChipStyles = (role) => {
        const roleColors = {
            admin: { bg: 'rgba(163, 113, 247, 0.1)', color: '#a371f7' },
            manager: { bg: 'rgba(210, 153, 34, 0.1)', color: '#d29922' },
            employee: { bg: 'rgba(56, 139, 253, 0.1)', color: '#58a6ff' },
            hr: { bg: 'rgba(248, 81, 73, 0.1)', color: '#f85149' },
            accountant: { bg: 'rgba(163, 113, 247, 0.1)', color: '#8957e5' },
        };
        const style = roleColors[role.toLowerCase()] || roleColors.employee;
        return {
            bgcolor: style.bg,
            color: style.color,
            fontSize: '9px',
            height: '18px',
            fontWeight: 700,
            borderRadius: '10px',
            border: `1px solid ${style.bg}`
        };
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Manage Users
                </Typography>
            </Box>

            <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '8px' }}>
                <Box sx={{ p: '14px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1.5}>
                        {roles.map((r) => (
                            <Chip
                                key={r.key}
                                label={`${r.label} (${roleStats[r.key] || 0})`}
                                onClick={() => setSelectedRole(r.label)}
                                sx={{
                                    borderRadius: '6px',
                                    height: '28px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    bgcolor: selectedRole === r.label ? 'rgba(88, 166, 253, 0.1)' : '#161b22',
                                    color: selectedRole === r.label ? '#58a6ff' : 'text.secondary',
                                    border: '1px solid',
                                    borderColor: selectedRole === r.label ? '#58a6ff' : '#30363d',
                                    '&:hover': { bgcolor: 'rgba(88, 166, 253, 0.05)' }
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                <TableContainer>
                    <Table size="small" sx={{
                        '& .MuiTableCell-root': { py: 2, fontSize: '11px', borderBottom: '1px solid #30363d' },
                        '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '9px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d', py: 1.5 }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ pl: 3 }}>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Manager</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ pr: 3 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user._id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255, 0.02)' } }}>
                                    <TableCell sx={{ pl: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '10px', fontWeight: 800 }}>
                                                {user.name[0]}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{user.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{user.username}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{user.department?.name || user.department || '—'}</TableCell>
                                    <TableCell>
                                        <Chip label={user.role} size="small" sx={getRoleChipStyles(user.role)} />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {user.managerId ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {user.managerId.name}
                                            </Box>
                                        ) : '—'}
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: user.registrationStatus === 'approved' ? '#3fb950' : user.registrationStatus === 'pending' ? '#d29922' : '#f85149'
                                        }}>
                                            {user.registrationStatus?.charAt(0).toUpperCase() + user.registrationStatus?.slice(1)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ pr: 3 }}>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleOpenAction(user, 'edit')}
                                                sx={{
                                                    fontSize: '9px',
                                                    height: '22px',
                                                    textTransform: 'none',
                                                    borderColor: '#58a6ff',
                                                    color: '#58a6ff',
                                                    minWidth: '45px',
                                                    px: 1,
                                                    '&:hover': { borderColor: '#1f6feb', bgcolor: 'rgba(88, 166, 253, 0.05)' }
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleDeleteUser(user)}
                                                sx={{
                                                    fontSize: '9px',
                                                    height: '22px',
                                                    textTransform: 'none',
                                                    borderColor: '#f85149',
                                                    color: '#f85149',
                                                    minWidth: '70px',
                                                    px: 1,
                                                    '&:hover': { borderColor: '#da3633', bgcolor: 'rgba(248, 81, 73, 0.05)' }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* Existing Dialogs kept for functionality but could be updated if needed */}
            <Dialog open={actionDialog} onClose={() => setActionDialog(false)}>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    {actionType === 'approve' ? 'Approve Registration' : 'Edit User'}
                </DialogTitle>
                <DialogContent sx={{ minWidth: 400, pt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '11px' }}>
                        Processing: <strong>{selectedUser?.name}</strong>
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            select
                            fullWidth
                            label="Role"
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
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setActionDialog(false)} color="inherit" sx={{ fontSize: '11px' }}>Cancel</Button>
                    <Button
                        onClick={handleUpdateStatus}
                        variant="contained"
                        sx={{ fontSize: '11px', bgcolor: '#238636' }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
