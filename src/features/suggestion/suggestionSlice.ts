import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { followUser as profileFollowUser } from "../profile/profileSlice";

interface SuggestedUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface SuggestionState {
  users: SuggestedUser[];
  isLoading: boolean;
}

const initialState: SuggestionState = {
  users: [],
  isLoading: false,
};

// fetch sugggestiions poost

export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetchSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/suggestions");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch suggestions",
      );
    }
  },
);

export const followUser = createAsyncThunk(
  "suggestions/follow",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.put(`/users/${userId}/follow`);
      return userId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchSuggestions.fulfilled,
      (state, action: PayloadAction<SuggestedUser[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      },
    );

    builder.addCase(fetchSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
    // Remove user from suggestions after following (from suggestion card)
    builder.addCase(
      followUser.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      },
    );
    // Cross-slice: also remove from suggestions when followed from profile page
    builder.addCase(profileFollowUser.fulfilled, (state, action) => {
      const { userId } = action.meta.arg;
      state.users = state.users.filter((u) => u.id !== userId);
    });
  },
});

export default suggestionsSlice.reducer;
