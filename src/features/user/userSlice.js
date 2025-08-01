import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data || res.data?.user;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "user/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/users/profile/image", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data?.profileImageUrl || res.data?.user?.profileImageUrl;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/me", formData);
      return res.data.data || res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Profile update failed");
    }
  }
);

export const togglePrivacy = createAsyncThunk(
  "user/togglePrivacy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/me/privacy");
      return res.data.isPrivate;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Privacy toggle failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.profile = action.payload;
    },
    logout(state) {
      state.profile = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImageUrl = action.payload;
        }
      })

      
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(togglePrivacy.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.isPrivate = action.payload;
        }
      });
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
