import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#58a6ff', // GitHub Blue
            light: '#79c0ff',
            dark: '#1f6feb',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f43f5e', // Rose
            contrastText: '#fff',
        },
        background: {
            default: '#07090e', // Deeper Dark BG
            paper: '#0d1117',   // Surface color
        },
        text: {
            primary: '#f0f6fc',
            secondary: '#8b949e',
        },
        divider: '#21262d',
        success: { main: '#3fb950' },
        warning: { main: '#d29922' },
        error: { main: '#f85149' },
        info: { main: '#58a6ff' },
        // Custom Role Colors
        roles: {
            admin: '#58a6ff',
            manager: '#d29922',
            employee: '#3fb950',
            hr: '#f43f5e',
            accountant: '#a371f7'
        }
    },
    typography: {
        fontFamily: '"Manrope", sans-serif',
        h1: { fontFamily: 'Syne, sans-serif', fontWeight: 800 },
        h2: { fontFamily: 'Syne, sans-serif', fontWeight: 800 },
        h3: { fontFamily: 'Syne, sans-serif', fontWeight: 700 },
        h4: { fontFamily: 'Syne, sans-serif', fontWeight: 700 },
        h5: { fontFamily: 'Syne, sans-serif', fontWeight: 700 },
        h6: { fontFamily: 'Syne, sans-serif', fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontWeight: 600,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid #30363d',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid #30363d',
                    backgroundColor: '#161b22',
                    transition: 'border-color 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: '#444c56',
                    }
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #30363d',
                    padding: '12px 16px',
                },
                head: {
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05rem',
                    color: '#7d8590',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(13, 17, 23, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid #30363d',
                    boxShadow: 'none',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#161b22',
                    borderRight: '1px solid #30363d',
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        height: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#30363d',
                        borderRadius: '10px',
                    },
                },
            },
        },
    },
});

export default theme;
