import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendResetEmail = createAsyncThunk(
    'password/sendResetEmail',
    async (email, thunkAPI) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/users/forgot-password`,
                { email }
            );
            return res.data.message || 'Password reset link sent.';
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || 'Failed to send email.'
            );
        }
    }
);

const passwordSlice = createSlice({
    name: 'password',
    initialState: {
        loading: false,
        message: '',
        error: '',
    },
    reducers: {
        clearPasswordState: (state) => {
            state.message = '';
            state.error = '';
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendResetEmail.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.message = '';
            })
            .addCase(sendResetEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(sendResetEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
