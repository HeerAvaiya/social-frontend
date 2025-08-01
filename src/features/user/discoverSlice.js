import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchDiscoverUsers = createAsyncThunk(
    "user/fetchDiscoverUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const meRes = await api.get("/users/me", { headers });
            const me = meRes.data?.data || meRes.data?.user;

            const followingRes = await api.get(`/users/${me.id}/following`, { headers });
            const followingIds = new Set((followingRes.data?.following || []).map(u => u.id));

            const discoverRes = await api.get("/users/discover", { headers });
            const users = discoverRes.data?.users || [];

            return {
                me,
                users,
                followingIds: Array.from(followingIds),
            };
        } catch (err) {
            const message = err.response?.data?.message || err.message;
            const status = err.response?.status;
            if (status === 401) localStorage.removeItem("token");
            return rejectWithValue({ message, status });
        }
    }
);

const discoverSlice = createSlice({
    name: "user/discover",
    initialState: {
        me: null,
        users: [],
        followingIds: [],
        pendingIds: [],
        loading: false,
        error: null,
        q: "",
    },
    reducers: {
        setQuery: (state, action) => {
            state.q = action.payload;
        },
        addFollow: (state, action) => {
            const { userId, isPrivate } = action.payload;
            if (isPrivate) state.pendingIds.push(userId);
            else state.followingIds.push(userId);
        },
        removeFollow: (state, action) => {
            const userId = action.payload;
            state.followingIds = state.followingIds.filter(id => id !== userId);
            state.pendingIds = state.pendingIds.filter(id => id !== userId);
        },
        clearDiscover: (state) => {
            state.users = [];
            state.error = null;
            state.loading = false;
            state.q = "";
            state.followingIds = [];
            state.pendingIds = [];
            state.me = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiscoverUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscoverUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.me = action.payload.me;
                state.users = action.payload.users;
                state.followingIds = action.payload.followingIds;
            })
            .addCase(fetchDiscoverUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
});

export const {
    setQuery,
    addFollow,
    removeFollow,
    clearDiscover,
} = discoverSlice.actions;

export default discoverSlice.reducer;
