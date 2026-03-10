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
    LinearProgress,
} from '@mui/material';
import {
    TaskAlt as TaskIcon,
    FilterList as FilterIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data } = await API.get('/tasks');
                setTasks(data);
            } catch (err) {
                console.error('Failed to fetch tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return '#3fb950';
            case 'in-progress': return '#58a6ff';
            case 'pending': return '#d29922';
            default: return 'text.secondary';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return '#f85149';
            case 'medium': return '#d29922';
            case 'low': return '#3fb950';
            default: return 'text.secondary';
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                        All Tasks
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Global oversight of all organizational objectives and progress
                    </Typography>
                </Box>
            </Box>

            <Card>
                <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Active Tasks Registry ({tasks.length})
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
                                <TableCell>Task Title</TableCell>
                                <TableCell>Assigned To</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Manager</TableCell>
                                {/* <TableCell>Progress</TableCell> */}
                                <TableCell>Priority</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 ? tasks.map((task) => (
                                <TableRow key={task._id}>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>{task.title}</Typography>
                                        <Typography sx={{ fontSize: '10px', color: 'text.secondary', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {task.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '9px', fontWeight: 700 }}>
                                                {task.assignedTo?.name?.[0] || 'U'}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '11px' }}>{task.assignedTo?.name || 'Unassigned'}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '11px' }}>{task.department || 'N/A'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#238636', color: '#fff', fontSize: '9px', fontWeight: 700 }}>
                                                {task.assignedBy?.name?.[0] || 'A'}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '11px' }}>{task.assignedBy?.name || 'Admin'}</Typography>
                                        </Box>
                                    </TableCell>
                                    {/* <TableCell sx={{ minWidth: '100px' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={task.status === 'completed' ? 100 : (task.status === 'in-progress' || task.status === 'in_progress') ? 50 : 0}
                                                sx={{ flexGrow: 1, height: 4, borderRadius: 2, bgcolor: '#1c2128', '& .MuiLinearProgress-bar': { bgcolor: getStatusColor(task.status) } }}
                                            />
                                            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                                                {task.status === 'completed' ? '100%' : task.status === 'in-progress' }
                                            </Typography>
                                        </Box>
                                    </TableCell> */}
                                    <TableCell>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            sx={{
                                                fontSize: '9px',
                                                height: '18px',
                                                bgcolor: 'transparent',
                                                color: getPriorityColor(task.priority),
                                                border: '1px solid',
                                                borderColor: getPriorityColor(task.priority),
                                                fontWeight: 800,
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.status}
                                            size="small"
                                            sx={{
                                                fontSize: '9px',
                                                height: '18px',
                                                bgcolor: 'rgba(56, 139, 253, 0.1)',
                                                color: getStatusColor(task.status),
                                                fontWeight: 800,
                                                borderRadius: '10px'
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">No tasks found in the system.</Typography>
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

export default AllTasks;
