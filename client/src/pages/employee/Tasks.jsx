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
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    TaskAlt as TaskIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const TaskList = () => {
    const { user } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/tasks/my');
            setTasks(data);
        } catch (err) {
            console.error('Fetch tasks failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await API.put(`/tasks/${taskId}/status`, { status: newStatus });
            // Update local state immediately for better UX
            setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
        } catch (err) {
            console.error('Update task status failed', err);
        }
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return { bgcolor: 'rgba(63, 185, 80, 0.1)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)' };
            case 'in-progress': return { bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', border: '1px solid rgba(88, 166, 255, 0.2)' };
            case 'not-started': return { bgcolor: 'rgba(110, 118, 129, 0.1)', color: '#7d8590', border: '1px solid rgba(110, 118, 129, 0.2)' };
            case 'pending': return { bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' };
            default: return { bgcolor: 'rgba(110, 118, 129, 0.1)', color: '#7d8590' };
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return { bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)' };
            case 'medium': return { bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' };
            case 'med': return { bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' };
            case 'low': return { bgcolor: 'rgba(63, 185, 80, 0.1)', color: '#3fb950', border: '1px solid rgba(63, 185, 80, 0.2)' };
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
                <CheckIcon sx={{ color: '#3fb950', fontSize: '24px' }} />
                <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                    My Tasks
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
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Task</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Description</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Priority</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Status</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Deadline</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2, textAlign: 'right' }}>Update</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid #30363d' }}>
                                <TableCell sx={{ py: 2.5 }}>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                        {task.title}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '14px' }}>
                                    {task.description}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        size="small"
                                        sx={{
                                            ...getPriorityStyles(task.priority),
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={task.status === 'in_progress' ? 'In Progress' : task.status === 'not_started' ? 'Not Started' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        size="small"
                                        sx={{
                                            ...getStatusStyles(task.status === 'not_started' ? 'not-started' : task.status === 'in_progress' ? 'in-progress' : task.status),
                                            fontWeight: 700,
                                            fontSize: '11px',
                                            borderRadius: '12px',
                                            px: 1
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '14px' }}>
                                    {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right' }}>
                                    <Select
                                        value={task.status}
                                        size="small"
                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                        sx={{
                                            height: '32px',
                                            fontSize: '13px',
                                            color: '#e6edf3',
                                            bgcolor: '#0d1117',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#30363d' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#58a6ff' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#58a6ff' },
                                            minWidth: '130px',
                                            textAlign: 'left'
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: {
                                                    bgcolor: '#161b22',
                                                    border: '1px solid #30363d',
                                                    '& .MuiMenuItem-root': { fontSize: '13px', color: '#e6edf3' },
                                                    '& .MuiMenuItem-root:hover': { bgcolor: '#1f2937' },
                                                    '& .Mui-selected': { bgcolor: 'rgba(88, 166, 255, 0.1) !important' }
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem value="not_started">Not Started</MenuItem>
                                        <MenuItem value="in_progress">In Progress</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {tasks.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#161b22', border: '1px solid #30363d', borderRadius: '0 0 12px 12px', borderTop: 'none' }}>
                    <Typography color="text.secondary" fontSize="14px">No tasks matching your current assignments.</Typography>
                </Box>
            )}
        </Box>
    );
};

export default TaskList;
