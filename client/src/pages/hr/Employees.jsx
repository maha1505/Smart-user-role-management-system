import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
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
} from '@mui/material';
import {
    People as PeopleIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const EmployeeRecords = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleOpen = (emp) => {
        setSelectedEmployee(emp);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
    };
    const { user: currentUser } = useSelector((state) => state.auth);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/users');
                // HR sees their department employees
                setEmployees(data);
            } catch (err) {
                console.error('Fetch employees failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const getRoleStyles = (role) => {
        switch (role.toLowerCase()) {
            case 'manager': return { bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' };
            case 'employee': return { bgcolor: 'rgba(56, 139, 253, 0.1)', color: '#58a6ff', border: '1px solid rgba(56, 139, 253, 0.2)' };
            case 'hr': return { bgcolor: 'rgba(188, 142, 255, 0.1)', color: '#bc8eff', border: '1px solid rgba(188, 142, 255, 0.2)' };
            default: return { bgcolor: 'rgba(110, 118, 129, 0.1)', color: '#7d8590' };
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
                <PeopleIcon sx={{ color: '#bc8eff', fontSize: '24px' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                    Employee Records
                </Typography>
            </Box>

            <TableContainer component={Card} sx={{
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px',
                boxShadow: 'none'
            }}>
                <Table sx={{ minWidth: { xs: 800, sm: '100%' } }}>
                    <TableHead sx={{ borderBottom: '1px solid #30363d' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joining</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid #30363d' }}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar sx={{
                                            width: 30,
                                            height: 30,
                                            bgcolor: 'rgba(88, 166, 255, 0.1)',
                                            color: '#58a6ff',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            fontFamily: 'Syne, sans-serif'
                                        }}>
                                            {emp.name[0]}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                            {emp.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '13px' }}>{emp.email}</TableCell>
                                <TableCell sx={{ color: '#e6edf3', fontSize: '13px', fontWeight: 500 }}>{emp.department}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                                        size="small"
                                        sx={{
                                            ...getRoleStyles(emp.role),
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '13px' }}>
                                    {emp.managerId?.name || '—'}
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '13px' }}>
                                    {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={emp.isActive ? 'Active' : 'Inactive'}
                                        size="small"
                                        sx={{
                                            bgcolor: emp.isActive ? 'rgba(63, 185, 80, 0.1)' : 'rgba(110, 118, 129, 0.1)',
                                            color: emp.isActive ? '#3fb950' : '#7d8590',
                                            border: `1px solid ${emp.isActive ? 'rgba(63, 185, 80, 0.2)' : 'rgba(110, 118, 129, 0.2)'}`,
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => handleOpen(emp)}
                                        sx={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            height: '28px',
                                            borderColor: '#30363d',
                                            color: '#58a6ff',
                                            '&:hover': { bgcolor: 'rgba(88, 166, 255, 0.1)', borderColor: '#58a6ff' },
                                            px: 2,
                                            borderRadius: '6px'
                                        }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {employees.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '0 0 12px 12px' }}>
                    <Typography color="#7d8590" fontSize="14px">No employee records found for your department.</Typography>
                </Box>
            )}

            {/* Employee Detail Dialog */}
            <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Employee Details
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500]
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedEmployee && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="subtitle1"><strong>Name:</strong> {selectedEmployee.name}</Typography>
                            <Typography variant="subtitle1"><strong>Email:</strong> {selectedEmployee.email}</Typography>
                            <Typography variant="subtitle1"><strong>Department:</strong> {selectedEmployee.department}</Typography>
                            <Typography variant="subtitle1"><strong>Role:</strong> {selectedEmployee.role}</Typography>
                            <Typography variant="subtitle1"><strong>Manager:</strong> {selectedEmployee.managerId?.name || '—'}</Typography>
                            <Typography variant="subtitle1"><strong>Joining:</strong> {selectedEmployee.joiningDate ? new Date(selectedEmployee.joiningDate).toLocaleDateString() : 'N/A'}</Typography>
                            <Typography variant="subtitle1"><strong>Status:</strong> {selectedEmployee.isActive ? 'Active' : 'Inactive'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EmployeeRecords;
