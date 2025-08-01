import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchDiscoverData = createAsyncThunk(
  'discover/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const meRes = await api.get('/users/me', { headers });
      const me = meRes.data?.data || meRes.data?.user;

      const fRes = await api.get(`/users/${me.id}/following`, { headers });
      const followingIds = new Set((fRes.data?.following || []).map(u => u.id));

      const discoverRes = await api.get('/users/discover', { headers });
      const users = discoverRes.data?.users || [];

      return { me, users, followingIds: Array.from(followingIds) };
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({ message, status });
    }
  }
);

// Slice
const discoverSlice = createSlice({
  name: 'discover',
  initialState: {
    loading: false,
    error: '',
    me: null,
    users: [],
    followingIds: [],
    pendingIds: [],
    q: '',
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscoverData.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDiscoverData.fulfilled, (state, action) => {
        state.loading = false;
        state.me = action.payload.me;
        state.users = action.payload.users;
        state.followingIds = action.payload.followingIds;
      })
      .addCase(fetchDiscoverData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        if (action.payload.status === 401) localStorage.removeItem("token");
      });
  },
});

export const { setQuery, addFollow, removeFollow } = discoverSlice.actions;
export default discoverSlice.reducer;
