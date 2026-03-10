import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Link,
    Grid,
    MenuItem,
    Alert,
} from '@mui/material';
import { AppRegistrationOutlined } from '@mui/icons-material';
import API from '../../api/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        department: '',
    });
    const [departments, setDepartments] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const { data } = await API.get('/auth/departments');
                setDepartments(data);
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await API.post('/auth/register', formData);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#0d1117'
            }}>
                <Container maxWidth="sm">
                    <Box sx={{ mt: 0 }}>
                        <Alert severity="success" variant="filled" sx={{ borderRadius: 3, p: 4 }}>
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                Registration Successful!
                            </Typography>
                            <Typography variant="body1">
                                Your account has been created and is currently <b>Pending Approval</b> by the Admin.
                                You will be able to login once your request is approved.
                            </Typography>
                            <Button
                                variant="contained"
                                color="inherit"
                                sx={{ mt: 3, color: 'success.main', fontWeight: 'bold' }}
                                onClick={() => navigate('/login')}
                            >
                                Back to Login
                            </Button>
                        </Alert>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#0d1117',
            py: 4
        }}>
            <Container maxWidth="sm">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Card sx={{ width: '100%', p: 2, borderRadius: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        backgroundColor: 'secondary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        p: 1.5,
                                        mb: 1,
                                    }}
                                >
                                    <AppRegistrationOutlined />
                                </Box>
                                <Typography variant="h4" gutterBottom>
                                    Join Us
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Create your account to get started
                                </Typography>
                            </Box>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Username"
                                            name="username"
                                            required
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Department"
                                            name="department"
                                            select
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                        >
                                            {departments.map((option) => (
                                                <MenuItem key={option.id || option.name} value={option.name}>
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 2 }}
                                >
                                    Register
                                </Button>
                            </form>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="body2">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold">
                                        Login here
                                    </Link>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;
