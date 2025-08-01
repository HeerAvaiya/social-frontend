import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';


export const uploadProfileImage = createAsyncThunk(
    'profile/uploadProfileImage',
    async (image, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', image);
            const token = localStorage.getItem('token');

            const res = await api.post('/users/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearProfileState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(uploadProfileImage.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(uploadProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
