import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface User {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
}

interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  user: User;
  image: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
};

// Fetch feed posts

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/posts/feed");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch posts",
      );
    }
  },
);

// create a new post

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create post",
      );
    }
  },
);

// Like / unlike a post

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to like post",
      );
    }
  },
);

// Add a comment

export const addComment = createAsyncThunk(
  "posts/addComments",
  async (
    { postId, text }: { postId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add comment",
      );
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPostError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetch posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      fetchPosts.fulfilled,
      (state, action: PayloadAction<Post[]>) => {
        state.isLoading = false;
        state.posts = action.payload;
      },
    );
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    //create post
    builder.addCase(
      createPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      },
    );

    //Toggle like
    builder.addCase(
      toggleLike.fulfilled,
      (state, action: PayloadAction<{ postId: string; likes: string[] }>) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
      },
    );

    // Add comment
    builder.addCase(
      addComment.fulfilled,
      (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.comments.push(action.payload.comment);
      },
    );
  },
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
