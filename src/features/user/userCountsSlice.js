import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchUserCounts = createAsyncThunk("counts/fetchCounts", async (userId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        const [followersRes, followingRes] = await Promise.all([
            api.get(`/users/${userId}/followers`, { headers: { Authorization: `Bearer ${token}` } }),
            api.get(`/users/${userId}/following`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        return {
            followers: followersRes.data?.followers?.length || 0,
            following: followingRes.data?.following?.length || 0,
        };
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
    }
});

const countsSlice = createSlice({
    name: "counts",
    initialState: {
        followers: 0,
        following: 0,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserCounts.fulfilled, (state, action) => {
                state.followers = action.payload.followers;
                state.following = action.payload.following;
                state.loading = false;
            })
            .addCase(fetchUserCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default countsSlice.reducer;
