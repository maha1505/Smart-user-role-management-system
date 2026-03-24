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
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreIcon,
    Group as GroupIcon,
    TrendingUp as TrendIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpenDetails = (dept) => {
        setSelectedDept(dept);
        setOpen(true);
    };

    const handleCloseDetails = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await API.get('/users/departments');
                setDepartments(data);
            } catch (err) {
                console.error('Failed to fetch departments', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

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
                                        <IconButton size="small" onClick={(e) => e.stopPropagation()}><MoreIcon sx={{ fontSize: '18px' }} /></IconButton>
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
            <Dialog open={open} onClose={handleCloseDetails} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: selectedDept?.color }} />
                    {selectedDept?.name}
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
