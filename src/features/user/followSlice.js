import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/${userId}/follow`);
      return { userId, status: res?.data?.status || 'accepted' };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}/unfollow`);
      return { userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    loading: false,
    error: null,
    followingStatus: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, status } = action.payload;
        state.followingStatus[userId] = status;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        const { userId } = action.payload;
        state.followingStatus[userId] = 'none';
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default followSlice.reducer;
