import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "story_like";
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  postId?: string;
  storyImage?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  error: string | null;
}
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  loadingMore: false,
  hasMore: true,
  currentPage: 1,
  error: null,
};

// Fetch notifications with pagination
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/notifications?page=${page}&limit=20`);
      return { ...res.data, page };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// Mark all as read
export const markAllRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put("/notifications/read");
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark as read",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state, action) => {
      if (action.meta.arg === 1 || action.meta.arg === undefined) {
        state.isLoading = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    });
    builder.addCase(
      fetchNotifications.fulfilled,
      (
        state,
        action: PayloadAction<{
          notifications: Notification[];
          unreadCount: number;
          hasMore: boolean;
          page: number;
        }>,
      ) => {
        state.isLoading = false;
        state.loadingMore = false;
        if (action.payload.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications.push(...action.payload.notifications);
        }
        state.unreadCount = action.payload.unreadCount;
        state.hasMore = action.payload.hasMore;
        state.currentPage = action.payload.page;
      },
    );
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.loadingMore = false;
      state.error = action.payload as string;
    });
    builder.addCase(markAllRead.fulfilled, (state) => {
      state.unreadCount = 0;
      state.notifications.forEach((n) => (n.read = true));
    });
  },
});

export default notificationSlice.reducer;
