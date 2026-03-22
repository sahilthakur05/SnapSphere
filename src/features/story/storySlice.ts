import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface StoryLikeUser {
  id: string;
  username: string;
  avatar: string;
}

interface Story {
  id: string;
  image: string;
  likes?: StoryLikeUser[];
  createdAt: string;
}

interface StoryGroup {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
}

interface StoryState {
  storyGroups: StoryGroup[];
  isLoading: boolean;
  viewedStories: Record<string, string[]>; // userId -> storyIds viewed
}

function loadViewedStories(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem("viewedStories");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveViewedStories(viewedStories: Record<string, string[]>) {
  try {
    localStorage.setItem("viewedStories", JSON.stringify(viewedStories));
  } catch {
    // ignore storage errors
  }
}

const initialState: StoryState = {
  storyGroups: [],
  isLoading: false,
  viewedStories: loadViewedStories(),
};

export const fetchStories = createAsyncThunk(
  "stories/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/stories");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stories",
      );
    }
  },
);

export const addStory = createAsyncThunk(
  "stories/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add story",
      );
    }
  },
);

const storySlice = createSlice({
  name: "stories",
  initialState,
  reducers: {
    markStoryViewed(
      state,
      action: PayloadAction<{ userId: string; storyId: string }>,
    ) {
      const { userId, storyId } = action.payload;
      if (!state.viewedStories[userId]) {
        state.viewedStories[userId] = [];
      }
      if (!state.viewedStories[userId].includes(storyId)) {
        state.viewedStories[userId].push(storyId);
        saveViewedStories(state.viewedStories);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchStories.fulfilled,
      (state, action: PayloadAction<StoryGroup[]>) => {
        state.isLoading = false;
        state.storyGroups = action.payload;
      },
    );
    builder.addCase(fetchStories.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      addStory.fulfilled,
      (state, action: PayloadAction<StoryGroup>) => {
        const idx = state.storyGroups.findIndex(
          (g) => g.userId === action.payload.userId,
        );
        if (idx !== -1) {
          state.storyGroups[idx] = action.payload;
        } else {
          state.storyGroups.unshift(action.payload);
        }
      },
    );
  },
});

export const { markStoryViewed } = storySlice.actions;
export default storySlice.reducer;
