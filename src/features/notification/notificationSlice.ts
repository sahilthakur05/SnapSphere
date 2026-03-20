import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  postId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Fetch all notifications

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications");
      return res.data; // expects { notifications: Notification[], unreadCount: number }
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
;
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchNotifications.fulfilled,
      (
        state,
        action: PayloadAction<{
          notifications: Notification[];
          unreadCount: number;
        }>,
      ) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      },
    );
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(markAllRead.fulfilled, (state) => {
      state.unreadCount = 0;
      state.notifications.forEach((n) => (n.read = true));
    });
  },
});

export default notificationSlice.reducer;