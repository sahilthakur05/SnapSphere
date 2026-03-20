# SnapSphere - Development Guide

## Completed:
- [x] Step 1 — Initialize Project
- [x] Step 2 — Install Dependencies
- [x] Step 3 — Configure Tailwind CSS
- [x] Step 4 — Set Up Environment Variables
- [x] Step 5 — Configure Axios with JWT Interceptors
- [x] Step 6 — Configure Redux Store
- [x] Step 7 — Configure React Router
- [x] Step 8 — Create Auth Slice (Redux)
- [x] Step 9 — Build Login & Register Pages
- [x] Step 10 — Build Post Slice & Create Post Feature
- [x] Step 11 — Wire Up the HomePage (Feed, Like, Comment, Logout)
- [x] Step 12 — Build the User Profile Page
- [x] Step 13 — Edit Profile & Link Usernames
- [x] Step 14 — Build Search/Explore Page
- [x] Step 15 — Build Notifications Page
- [x] Step 16 — Followers/Following List Modal
- [x] Step 17 — Post Detail Page

## Completed: Step 17 — Post Detail Page

### Already done for you (UI):
- `src/pages/PostDetailPage.tsx` — pure UI component that accepts props (no Redux/dispatch inside)

The component accepts these props:
```ts
interface Props {
  post: Post | null;
  isLoading: boolean;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onBack: () => void;
}
```

### What you need to do (logic only):

Do these steps **in order** — each step depends on the previous one.

---

#### Step 1: Add new state fields to `src/features/post/postSlice.ts`

Open `src/features/post/postSlice.ts` and find the `PostState` interface (around line 32). Add two new fields:

```ts
interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  singlePost: Post | null;          // ← add this line
  singlePostLoading: boolean;       // ← add this line
}
```

#### Step 2: Update `initialState` in the same file

Find `initialState` (around line 38) and add the new defaults:

```ts
const initialState: PostState = {
  posts: [],
  isLoading: false,
  error: null,
  singlePost: null,                  // ← add this line
  singlePostLoading: false,          // ← add this line
};
```

#### Step 3: Add three new thunks in the same file

Add these **below** the existing `addComment` thunk (after line ~111) and **above** the `createSlice` call:

```ts
// Fetch a single post by ID
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${postId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch post');
    }
  }
);

// Like/unlike on the detail page (updates singlePost)
export const toggleLikeSingle = createAsyncThunk(
  'posts/toggleLikeSingle',
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to like post');
    }
  }
);

// Add comment on the detail page (updates singlePost)
export const addCommentSingle = createAsyncThunk(
  'posts/addCommentSingle',
  async ({ postId, text }: { postId: string; text: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add comment');
    }
  }
);
```

#### Step 4: Add `clearSinglePost` reducer in the same file

Find the `reducers` object inside `createSlice` and add `clearSinglePost` next to `clearPostError`:

```ts
reducers: {
  clearPostError(state) {
    state.error = null;
  },
  clearSinglePost(state) {           // ← add this reducer
    state.singlePost = null;
  },
},
```

#### Step 5: Add extra reducers for the new thunks in the same file

Find the `extraReducers` builder (inside `createSlice`) and add these **at the end**, after the existing `addComment.fulfilled` case:

```ts
// Fetch single post
builder.addCase(fetchPostById.pending, (state) => {
  state.singlePostLoading = true;
});
builder.addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
  state.singlePostLoading = false;
  state.singlePost = action.payload;
});
builder.addCase(fetchPostById.rejected, (state) => {
  state.singlePostLoading = false;
  state.singlePost = null;
});

// Like/unlike single post
builder.addCase(
  toggleLikeSingle.fulfilled,
  (state, action: PayloadAction<{ postId: string; likes: string[] }>) => {
    if (state.singlePost && state.singlePost.id === action.payload.postId) {
      state.singlePost.likes = action.payload.likes;
    }
    // Also update in feed if present
    const feedPost = state.posts.find((p) => p.id === action.payload.postId);
    if (feedPost) feedPost.likes = action.payload.likes;
  }
);

// Add comment to single post
builder.addCase(
  addCommentSingle.fulfilled,
  (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
    if (state.singlePost && state.singlePost.id === action.payload.postId) {
      state.singlePost.comments.push(action.payload.comment);
    }
    // Also update in feed if present
    const feedPost = state.posts.find((p) => p.id === action.payload.postId);
    if (feedPost) feedPost.comments.push(action.payload.comment);
  }
);
```

#### Step 6: Update the exports in the same file

Find the exports line at the bottom and add `clearSinglePost`:

```ts
export const { clearPostError, clearSinglePost } = postSlice.actions;
```

---

#### Step 7: Create a wrapper page to wire Redux to the UI

Create a new file `src/pages/PostDetailWrapper.tsx` that connects Redux to the `PostDetailPage` UI:

```tsx
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPostById, toggleLikeSingle, addCommentSingle, clearSinglePost } from '../features/post/postSlice';
import { PostDetailPage } from './PostDetailPage';

export function PostDetailWrapper() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { singlePost, singlePostLoading } = useAppSelector((state) => state.posts);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (postId) dispatch(fetchPostById(postId));
    return () => { dispatch(clearSinglePost()); };
  }, [postId, dispatch]);

  return (
    <PostDetailPage
      post={singlePost}
      isLoading={singlePostLoading}
      currentUserId={currentUser?.id ?? ''}
      onLike={(id) => dispatch(toggleLikeSingle(id))}
      onComment={(id, text) => dispatch(addCommentSingle({ postId: id, text }))}
      onBack={() => navigate(-1)}
    />
  );
}
```

---

#### Step 8: Add the route in `src/routes/AppRoutes.tsx`

Add this import at the top of the file:
```tsx
import { PostDetailWrapper } from '../pages/PostDetailWrapper';
```

Add this route inside the `<Route element={<PrivateRoute />}>` block (after the notifications route):
```tsx
<Route path="/post/:postId" element={<PostDetailWrapper />} />
```

---

#### Step 9: Make post images clickable in `src/components/PostCard.tsx`

**9a.** Add `useNavigate` to the existing import:
```tsx
import { Link, useNavigate } from 'react-router-dom';
```

**9b.** Add this line inside the component, right below `const isLiked = ...`:
```tsx
const navigate = useNavigate();
```

**9c.** Find the post image (the `{/* Image */}` section) and replace it:

**Before:**
```tsx
<img src={post.image} alt="Post" className="w-full object-cover" />
```

**After:**
```tsx
<img
  src={post.image}
  alt="Post"
  className="w-full cursor-pointer object-cover"
  onClick={() => navigate(`/post/${post.id}`)}
/>
```

**9d.** Find the comments preview section and add a "View all" button before the comments. Replace:

**Before:**
```tsx
{post.comments.length > 0 && (
  <div className="px-4 pt-2 space-y-1">
    {post.comments.slice(-2).map((c) => (
```

**After:**
```tsx
{post.comments.length > 0 && (
  <div className="px-4 pt-2 space-y-1">
    {post.comments.length > 2 && (
      <button
        onClick={() => navigate(`/post/${post.id}`)}
        className="text-sm text-gray-400 hover:text-gray-600"
      >
        View all {post.comments.length} comments
      </button>
    )}
    {post.comments.slice(-2).map((c) => (
```

---

### How to verify:
- No TypeScript errors
- Go to the home feed → click a post image → opens `/post/:postId`
- See **all** comments (not just last 2)
- Like/comment works on detail page
- Click back arrow → returns to feed with updated state
- Posts with 3+ comments show "View all X comments" link in feed

### Done when:
- [x] `src/features/post/postSlice.ts` — steps 1–6 complete (state, thunks, reducers, exports)
- [x] `src/pages/PostDetailWrapper.tsx` — step 7 complete (Redux wrapper created)
- [x] `src/routes/AppRoutes.tsx` — step 8 complete (route added)
- [x] `src/components/PostCard.tsx` — step 9 complete (clickable image + view all comments)
- [x] No TypeScript errors

---

> Tell me when done and I'll add the next task!
