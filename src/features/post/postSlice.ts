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
  singlePost: Post | null;
  singlePostLoading: boolean;
  likeUsers: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  }[];
  likeUsersLoading: boolean;
  currentPage: number;
  hasMore: boolean;
  loadingMore: boolean;
}

const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  singlePost: null,
  singlePostLoading: false,
  likeUsers: [],
  likeUsersLoading: false,
  currentPage: 1,
  hasMore: true,
  loadingMore: false,
};

// Fetch feed posts

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/feed?page=${page}&limit=10`);
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

// Like / unlike a post (optimistic)

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }: { postId: string; userId: string }, { rejectWithValue }) => {
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

// Fetch a single post by ID
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${postId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch post",
      );
    }
  },
);

// Like/unlike on the detail page (optimistic, updates singlePost)
export const toggleLikeSingle = createAsyncThunk(
  "posts/toggleLikeSingle",
  async ({ postId }: { postId: string; userId: string }, { rejectWithValue }) => {
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

// Add comment on the detail page (updates singlePost)
export const addCommentSingle = createAsyncThunk(
  "posts/addCommentSingle",
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
// Delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}`);
      return postId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete post",
      );
    }
  },
);

// edit a post
export const editPost = createAsyncThunk(
  "posts/editPost",
  async (
    { postId, caption }: { postId: string; caption: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.put(`/posts/${postId}`, { caption });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to edit post",
      );
    }
  },
);

//fetch post

export const fetchPostLikes = createAsyncThunk(
  "posts/fetchPostLikes",
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${postId}/likes`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch likes",
      );
    }
  },
);

// delete commment

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async (
    { postId, commentId }: { postId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      await api.delete(`/posts/${postId}/comment/${commentId}`);
      return { postId, commentId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

// Edit a comment
export const editComment = createAsyncThunk(
  "posts/editComment",
  async (
    { postId, commentId, text }: { postId: string; commentId: string; text: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await api.put(`/posts/${postId}/comment/${commentId}`, { text });
      return { postId, commentId, text: res.data.text };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to edit comment",
      );
    }
  },
);

// Report a post
export const reportPost = createAsyncThunk(
  "posts/reportPost",
  async (
    { postId, reason }: { postId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      await api.post(`/posts/${postId}/report`, { reason });
      return postId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to report post",
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
    clearSinglePost(state) {
      state.singlePost = null;
    },
  },
  extraReducers: (builder) => {
    // fetch posts
    builder.addCase(fetchPosts.pending, (state, action) => {
      if (action.meta.arg === 1 || action.meta.arg === undefined) {
        state.isLoading = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    });
   builder.addCase(fetchPosts.fulfilled, (state, action) => {
     state.isLoading = false;
     state.loadingMore = false;
     if (action.meta.arg === 1 || action.meta.arg === undefined) {
       state.posts = action.payload.posts;
     } else {
       state.posts.push(...action.payload.posts);
     }
     state.hasMore = action.payload.hasMore;
     state.currentPage = action.meta.arg || 1;
   });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.loadingMore = false;
      state.error = (action.payload as string) || "Failed to fetch posts";
    });
    

    //create post
    builder.addCase(
      createPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.posts.unshift(action.payload);
      },
    );

    //Toggle like — optimistic update on pending, confirm on fulfilled, rollback on rejected
    builder.addCase(toggleLike.pending, (state, action) => {
      const { postId, userId } = action.meta.arg;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    });
    builder.addCase(
      toggleLike.fulfilled,
      (state, action: PayloadAction<{ postId: string; likes: string[] }>) => {
        // Server is the source of truth — sync
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.likes = action.payload.likes;
      },
    );
    builder.addCase(toggleLike.rejected, (state, action) => {
      // Rollback: toggle back
      const { postId, userId } = action.meta.arg;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    });

    // Add comment
    builder.addCase(
      addComment.fulfilled,
      (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
        const post = state.posts.find((p) => p.id === action.payload.postId);
        if (post) post.comments.push(action.payload.comment);
      },
    );

    // Fetch single post
    builder.addCase(fetchPostById.pending, (state) => {
      state.singlePostLoading = true;
    });
    builder.addCase(
      fetchPostById.fulfilled,
      (state, action: PayloadAction<Post>) => {
        state.singlePostLoading = false;
        state.singlePost = action.payload;
      },
    );
    builder.addCase(fetchPostById.rejected, (state) => {
      state.singlePostLoading = false;
      state.singlePost = null;
    });

    // Like/unlike single post — optimistic
    builder.addCase(toggleLikeSingle.pending, (state, action) => {
      const { postId, userId } = action.meta.arg;
      const toggle = (likes: string[]) =>
        likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];
      if (state.singlePost && state.singlePost.id === postId) {
        state.singlePost.likes = toggle(state.singlePost.likes);
      }
      const feedPost = state.posts.find((p) => p.id === postId);
      if (feedPost) feedPost.likes = toggle(feedPost.likes);
    });
    builder.addCase(
      toggleLikeSingle.fulfilled,
      (state, action: PayloadAction<{ postId: string; likes: string[] }>) => {
        if (state.singlePost && state.singlePost.id === action.payload.postId) {
          state.singlePost.likes = action.payload.likes;
        }
        const feedPost = state.posts.find(
          (p) => p.id === action.payload.postId,
        );
        if (feedPost) feedPost.likes = action.payload.likes;
      },
    );
    builder.addCase(toggleLikeSingle.rejected, (state, action) => {
      const { postId, userId } = action.meta.arg;
      const toggle = (likes: string[]) =>
        likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];
      if (state.singlePost && state.singlePost.id === postId) {
        state.singlePost.likes = toggle(state.singlePost.likes);
      }
      const feedPost = state.posts.find((p) => p.id === postId);
      if (feedPost) feedPost.likes = toggle(feedPost.likes);
    });

    // Add comment to single post
    builder.addCase(
      addCommentSingle.fulfilled,
      (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
        if (state.singlePost && state.singlePost.id === action.payload.postId) {
          state.singlePost.comments.push(action.payload.comment);
        }
        const feedPost = state.posts.find(
          (p) => p.id === action.payload.postId,
        );
        if (feedPost) feedPost.comments.push(action.payload.comment);
      },
    );

    // Delete post
    builder.addCase(
      deletePost.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        if (state.singlePost && state.singlePost.id === action.payload) {
          state.singlePost = null;
        }
      },
    );

    // edit post
    builder.addCase(
      editPost.fulfilled,
      (state, action: PayloadAction<Post>) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.posts[idx] = action.payload;
        if (state.singlePost && state.singlePost.id === action.payload.id) {
          state.singlePost = action.payload;
        }
      },
    );

    // fetch post likes
    builder.addCase(fetchPostLikes.pending, (state) => {
      state.likeUsersLoading = true;
      state.likeUsers = [];
    });
    builder.addCase(fetchPostLikes.fulfilled, (state, action) => {
      state.likeUsersLoading = false;
      state.likeUsers = action.payload;
    });
    builder.addCase(fetchPostLikes.rejected, (state) => {
      state.likeUsersLoading = false;
    });

    // delete comment
    builder.addCase(
      deleteComment.fulfilled,
      (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
        const { postId, commentId } = action.payload;
        //update feed Posts
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.comments = post.comments.filter((c) => c.id !== commentId);
        }
        // update single post
        if (state.singlePost && state.singlePost.id === postId) {
          state.singlePost.comments = state.singlePost.comments.filter(
            (c) => c.id !== commentId,
          );
        }
      },
    );

    // edit comment
    builder.addCase(
      editComment.fulfilled,
      (state, action: PayloadAction<{ postId: string; commentId: string; text: string }>) => {
        const { postId, commentId, text } = action.payload;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          const comment = post.comments.find((c) => c.id === commentId);
          if (comment) comment.text = text;
        }
        if (state.singlePost && state.singlePost.id === postId) {
          const comment = state.singlePost.comments.find((c) => c.id === commentId);
          if (comment) comment.text = text;
        }
      },
    );
  },
});

export const { clearPostError, clearSinglePost } = postSlice.actions;
export default postSlice.reducer;
