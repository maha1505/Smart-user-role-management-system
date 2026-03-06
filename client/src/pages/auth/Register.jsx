import React, { useState } from 'react';
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

const departments = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        department: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock registration logic
        console.log('Registering user:', formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 10 }}>
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
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                            <MenuItem key={option} value={option}>
                                                {option}
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
    );
};

export default Register;
