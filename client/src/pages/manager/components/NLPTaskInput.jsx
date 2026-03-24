import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { AutoAwesome as MagicIcon, Warning as WarningIcon } from '@mui/icons-material';
import { parseTaskAction, clearNLPResult } from '../../../store/nlpSlice';

const NLPTaskInput = ({ onParseSuccess }) => {
    const dispatch = useDispatch();
    const { parsing, result, error } = useSelector((state) => state.nlp);
    const [sentence, setSentence] = useState('');

    const handleParse = async () => {
        if (!sentence.trim()) return;
        const action = await dispatch(parseTaskAction(sentence));
        if (parseTaskAction.fulfilled.match(action)) {
            onParseSuccess(action.payload);
        }
    };

    return (
        <Box sx={{ p: 2, bgcolor: '#161b22', borderRadius: '8px', border: '1px solid #30363d', mb: 3 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#e6edf3', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MagicIcon sx={{ fontSize: 18, color: '#58a6ff' }} />
                    Describe your task
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder='e.g., "Assign the Q3 report to Priya, due Friday, high priority"'
                    value={sentence}
                    onChange={(e) => setSentence(e.target.value)}
                    disabled={parsing}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#0d1117',
                            color: '#e6edf3',
                            '& fieldset': { borderColor: '#30363d' },
                            '&:hover fieldset': { borderColor: '#58a6ff' },
                        }
                    }}
                />
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(248, 81, 73, 0.1)', color: '#f85149', border: '1px solid rgba(248, 81, 73, 0.2)' }}>
                    {error}
                </Alert>
            )}

            {result && result.confidence < 0.7 && (
                <Alert 
                    severity="warning" 
                    icon={<WarningIcon sx={{ color: '#d29922' }} />}
                    sx={{ mb: 2, bgcolor: 'rgba(210, 153, 34, 0.1)', color: '#d29922', border: '1px solid rgba(210, 153, 34, 0.2)' }}
                >
                    Low confidence auto-fill. Please verify all fields below.
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    {result && (
                        <Chip 
                            label={`Parsed by ${result.parsedBy}`} 
                            size="small" 
                            sx={{ bgcolor: '#1f3958', color: '#58a6ff', fontSize: '10px', fontWeight: 600, height: 20 }}
                        />
                    )}
                </Box>
                <Button
                    variant="contained"
                    onClick={handleParse}
                    disabled={parsing || !sentence.trim()}
                    startIcon={parsing ? <CircularProgress size={16} color="inherit" /> : <MagicIcon />}
                    sx={{
                        bgcolor: '#238636',
                        '&:hover': { bgcolor: '#2ea043' },
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {parsing ? 'Parsing...' : 'Parse & Auto-fill'}
                </Button>
            </Box>
        </Box>
    );
};

export default NLPTaskInput;
