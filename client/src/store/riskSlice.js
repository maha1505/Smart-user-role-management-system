import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

export const fetchAllRiskScores = createAsyncThunk(
    'risk/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get('/risk/scores');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch risk scores');
        }
    }
);

export const fetchTeamRiskScores = createAsyncThunk(
    'risk/fetchTeam',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.get('/risk/scores/team');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch team risk scores');
        }
    }
);

export const fetchEmployeeRiskHistory = createAsyncThunk(
    'risk/fetchHistory',
    async (employeeId, { rejectWithValue }) => {
        try {
            const { data } = await API.get(`/risk/scores/${employeeId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch risk history');
        }
    }
);

export const recalculateRiskScores = createAsyncThunk(
    'risk/recalculate',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await API.post('/risk/recalculate');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Recalculation failed');
        }
    }
);

const riskSlice = createSlice({
    name: 'risk',
    initialState: {
        scores: [],
        selectedEmployeeHistory: [],
        loading: false,
        error: null,
        recalculating: false,
        successMessage: null
    },
    reducers: {
        clearRiskError: (state) => {
            state.error = null;
        },
        clearRiskSuccess: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllRiskScores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllRiskScores.fulfilled, (state, action) => {
                state.loading = false;
                state.scores = action.payload;
            })
            .addCase(fetchAllRiskScores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Team
            .addCase(fetchTeamRiskScores.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamRiskScores.fulfilled, (state, action) => {
                state.loading = false;
                state.scores = action.payload;
            })
            .addCase(fetchTeamRiskScores.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch History
            .addCase(fetchEmployeeRiskHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeRiskHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEmployeeHistory = action.payload;
            })
            .addCase(fetchEmployeeRiskHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Recalculate
            .addCase(recalculateRiskScores.pending, (state) => {
                state.recalculating = true;
                state.error = null;
            })
            .addCase(recalculateRiskScores.fulfilled, (state, action) => {
                state.recalculating = false;
                state.successMessage = action.payload.message;
            })
            .addCase(recalculateRiskScores.rejected, (state, action) => {
                state.recalculating = false;
                state.error = action.payload;
            });
    }
});

export const { clearRiskError, clearRiskSuccess } = riskSlice.actions;
export default riskSlice.reducer;
