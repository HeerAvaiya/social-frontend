import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const discoverUsers = createAsyncThunk(
  "discover/discoverUsers",
  async (query = "", thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/users/discover?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🔍 DISCOVER RES:", response.data); 
      return response.data; // should be an array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to discover users");
    }
  }
);


export const followUser = createAsyncThunk(
  "discover/followUser",
  async (userId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`/api/users/${userId}/follow`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { userId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Follow failed");
    }
  }
);

const discoverSlice = createSlice({
  name: "discover",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDiscover: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(discoverUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(discoverUsers.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.users = action.payload;
      // })

      .addCase(discoverUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : []; // ✅ safer
      })


      .addCase(discoverUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(followUser.fulfilled, (state, action) => {
        const userIndex = state.users.findIndex((u) => u.id === action.payload.userId);
        if (userIndex !== -1) {
          state.users[userIndex].isFollowing = true;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDiscover } = discoverSlice.actions;
export default discoverSlice.reducer;

