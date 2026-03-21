import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface SearchUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}
interface ExplorePost {
  id: string;
  image: string;
  likes: string[];
}

interface SearchState {
  results: SearchUser[];
  isLoading: boolean;
  error: string | null;
  explorePosts: ExplorePost[];
  exploreLoading: boolean;
}

const initialState: SearchState = {
  results: [],
  isLoading: false,
  error: null,
  explorePosts: [],
  exploreLoading: false,
};

export const searchUsers = createAsyncThunk(
  "search/searchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  },
);

export const fetchExplorePosts = createAsyncThunk(
  "search/fetchExplorePosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts/explore");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch explore posts",
      );
    }
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearch(state) {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      searchUsers.fulfilled,
      (state, action: PayloadAction<SearchUser[]>) => {
        state.isLoading = false;
        state.results = action.payload;
      },
    );
    builder.addCase(searchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Explore posts
    builder.addCase(fetchExplorePosts.pending, (state) => {
      state.exploreLoading = true;
    });
    builder.addCase(fetchExplorePosts.fulfilled, (state, action) => {
      state.exploreLoading = false;
      state.explorePosts = action.payload;
    });
    builder.addCase(fetchExplorePosts.rejected, (state) => {
      state.exploreLoading = false;
    });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
