import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { toggleLike, toggleLikeSingle, type Post } from "../post/postSlice";
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

    // Optimistic toggle on pending
    builder.addCase(toggleBookmark.pending, (state, action) => {
      const postId = action.meta.arg;
      if (state.savedPostIds.includes(postId)) {
        state.savedPostIds = state.savedPostIds.filter((id) => id !== postId);
        state.savedPosts = state.savedPosts.filter((p) => p.id !== postId);
      } else {
        state.savedPostIds.push(postId);
      }
    });
    // Confirm with server response
    builder.addCase(
      toggleBookmark.fulfilled,
      (state, action: PayloadAction<{ postId: string; saved: boolean }>) => {
        const { postId, saved } = action.payload;
        if (saved && !state.savedPostIds.includes(postId)) {
          state.savedPostIds.push(postId);
        } else if (!saved) {
          state.savedPostIds = state.savedPostIds.filter((id) => id !== postId);
          state.savedPosts = state.savedPosts.filter((p) => p.id !== postId);
        }
      },
    );
    // Rollback on failure
    builder.addCase(toggleBookmark.rejected, (state, action) => {
      const postId = action.meta.arg;
      if (state.savedPostIds.includes(postId)) {
        state.savedPostIds = state.savedPostIds.filter((id) => id !== postId);
      } else {
        state.savedPostIds.push(postId);
      }
    });

    // Cross-slice: sync likes from feed/detail page to saved posts
    const syncLikes = (state: SavedState, action: PayloadAction<{ postId: string; likes: string[] }>) => {
      const post = state.savedPosts.find((p) => p.id === action.payload.postId);
      if (post) post.likes = action.payload.likes;
    };
    builder.addCase(toggleLike.fulfilled, syncLikes);
    builder.addCase(toggleLikeSingle.fulfilled, syncLikes);
  },
});
export default savedSlice.reducer;
