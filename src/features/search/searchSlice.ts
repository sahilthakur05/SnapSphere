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
interface SearchState {
  results: SearchUser[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  isLoading: false,
  error: null,
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
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;