import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface ProfileUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: string[];
  following: string[];
}
interface ProfilePost {
  id: string;
  image: string;
  likes: string[];
  createdAt: string;
}
export interface FollowListUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}
interface ProfileState {
  profile: ProfileUser | null;
  posts: ProfilePost[];
  isLoading: boolean;
  error: string | null;
  followList: FollowListUser[]; // ← add
  followListLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  posts: [],
  isLoading: false,
  error: null,
  followList: [],
  followListLoading: false,
};

// Fetch a user's profile by username

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (username: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${username}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load profile",
      );
    }
  },
);
// Follow / unfollow a user

export const followUser = createAsyncThunk(
  "profile/followUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/${userId}/follow`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

// Update own profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  },
);
// Fetch followers or following list
export const fetchFollowList = createAsyncThunk(
  "profile/fetchFollowList",
  async (
    { username, type }: { username: string; type: "followers" | "following" },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.get(`/users/${username}/${type}`);
      return res.data
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch list",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.posts = [];
    },
    
    clearFollowList(state) {
      state.followList = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (
        state,
        action: PayloadAction<{ user: ProfileUser; posts: ProfilePost[] }>,
      ) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.posts = action.payload.posts;
      },
    );
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(
      followUser.fulfilled,
      (state, action: PayloadAction<{ followers: string[] }>) => {
        if (state.profile) state.profile.followers = action.payload.followers;
      },
    );

    builder.addCase(
      updateProfile.fulfilled,
      (state, action: PayloadAction<ProfileUser>) => {
        state.profile = action.payload;
      },
    );
    builder.addCase(fetchFollowList.pending, (state) => {
      state.followListLoading = true;
    });
    builder.addCase(
      fetchFollowList.fulfilled,
      (state, action: PayloadAction<{ users: FollowListUser[] }>) => {
        state.followListLoading = false;
        state.followList = action.payload.users;
      },
    );
    builder.addCase(fetchFollowList.rejected, (state) => {
      state.followListLoading = false;
    });
  },
});

export const { clearProfile, clearFollowList } = profileSlice.actions;
export default profileSlice.reducer;
