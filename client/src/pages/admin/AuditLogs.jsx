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
    Stack,
    Tooltip,
} from '@mui/material';
import {
    History as LogIcon,
    FilterList as FilterIcon,
    InfoOutlined as InfoIcon,
    Terminal as TerminalIcon,
} from '@mui/icons-material';
import API from '../../api/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await API.get('/logs');
                setLogs(data);
            } catch (err) {
                console.error('Failed to fetch logs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        const a = action.toLowerCase();
        if (a.includes('create') || a.includes('add') || a.includes('approve')) return '#3fb950';
        if (a.includes('delete') || a.includes('reject') || a.includes('remove')) return '#f85149';
        if (a.includes('update') || a.includes('edit')) return '#58a6ff';
        return '#d29922';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>
                        System Audit Logs
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Comprehensive immutable record of all security and administrative events
                    </Typography>
                </Box>
                {/* <IconButton sx={{ border: '1px solid #30363d', borderRadius: '8px' }}>
                    <FilterIcon sx={{ fontSize: '20px' }} />
                </IconButton> */}
            </Box>

            <Card>
                <Box sx={{ p: '12px 16px', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TerminalIcon sx={{ fontSize: '14px', color: 'text.secondary' }} />
                    <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Operation Ledger ({logs.length} events detected)
                    </Typography>
                </Box>
                <TableContainer>
                    <Table size="small" sx={{
                        '& .MuiTableCell-root': { py: 1.5, fontSize: '12px', borderBottom: '1px solid #30363d' },
                        '& .MuiTableHead-root .MuiTableCell-root': { fontSize: '10px', textTransform: 'uppercase', color: 'text.secondary', fontWeight: 600, borderBottom: '1px solid #30363d' }
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Actor</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Resource</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Source IP</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.length > 0 ? logs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                        {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#1f3958', color: '#58a6ff', fontSize: '9px', fontWeight: 700 }}>
                                                {log.userId?.name?.[0] || 'S'}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>{log.userId?.name || 'System'}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.action}
                                            size="small"
                                            sx={{
                                                fontSize: '8px', height: '16px', fontWeight: 800, textTransform: 'uppercase',
                                                bgcolor: 'transparent', border: '1px solid', borderColor: getActionColor(log.action), color: getActionColor(log.action),
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{log.resource}</TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '11px', color: 'text.secondary', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {log.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '10px' }}>
                                        {log.Ip || '::1'}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography color="text.secondary">No activity logs recorded yet.</Typography>
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

export default AuditLogs;
