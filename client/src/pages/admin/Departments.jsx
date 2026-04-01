import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    Grid,
    LinearProgress,
    Button,
    IconButton,
    Stack,
    AvatarGroup,
    Avatar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CardActionArea,
    CircularProgress,
    Menu,
    MenuItem,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Slider,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreIcon,
    Group as GroupIcon,
    TrendingUp as TrendIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [managers, setManagers] = useState([]);
    const [editData, setEditData] = useState({
        name: '',
        managerId: '',
        color: '#58a6ff',
        efficiency: 0,
        description: ''
    });
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [createData, setCreateData] = useState({
        name: '',
        managerId: '',
        color: '#58a6ff',
        efficiency: 0,
        description: ''
    });

    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event, dept) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedDept(dept);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = () => {
        handleMenuClose();
        setEditData({
            name: selectedDept.name,
            managerId: selectedDept.managerId?.id || selectedDept.managerId?._id || '',
            color: selectedDept.color || '#58a6ff',
            efficiency: selectedDept.efficiency || 0,
            description: selectedDept.description || ''
        });
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
    };

    const handleOpenCreate = () => {
        setCreateData({
            name: '',
            managerId: '',
            color: '#58a6ff',
            efficiency: 0,
            description: ''
        });
        setCreateOpen(true);
    };

    const handleCloseCreate = () => {
        setCreateOpen(false);
    };

    const handleOpenDeleteConfirm = () => {
        handleMenuClose();
        setDeleteConfirmOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
    };

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users/departments');
            setDepartments(data);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const { data } = await API.get('/users');
            setManagers(data.filter(u => u.role === 'manager'));
        } catch (err) {
            console.error('Failed to fetch managers', err);
        }
    };

    const handleOpenDetails = (dept) => {
        setSelectedDept(dept);
        setOpen(true);
    };

    const handleCloseDetails = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchDepartments();
        fetchManagers();
    }, []);

    const handleUpdateDepartment = async () => {
        try {
            await API.put(`/users/departments/${selectedDept.id || selectedDept._id}`, editData);
            handleCloseEdit();
            fetchDepartments();
        } catch (err) {
            console.error('Failed to update department', err);
        }
    };

    const handleCreateDepartment = async () => {
        try {
            await API.post('/users/departments', createData);
            handleCloseCreate();
            fetchDepartments();
        } catch (err) {
            console.error('Failed to create department', err);
            alert(err.response?.data?.message || 'Failed to create department');
        }
    };

    const handleDeleteDepartment = async () => {
        try {
            await API.delete(`/users/departments/${selectedDept.id || selectedDept._id}`);
            handleCloseDeleteConfirm();
            fetchDepartments();
        } catch (err) {
            console.error('Failed to delete department', err);
            alert(err.response?.data?.message || 'Failed to delete department');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: '#58a6ff' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                        Departments & Teams
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Organizational structure and resource distribution overview
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    New Department
                </Button>
            </Box>

            {departments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.paper', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                    <Typography color="text.secondary">No departments found.</Typography>
                </Box>
            ) : (
                <Grid container spacing={4} columns={12}>
                    {departments.map((dept) => (
                        <Grid item xs={12} sm={6} md={4} key={dept.id || dept._id}>
                            <Card sx={{
                                height: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: '#161b22',
                                border: '1px solid #30363d',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    borderColor: '#58a6ff',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
                                }
                            }}>
                                <CardActionArea
                                    onClick={() => handleOpenDetails(dept)}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        '& .MuiCardActionArea-focusHighlight': {
                                            bgcolor: 'transparent'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: dept.color }} />
                                            <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                                {dept.name}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, dept)}
                                        >
                                            <MoreIcon sx={{ fontSize: '18px' }} />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '9px', letterSpacing: '0.5px' }}>
                                            Lead Manager
                                        </Typography>
                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{dept.lead}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '9px', fontWeight: 600 }}>
                                                Employees
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <GroupIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                                                <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{dept.count}</Typography>
                                            </Box>
                                        </Box>
                                        {/* <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '9px', fontWeight: 600 }}>
                                                Efficiency
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TrendIcon sx={{ fontSize: '14px', color: '#3fb950' }} />
                                                <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{dept.efficiency}%</Typography>
                                            </Box>
                                        </Box> */}
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>Department Growth</Typography>
                                            {/* <Typography sx={{ fontSize: '10px', color: dept.color, fontWeight: 700 }}>{dept.efficiency}%</Typography> */}
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dept.efficiency}
                                            sx={{
                                                height: 4,
                                                borderRadius: 2,
                                                bgcolor: '#1c2128',
                                                '& .MuiLinearProgress-bar': { bgcolor: dept.color }
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ mb: 2, borderColor: 'divider' }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 22, height: 22, fontSize: '9px', border: '2px solid #161b22' } }}>
                                            {dept.employees?.map((emp, i) => (
                                                <Avatar key={i} sx={{ bgcolor: dept.color, fontSize: '9px' }}>
                                                    {emp.name[0]}
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                    sx: {
                        bgcolor: '#161b22',
                        border: '1px solid #30363d',
                        color: 'white',
                        minWidth: '120px'
                    }
                }}
            >
                <MenuItem onClick={handleOpenEdit} sx={{ fontSize: '12px', gap: 1 }}>
                    <EditIcon sx={{ fontSize: '16px' }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleOpenDeleteConfirm} sx={{ fontSize: '12px', gap: 1, color: '#ff7b72' }}>
                    <DeleteIcon sx={{ fontSize: '16px' }} /> Delete
                </MenuItem>
            </Menu>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Edit {selectedDept?.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Lead Manager</InputLabel>
                            <Select
                                value={editData.managerId}
                                label="Lead Manager"
                                onChange={(e) => setEditData({ ...editData, managerId: e.target.value })}
                            >
                                <MenuItem value=""><em>None Assigned</em></MenuItem>
                                {managers.map((m) => (
                                    <MenuItem key={m._id} value={m._id}>{m.name} (@{m.username})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Performance / Efficiency ({editData.efficiency}%)
                            </Typography>
                            <Slider
                                value={editData.efficiency}
                                onChange={(e, val) => setEditData({ ...editData, efficiency: val })}
                                valueLabelDisplay="auto"
                                sx={{ color: editData.color }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Brand Color
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {['#58a6ff', '#7ee787', '#d2a8ff', '#ffa657', '#ff7b72'].map((c) => (
                                    <Box
                                        key={c}
                                        onClick={() => setEditData({ ...editData, color: c })}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '4px',
                                            bgcolor: c,
                                            cursor: 'pointer',
                                            border: editData.color === c ? '2px solid white' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Button onClick={handleCloseEdit} color="inherit">Cancel</Button>
                    <Button onClick={handleUpdateDepartment} variant="contained">Save Changes</Button>
                </Stack>
            </Dialog>

            {/* Create Dialog */}
            <Dialog open={createOpen} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Create New Department
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Department Name"
                            placeholder="e.g. Engineering"
                            value={createData.name}
                            onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={createData.description}
                            onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Lead Manager</InputLabel>
                            <Select
                                value={createData.managerId}
                                label="Lead Manager"
                                onChange={(e) => setCreateData({ ...createData, managerId: e.target.value })}
                            >
                                <MenuItem value=""><em>None Assigned</em></MenuItem>
                                {managers.map((m) => (
                                    <MenuItem key={m._id} value={m._id}>{m.name} (@{m.username})</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Performance / Efficiency ({createData.efficiency}%)
                            </Typography>
                            <Slider
                                value={createData.efficiency}
                                onChange={(e, val) => setCreateData({ ...createData, efficiency: val })}
                                valueLabelDisplay="auto"
                                sx={{ color: createData.color }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                Brand Color
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                {['#58a6ff', '#7ee787', '#d2a8ff', '#ffa657', '#ff7b72'].map((c) => (
                                    <Box
                                        key={c}
                                        onClick={() => setCreateData({ ...createData, color: c })}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '4px',
                                            bgcolor: c,
                                            cursor: 'pointer',
                                            border: createData.color === c ? '2px solid white' : '2px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Button onClick={handleCloseCreate} color="inherit">Cancel</Button>
                    <Button onClick={handleCreateDepartment} variant="contained">Create Department</Button>
                </Stack>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                    Delete {selectedDept?.name}?
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        Are you sure you want to delete this department? This action cannot be undone.
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ p: 1.5, bgcolor: 'rgba(255, 123, 114, 0.1)', color: '#ff7b72', border: '1px solid rgba(255, 123, 114, 0.2)', borderRadius: 2 }}>
                        <b>Note:</b> You can only delete departments that have 0 active employees.
                    </Typography>
                </DialogContent>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ p: 2 }}>
                    <Button onClick={handleCloseDeleteConfirm} color="inherit">Cancel</Button>
                    <Button onClick={handleDeleteDepartment} variant="contained" sx={{ bgcolor: '#ff7b72', '&:hover': { bgcolor: '#da3633' } }}>Delete</Button>
                </Stack>
            </Dialog>

            {/* Details Dialog (Restored) */}
            <Dialog open={open} onClose={handleCloseDetails} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: selectedDept?.color }} />
                    {selectedDept?.name} Members
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '10px', letterSpacing: 1 }}>
                            Department Lead
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px' }}>
                                {selectedDept?.lead?.[0]}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>{selectedDept?.lead}</Typography>
                                <Typography variant="caption" color="text.secondary">Manager</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, fontSize: '10px', letterSpacing: 1 }}>
                        Employees ({selectedDept?.count})
                    </Typography>
                    <List sx={{ mt: 1 }}>
                        {selectedDept?.employees?.map((emp, i) => (
                            <ListItem key={i} disablePadding sx={{ mb: 1.5 }}>
                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                    <Avatar sx={{ width: 28, height: 28, bgcolor: '#1c2128', color: selectedDept?.color, border: '1px solid', borderColor: 'divider' }}>
                                        <PersonIcon sx={{ fontSize: '16px' }} />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={emp.name}
                                    secondary={emp.role?.charAt(0).toUpperCase() + emp.role?.slice(1)}
                                    primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }}
                                    secondaryTypographyProps={{ fontSize: '11px' }}
                                />
                            </ListItem>
                        ))}
                        {(!selectedDept?.employees || selectedDept.employees.length === 0) && (
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                                No employees found in this department.
                            </Typography>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Departments;
