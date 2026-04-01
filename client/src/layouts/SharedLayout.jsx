import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    InputBase,
    Badge,
    Paper,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    TaskAlt as TaskIcon,
    Event as LeaveIcon,
    Payments as PayrollIcon,
    ManageSearch as AuditIcon,
    HourglassTop as PendingIcon,
    CorporateFare as DeptIcon,
    Search as SearchIcon,
    NotificationsNone as NotificationIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    Assessment as ReportsIcon,
    AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { logout } from '../store/store';
import API from '../api/api';

const drawerWidth = 210;

const SharedLayout = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sidebarAnchorEl, setSidebarAnchorEl] = useState(null);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            if (user?.role === 'admin') {
                try {
                    const { data } = await API.get('/users/stats');
                    setPendingCount(data.stats.pendingApprovalsCount);
                } catch (err) {
                    console.error('Failed to fetch stats for badge', err);
                }
            } else if (user?.role === 'hr') {
                try {
                    const { data } = await API.get('/users/hr-stats');
                    setPendingCount(data.stats.pendingLeavesCount || 0);
                } catch (err) {
                    console.error('Failed to fetch HR stats for badge', err);
                }
            }
        };
        fetchStats();
    }, [user, location.pathname]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSidebarAnchorEl(null);
    };

    const handleSidebarMenuOpen = (event) => {
        setSidebarAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const adminNav = [
        {
            label: 'Main', items: [
                { text: 'Dashboard', icon: <HomeIcon fontSize="small" />, path: '/admin' },
                { text: 'Pending Approvals', icon: <PendingIcon fontSize="small" />, path: '/admin/pending', badge: pendingCount },
                { text: 'Manage Users', icon: <PeopleIcon fontSize="small" />, path: '/admin/users' },
                { text: 'Departments', icon: <DeptIcon fontSize="small" />, path: '/admin/departments' },
            ]
        },
        {
            label: 'Modules', items: [
                { text: 'All Tasks', icon: <TaskIcon fontSize="small" />, path: '/admin/tasks' },
                { text: 'Leave Requests', icon: <LeaveIcon fontSize="small" />, path: '/admin/leaves' },
                { text: 'Payroll', icon: <PayrollIcon fontSize="small" />, path: '/admin/payroll' },
                { text: 'Audit Logs', icon: <AuditIcon fontSize="small" />, path: '/admin/logs' },
            ]
        }
    ];

    const managerNav = [
        {
            label: 'Management', items: [
                { text: 'Dashboard', icon: <HomeIcon fontSize="small" />, path: '/manager' },
                { text: 'My Team', icon: <PeopleIcon fontSize="small" />, path: '/manager/team' },
                { text: 'Tasks', icon: <TaskIcon fontSize="small" />, path: '/manager/tasks' },
                { text: 'Leave Approvals', icon: <LeaveIcon fontSize="small" />, path: '/manager/leaves' },
                { text: 'Reports', icon: <ReportsIcon fontSize="small" />, path: '/manager/reports' },
            ]
        },
        {
            label: 'Personal Portal', items: [
                { text: 'My Leaves', icon: <AuditIcon fontSize="small" />, path: '/manager/my-leaves' },
                { text: 'My Payslip', icon: <PayrollIcon fontSize="small" />, path: '/manager/my-payroll' },
            ]
        }
    ];

    const employeeNav = [
        {
            label: 'Main', items: [
                { text: 'Dashboard', icon: <HomeIcon fontSize="small" />, path: '/employee' },
                { text: 'My Tasks', icon: <TaskIcon fontSize="small" />, path: '/employee/tasks' },
                // { text: 'Apply Leave', icon: <LeaveIcon fontSize="small" />, path: '/employee/leave' },
                { text: 'Leave History', icon: <AuditIcon fontSize="small" />, path: '/employee/leaves' },
                { text: 'My Payslip', icon: <PayrollIcon fontSize="small" />, path: '/employee/payroll' },
                // { text: 'My Profile', icon: <ProfileIcon fontSize="small" />, path: '/employee/profile' },
            ]
        }
    ];

    const hrNav = [
        {
            label: 'Management', items: [
                { text: 'Dashboard', icon: <HomeIcon fontSize="small" />, path: '/hr' },
                { text: 'Employee Records', icon: <PeopleIcon fontSize="small" />, path: '/hr/employees' },
                { text: 'Leave Approvals', icon: <LeaveIcon fontSize="small" />, path: '/hr/leaves', badge: pendingCount },
                // { text: 'Attendance Reports', icon: <ReportsIcon fontSize="small" />, path: '/hr/attendance' },
            ]
        },
        {
            label: 'Personal Portal', items: [
                { text: 'My Leaves', icon: <AuditIcon fontSize="small" />, path: '/hr/my-leaves' },
                { text: 'My Payslip', icon: <PayrollIcon fontSize="small" />, path: '/hr/my-payroll' },
            ]
        }
    ];

    const accountantNav = [
        {
            label: 'Management', items: [
                { text: 'Dashboard', icon: <HomeIcon fontSize="small" sx={{ color: '#d29922' }} />, path: '/accountant' },
                { text: 'Payroll', icon: <PayrollIcon fontSize="small" sx={{ color: '#f85149' }} />, path: '/accountant/payroll' },
                { text: 'Generate Payslip', icon: <TaskIcon fontSize="small" sx={{ color: '#8957e5' }} />, path: '/accountant/generate' },
                { text: 'Reports', icon: <ReportsIcon fontSize="small" sx={{ color: '#3fb950' }} />, path: '/accountant/reports' },
            ]
        },
        {
            label: 'Personal Portal', items: [
                { text: 'My Leaves', icon: <AuditIcon fontSize="small" />, path: '/accountant/my-leaves' },
                { text: 'My Payslip', icon: <PayrollIcon fontSize="small" />, path: '/accountant/my-payroll' },
            ]
        }
    ];

    const getNavConfig = () => {
        switch (user?.role) {
            case 'admin': return adminNav;
            case 'manager': return managerNav;
            case 'employee': return employeeNav;
            case 'hr': return hrNav;
            case 'accountant': return accountantNav;
            default: return [];
        }
    };

    const activeNav = getNavConfig();

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: '16px', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px' }}>
                    Role<span style={{ color: '#58a6ff' }}>Core</span>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 1, textTransform: 'uppercase', fontSize: '9px' }}>
                    Intelligent Workforce Control
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
                {activeNav.map((section) => (
                    <Box key={section.label} sx={{ mb: section.label ? 2 : 0 }}>
                        {section.label && (
                            <Typography variant="caption" sx={{ px: '18px', display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                                {section.label}
                            </Typography>
                        )}
                        <List sx={{ px: '10px' }}>
                            {section.items.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ mb: '2px' }}>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate(item.path);
                                            setMobileOpen(false);
                                        }}
                                        selected={location.pathname === item.path}
                                        sx={{
                                            borderRadius: '8px',
                                            py: '8px',
                                            px: '12px',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            '&.Mui-selected': {
                                                backgroundColor: 'rgba(56, 139, 253, 0.1)',
                                                color: '#f0f6fc',
                                                '&:hover': { backgroundColor: 'rgba(56, 139, 253, 0.15)' },
                                                '& .MuiListItemIcon-root': { color: '#58a6ff' },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: -10,
                                                    top: '20%',
                                                    height: '60%',
                                                    width: '4px',
                                                    backgroundColor: '#58a6ff',
                                                    borderRadius: '0 4px 4px 0'
                                                }
                                            },
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: '28px', color: 'text.secondary' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{ fontSize: '12px', fontWeight: 500, color: 'inherit' }}
                                        />
                                        {item.badge > 0 && (
                                            <Box sx={{
                                                ml: 'auto',
                                                bgcolor: '#f85149',
                                                color: '#fff',
                                                fontSize: '9px',
                                                fontWeight: 800,
                                                minWidth: '16px',
                                                height: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '50%',
                                                lineHeight: 1
                                            }}>
                                                {item.badge}
                                            </Box>
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>

            <Box
                onClick={handleSidebarMenuOpen}
                sx={{
                    p: '12px 16px',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255, 0.05)' }
                }}
            >
                <Avatar
                    sx={{
                        width: 30,
                        height: 30,
                        bgcolor: `${theme => theme.palette.roles?.[user?.role] || '#1f3958'}22`,
                        color: theme => theme.palette.roles?.[user?.role] || '#58a6ff',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: theme => `${theme.palette.roles?.[user?.role] || '#58a6ff'}44`
                    }}
                >
                    {user?.name?.[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{user?.name}</Typography>
                    <Typography sx={{ fontSize: '9px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</Typography>
                </Box>
                <LogoutIcon sx={{ fontSize: '14px', color: 'text.secondary', opacity: 0.6 }} />
            </Box>

            <Menu
                anchorEl={sidebarAnchorEl}
                open={Boolean(sidebarAnchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                PaperProps={{
                    sx: {
                        bgcolor: '#161b22',
                        border: '1px solid #30363d',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        mt: -1,
                        '& .MuiMenuItem-root': {
                            fontSize: '12px',
                            fontWeight: 600,
                            py: 1,
                            px: 2,
                            borderRadius: '4px',
                            mx: 0.5,
                            '&:hover': { bgcolor: '#1c2128' }
                        }
                    }
                }}
            >
                <MenuItem onClick={handleLogout} sx={{ color: '#f85149' }}>
                    <LogoutIcon sx={{ fontSize: '16px', mr: 1.5 }} /> Sign Out
                </MenuItem>
            </Menu>
        </Box>
    );

    const getPageTitle = () => {
        const role = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);
        const path = location.pathname.split('/').pop();
        const page = path === '' || path === user?.role ? 'Dashboard' :
            path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');

        return `${role} — ${page === 'Leaves' ? 'Leave Approvals' : page}`;
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', maxWidth: '100vw', overflowX: 'hidden' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h6" sx={{ fontSize: '17px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                {getPageTitle()}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
                                {user?.name} - {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Header utilities removed as requested */}
                    </Box>
                </Toolbar>
            </AppBar>


            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 8, minWidth: 0, width: '100%' }}>
                {children}
            </Box>
        </Box>
    );
};

export default SharedLayout;
