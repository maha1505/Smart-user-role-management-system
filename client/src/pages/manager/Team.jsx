import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
    CircularProgress,
} from '@mui/material';
import {
    People as PeopleIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const TeamPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/users/manager-team');
            setTeam(data);
        } catch (err) {
            console.error('Fetch manager team failed', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PeopleIcon sx={{ color: '#a371f7', fontSize: '24px' }} />
                <Typography sx={{
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: 'Syne, sans-serif',
                }}>
                    My Team — {user?.department || 'Department'}
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
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Name</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Role</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Active Tasks</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Completed</TableCell>
                            <TableCell sx={{ color: '#7d8590', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', py: 2 }}>Leave Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {team.map((member) => (
                            <TableRow key={member._id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: '1px solid #30363d' }}>
                                <TableCell sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: 'rgba(88, 166, 255, 0.1)',
                                            color: '#58a6ff',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            border: '1px solid rgba(88, 166, 255, 0.2)'
                                        }}>
                                            {member.name[0]}
                                        </Avatar>
                                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#e6edf3' }}>
                                            {member.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#7d8590', fontSize: '14px' }}>
                                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(88, 166, 255, 0.1)',
                                        color: '#58a6ff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    }}>
                                        {member.activeTasks}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ color: '#3fb950', fontSize: '14px', fontWeight: 700 }}>
                                    {member.completedTasks}
                                </TableCell>
                                <TableCell>
                                    {member.leaveStatus === 'Leave Pending' ? (
                                        <Chip
                                            label="Leave Pending"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(210, 153, 34, 0.1)',
                                                color: '#d29922',
                                                fontWeight: 700,
                                                fontSize: '11px',
                                                border: '1px solid rgba(210, 153, 34, 0.2)',
                                                borderRadius: '12px'
                                            }}
                                        />
                                    ) : member.leaveStatus === 'Leave Rejected' ? (
                                        <Chip
                                            label="Leave Rejected"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(248, 81, 73, 0.1)',
                                                color: '#f85149',
                                                fontWeight: 700,
                                                fontSize: '11px',
                                                border: '1px solid rgba(248, 81, 73, 0.2)',
                                                borderRadius: '12px'
                                            }}
                                        />
                                    ) : (
                                        <Typography sx={{ color: '#7d8590', fontSize: '13px' }}>None</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TeamPage;
