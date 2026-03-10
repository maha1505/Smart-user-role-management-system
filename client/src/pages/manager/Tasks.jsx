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
    Chip,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Tooltip,
    Grid,
} from '@mui/material';
import {
    TaskAlt as TaskIcon,
    Add as AddIcon,
    Warning as WarningIcon,
    Edit as EditIcon,
    SwapHoriz as ReassignIcon,
} from '@mui/icons-material';
import API from '../../api/api';
import { useSelector } from 'react-redux';

const TasksPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        deadline: '',
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, teamRes] = await Promise.all([
                API.get('/tasks/team'),
                API.get('/users/manager-team')
            ]);
            setTasks(tasksRes.data);
            setTeam(teamRes.data);
        } catch (err) {
            console.error('Fetch tasks/team failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenDialog = (task = null) => {
        if (task) {
            setIsEdit(true);
            setSelectedTask(task);
            setForm({
                title: task.title,
                description: task.description,
                assignedTo: task.assignedTo?._id || task.assignedTo,
                priority: task.priority,
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
            });
        } else {
            setIsEdit(false);
            setForm({
                title: '',
                description: '',
                assignedTo: '',
                priority: 'medium',
                deadline: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await API.put(`/tasks/${selectedTask._id}`, form);
            } else {
                await API.post('/tasks', form);
            }
            fetchData();
            handleCloseDialog();
        } catch (err) {
            console.error('Task action failed', err);
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'high': return { bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)' };
            case 'medium': return { bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' };
            default: return { bgcolor: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff', border: '1px solid rgba(88, 166, 255, 0.2)' };
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return { color: '#3fb950' };
            case 'in_progress': return { color: '#58a6ff' };
            default: return { color: '#7d8590' };
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <TaskIcon sx={{ color: '#3fb950', fontSize: '24px' }} />
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                        Task Management
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        bgcolor: '#238636',
                        '&:hover': { bgcolor: '#2ea043' },
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '6px',
                        px: 2
                    }}
                >
                    Create Task
                </Button>
            </Box>

            <TableContainer component={Card} sx={{
                bgcolor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '12px'
            }}>
                <Table>
                    <TableHead sx={{ borderBottom: '1px solid #30363d' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Task</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Assigned To</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Priority</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Status</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2 }}>Deadline</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', py: 2, textAlign: 'right' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => {
                            const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
                            return (
                                <TableRow key={task._id} sx={{ borderBottom: '1px solid #30363d' }}>
                                    <TableCell sx={{ py: 2 }}>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>{task.title}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '11px', bgcolor: '#1f3958', color: '#58a6ff', fontWeight: 700 }}>
                                                {task.assignedTo?.name?.[0]}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '13px', color: '#8b949e' }}>
                                                {task.assignedTo?.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                            size="small"
                                            sx={{
                                                ...getPriorityStyle(task.priority),
                                                fontWeight: 800,
                                                fontSize: '10px',
                                                borderRadius: '12px',
                                                height: '20px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            ...getStatusStyle(task.status)
                                        }}>
                                            {task.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography sx={{ fontSize: '13px', color: isOverdue ? '#f85149' : '#8b949e', fontWeight: isOverdue ? 700 : 400 }}>
                                                {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </Typography>
                                            {isOverdue && <WarningIcon sx={{ fontSize: '14px', color: '#f85149' }} />}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Tooltip title="Edit Task">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(task)}
                                                    sx={{
                                                        border: '1px solid #30363d',
                                                        color: '#58a6ff',
                                                        borderRadius: '6px',
                                                        p: '4px'
                                                    }}
                                                >
                                                    <EditIcon sx={{ fontSize: '18px' }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Reassign">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(task)}
                                                    sx={{
                                                        border: '1px solid #30363d',
                                                        color: '#f85149',
                                                        borderRadius: '6px',
                                                        p: '4px'
                                                    }}
                                                >
                                                    <ReassignIcon sx={{ fontSize: '18px' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#0d1117', border: '1px solid #30363d', borderRadius: '12px' } }}>
                <DialogTitle sx={{ color: '#e6edf3', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    {isEdit ? 'Update Task' : 'Create New Task'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Task Title"
                        margin="normal"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        InputProps={{ sx: { color: '#e6edf3' } }}
                    />
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={3}
                        label="Description"
                        margin="normal"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        InputProps={{ sx: { color: '#e6edf3' } }}
                    />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Assigned To"
                                value={form.assignedTo}
                                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                                InputProps={{ sx: { color: '#e6edf3' } }}
                            >
                                {team.map((member) => (
                                    <MenuItem key={member._id} value={member._id}>{member.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Priority"
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                InputProps={{ sx: { color: '#e6edf3' } }}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Deadline"
                                InputLabelProps={{ shrink: true }}
                                value={form.deadline}
                                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                                InputProps={{ sx: { color: '#e6edf3' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ color: '#8b949e', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: '#238636',
                            '&:hover': { bgcolor: '#2ea043' },
                            textTransform: 'none',
                            px: 3
                        }}
                    >
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TasksPage;
