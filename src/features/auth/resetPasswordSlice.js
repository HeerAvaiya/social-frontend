import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `http://localhost:8001/api/users/reset-password/${token}`,
                { newPassword }
            );
            return response.data.message;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Reset failed");
        }
    }
);

const resetPasswordSlice = createSlice({
    name: "resetPassword",
    initialState: {
        loading: false,
        successMessage: "",
        errorMessage: "",
    },
    reducers: {
        clearResetMessages: (state) => {
            state.successMessage = "";
            state.errorMessage = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.successMessage = "";
                state.errorMessage = "";
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload;
            });
    },
});

export const { clearResetMessages } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;
