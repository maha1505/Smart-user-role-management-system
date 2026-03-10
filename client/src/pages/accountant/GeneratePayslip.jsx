import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, TextField, MenuItem, Button, Grid, Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import API from '../../api/api';

const GeneratePayslip = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [month, setMonth] = useState('March 2026'); // Default to match image
    const [basicSalary, setBasicSalary] = useState('');
    const [hra, setHra] = useState('');
    const [pfDeduction, setPfDeduction] = useState('');
    const [tax, setTax] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Fetch all employees for accounting
                const { data } = await API.get('/users');
                setEmployees(data.filter(u => u.role === 'employee' || u.role === 'manager' || u.role === 'hr'));
            } catch (err) {
                console.error('Failed to fetch employees', err);
            }
        };
        fetchEmployees();
    }, []);

    const grossTotal = Number(basicSalary) + Number(hra);
    const totalDeductions = Number(pfDeduction) + Number(tax);
    const netSalary = Math.max(0, grossTotal - totalDeductions);

    const handleGenerate = async () => {
        try {
            setErrorMsg('');
            await API.post('/payroll', {
                employeeId: selectedEmployee,
                month,
                basicSalary: grossTotal, // Based on schema expecting basicSalary (acting as gross or base depending on interpretation. Storing gross to match Net calculation usually)
                deductions: totalDeductions,
                // In a real app we'd expand the schema to store HRA/PF/Tax independently. 
                // For UI parity, we bundle them into the existing schema structure.
            });
            setSuccessMsg('Payslip generated and saved successfully!');
            setTimeout(() => {
                setSuccessMsg('');
                setSelectedEmployee('');
                setBasicSalary('');
                setHra('');
                setPfDeduction('');
                setTax('');
            }, 3000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to generate payslip');
        }
    };

    const commonTextFieldStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            color: '#e6edf3',
            '& fieldset': { borderColor: '#30363d' },
            '&:hover fieldset': { borderColor: '#8b949e' },
            '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
        },
        '& .MuiInputLabel-root': { color: '#7d8590' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#58a6ff' },
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AddIcon sx={{ color: '#8957e5', mr: 1, fontSize: '28px' }} />
                <Typography variant="h5" sx={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#e6edf3' }}>
                    Generate Payslip
                </Typography>
            </Box>

            <Grid container spacing={0}>
                <Grid item xs={12} md={7}>
                    <Card sx={{
                        p: 4,
                        bgcolor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '12px',
                        boxShadow: 'none'
                    }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 3, color: '#e6edf3' }}>
                            New Payslip
                        </Typography>

                        {successMsg && <Alert severity="success" sx={{ mb: 3, bgcolor: '#23863622', color: '#3fb950', border: '1px solid #238636' }}>{successMsg}</Alert>}
                        {errorMsg && <Alert severity="error" sx={{ mb: 3, bgcolor: '#da363322', color: '#ff7b72', border: '1px solid #da3633' }}>{errorMsg}</Alert>}

                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                SELECT EMPLOYEE
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                sx={{
                                    ...commonTextFieldStyles,
                                    '& .MuiSelect-icon': { color: '#7d8590' }
                                }}
                            >
                                {employees.map(e => (
                                    <MenuItem key={e._id} value={e._id}>
                                        {e.name} — {e.department || 'No Dept'}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                MONTH
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                sx={{
                                    ...commonTextFieldStyles,
                                    '& .MuiSelect-icon': { color: '#7d8590' }
                                }}
                            >
                                <MenuItem value="March 2026">March 2026</MenuItem>
                                <MenuItem value="February 2026">February 2026</MenuItem>
                                <MenuItem value="January 2026">January 2026</MenuItem>
                            </TextField>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                    BASIC SALARY (₹)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={basicSalary}
                                    onChange={(e) => setBasicSalary(e.target.value)}
                                    sx={commonTextFieldStyles}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                    HRA (₹)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={hra}
                                    onChange={(e) => setHra(e.target.value)}
                                    sx={commonTextFieldStyles}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                    PF DEDUCTION (₹)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={pfDeduction}
                                    onChange={(e) => setPfDeduction(e.target.value)}
                                    sx={commonTextFieldStyles}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontSize: '11px', color: '#7d8590', fontWeight: 600, textTransform: 'uppercase', mb: 1, letterSpacing: '0.5px' }}>
                                    TAX (₹)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    type="number"
                                    value={tax}
                                    onChange={(e) => setTax(e.target.value)}
                                    sx={commonTextFieldStyles}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{
                            p: 3,
                            mb: 3,
                            borderTop: '1px dashed #30363d',
                            borderBottom: '1px dashed #30363d',
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '13px', color: '#7d8590' }}>Gross Total</Typography>
                                <Typography sx={{ fontSize: '13px', color: '#e6edf3', fontWeight: 600 }}>₹{grossTotal.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography sx={{ fontSize: '13px', color: '#7d8590' }}>Total Deductions</Typography>
                                <Typography sx={{ fontSize: '13px', color: '#f85149', fontWeight: 600 }}>-₹{totalDeductions.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '16px', color: '#e6edf3', fontWeight: 700 }}>Net Salary</Typography>
                                <Typography sx={{ fontSize: '18px', color: '#d2a8ff', fontWeight: 800 }}>₹{netSalary.toLocaleString()}</Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: '#1f6feb',
                                '&:hover': { bgcolor: '#388bfd' },
                                color: '#fff',
                                py: 1.5,
                                borderRadius: '8px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '14px'
                            }}
                            onClick={handleGenerate}
                            disabled={!selectedEmployee || (!basicSalary && !hra)}
                        >
                            Generate & Save Payslip
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GeneratePayslip;
