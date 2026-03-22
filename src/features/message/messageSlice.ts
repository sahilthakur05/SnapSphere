import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface MessageUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface LastMessage {
  id: string;
  text: string;
  senderId: string;
  storyImage: string | null;
  createdAt: string;
}

export interface Conversation {
  user: MessageUser;
  lastMessage: LastMessage;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  image: string | null;
  storyImage: string | null;
  read: boolean;
  createdAt: string;
}

interface MessageState {
  conversations: Conversation[];
  currentChat: {
    user: MessageUser | null;
    messages: Message[];
  };
  isLoading: boolean;
  chatLoading: boolean;
  chatLoadingMore: boolean;
  chatHasMore: boolean;
  chatPage: number;
  error: string | null;
  totalUnread: number;
  onlineUsers: string[];
  typingUsers: Record<string, boolean>;
}

const initialState: MessageState = {
  conversations: [],
  currentChat: { user: null, messages: [] },
  isLoading: false,
  chatLoading: false,
  chatLoadingMore: false,
  chatHasMore: true,
  chatPage: 1,
  error: null,
  totalUnread: 0,
  onlineUsers: [],
  typingUsers: {},
};

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/messages");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch conversations",
      );
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ userId, page = 1 }: { userId: string; page?: number }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/messages/${userId}?page=${page}&limit=30`);
      return { ...res.data, page };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (
    { recipientId, text }: { recipientId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post("/messages", { recipientId, text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message",
      );
    }
  },
);

export const likeStory = createAsyncThunk(
  "messages/likeStory",
  async (storyId: string, { rejectWithValue }) => {
    try {
      await api.put(`/stories/${storyId}/like`);
      return storyId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to like story",
      );
    }
  },
);

export const replyToStory = createAsyncThunk(
  "messages/replyToStory",
  async (
    { storyId, text }: { storyId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post(`/stories/${storyId}/reply`, { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reply to story",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearCurrentChat(state) {
      state.currentChat = { user: null, messages: [] };
    },
    // Real-time: message sent by current user via socket
    messageSentViaSocket(state, action: PayloadAction<Message>) {
      state.currentChat.messages.push(action.payload);
    },
    // Real-time: message received from another user
    receiveMessage(state, action: PayloadAction<Message & { fromUserId?: string }>) {
      const msg = action.payload;
      const senderId = msg.fromUserId || msg.senderId;

      // If chat is open with this sender, add to current chat
      if (state.currentChat.user?.id === senderId) {
        state.currentChat.messages.push({
          id: msg.id,
          senderId: msg.senderId,
          text: msg.text,
          image: msg.image || null,
          storyImage: msg.storyImage,
          read: msg.read,
          createdAt: msg.createdAt,
        });
      } else {
        // Chat not open — increment unread
        state.totalUnread += 1;
      }

      // Update conversation list
      const convIdx = state.conversations.findIndex((c) => c.user.id === senderId);
      if (convIdx !== -1) {
        state.conversations[convIdx].lastMessage = {
          id: msg.id,
          text: msg.text,
          senderId: msg.senderId,
          storyImage: msg.storyImage,
          createdAt: msg.createdAt,
        };
        if (state.currentChat.user?.id !== senderId) {
          state.conversations[convIdx].unreadCount += 1;
        }
        // Move to top
        const [conv] = state.conversations.splice(convIdx, 1);
        state.conversations.unshift(conv);
      }
    },
    updateTypingStatus(state, action: PayloadAction<{ userId: string; typing: boolean }>) {
      state.typingUsers[action.payload.userId] = action.payload.typing;
    },
    updateOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },
    markMessagesAsRead(state, _action: PayloadAction<{ readBy: string }>) {
      // Mark all messages in current chat as read
      state.currentChat.messages.forEach((m) => {
        m.read = true;
      });
    },
  },
  extraReducers: (builder) => {
    // Conversations
    builder.addCase(fetchConversations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchConversations.fulfilled,
      (state, action: PayloadAction<Conversation[]>) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.totalUnread = action.payload.reduce(
          (sum, c) => sum + c.unreadCount,
          0,
        );
      },
    );
    builder.addCase(fetchConversations.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || "Failed to fetch conversations";
    });

    // Chat messages (paginated)
    builder.addCase(fetchMessages.pending, (state, action) => {
      if (action.meta.arg.page === 1 || action.meta.arg.page === undefined) {
        state.chatLoading = true;
      } else {
        state.chatLoadingMore = true;
      }
    });
    builder.addCase(
      fetchMessages.fulfilled,
      (
        state,
        action: PayloadAction<{ user: MessageUser; messages: Message[]; hasMore: boolean; page: number }>,
      ) => {
        state.chatLoading = false;
        state.chatLoadingMore = false;
        state.chatHasMore = action.payload.hasMore;
        state.chatPage = action.payload.page;
        if (action.payload.page === 1) {
          state.currentChat = {
            user: action.payload.user,
            messages: action.payload.messages,
          };
        } else {
          // Prepend older messages
          state.currentChat.messages = [
            ...action.payload.messages,
            ...state.currentChat.messages,
          ];
        }
      },
    );
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.chatLoading = false;
      state.chatLoadingMore = false;
      state.error = (action.payload as string) || "Failed to fetch messages";
    });

    // Send message
    builder.addCase(
      sendMessage.fulfilled,
      (state, action: PayloadAction<Message>) => {
        state.currentChat.messages.push(action.payload);
      },
    );
  },
});

export const {
  clearCurrentChat,
  messageSentViaSocket,
  receiveMessage,
  updateTypingStatus,
  updateOnlineUsers,
  markMessagesAsRead,
} = messageSlice.actions;
export default messageSlice.reducer;
