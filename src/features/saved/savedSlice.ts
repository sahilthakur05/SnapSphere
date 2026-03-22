import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Post } from "../post/postSlice";
import api from "../../lib/axios";

interface SavedState {
  savedPosts: Post[];
  savedPostIds: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SavedState = {
  savedPosts: [],
  savedPostIds: [],
  isLoading: false,
  error: null,
};

// Fetch all saved posts

export const fetchSavedPosts = createAsyncThunk(
  "saved/fetchSavedPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts/saved");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch saved posts",
      );
    }
  },
);

// Toggle bookmark (save/unsave)
export const toggleBookmark = createAsyncThunk(
  "saved/toggleBookmark",
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${postId}/save`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to save post",
      );
    }
  },
);

const savedSlice = createSlice({
  name: "saved",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSavedPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchSavedPosts.fulfilled,
      (
        state,
        action: PayloadAction<{ posts: Post[]; savedPostIds: string[] }>,
      ) => {
        state.isLoading = false;
        state.savedPosts = action.payload.posts;
        state.savedPostIds = action.payload.savedPostIds;
      },
    );
    builder.addCase(fetchSavedPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to fetch saved posts";
    });

    builder.addCase(
      toggleBookmark.fulfilled,
      (state, action: PayloadAction<{ postId: string; saved: boolean }>) => {
        if (action.payload.saved) {
          state.savedPostIds.push(action.payload.postId);
        } else {
          state.savedPostIds = state.savedPostIds.filter(
            (id) => id !== action.payload.postId,
          );
          state.savedPosts = state.savedPosts.filter(
            (p) => p.id !== action.payload.postId,
          );
        }
      },
    );
  },
});
export default savedSlice.reducer;
