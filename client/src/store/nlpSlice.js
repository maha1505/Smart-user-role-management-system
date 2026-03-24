import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/api';

export const parseTaskAction = createAsyncThunk(
    'nlp/parseTask',
    async (sentence, { rejectWithValue }) => {
        try {
            const response = await API.post('/nlp/parse-task', { sentence });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to parse task');
        }
    }
);

const nlpSlice = createSlice({
    name: 'nlp',
    initialState: {
        parsing: false,
        result: null,
        error: null,
    },
    reducers: {
        clearNLPResult: (state) => {
            state.result = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(parseTaskAction.pending, (state) => {
                state.parsing = true;
                state.error = null;
            })
            .addCase(parseTaskAction.fulfilled, (state, action) => {
                state.parsing = false;
                state.result = action.payload;
            })
            .addCase(parseTaskAction.rejected, (state, action) => {
                state.parsing = false;
                state.error = action.payload;
            });
    },
});

export const { clearNLPResult } = nlpSlice.actions;
export default nlpSlice.reducer;
