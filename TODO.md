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
- [x] Step 18 — Bookmark / Save Posts
- [x] Step 19 — Delete Post
- [x] Step 20 — Edit Post
- [x] Step 21 — Likes List Modal
- [ ] Step 22 — Delete Comment

---

## Step 22 — Delete Comment

**What's already done (UI):**
- `src/pages/PostDetailPage.tsx` — Updated with `onDeleteComment?: (postId: string, commentId: string) => void` prop. Each comment now shows a small **X** button on hover if the comment belongs to the current user.

**Your tasks (Logic):**

### 1. Add `deleteComment` thunk in `src/features/post/postSlice.ts`

```ts
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }: { postId: string; commentId: string }, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${postId}/comment/${commentId}`);
      return { postId, commentId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete comment");
    }
  }
);
```

### 2. Add the `extraReducer` in `postSlice.ts`

```ts
// Delete comment
builder.addCase(
  deleteComment.fulfilled,
  (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
    const { postId, commentId } = action.payload;
    // Update feed posts
    const post = state.posts.find((p) => p.id === postId);
    if (post) {
      post.comments = post.comments.filter((c) => c.id !== commentId);
    }
    // Update single post
    if (state.singlePost && state.singlePost.id === postId) {
      state.singlePost.comments = state.singlePost.comments.filter((c) => c.id !== commentId);
    }
  }
);
```

### 3. Wire it up in `src/pages/PostDetailWrapper.tsx`

```ts
import { deleteComment } from "../features/post/postSlice";

// Pass to <PostDetailPage>:
onDeleteComment={(postId, commentId) => dispatch(deleteComment({ postId, commentId }))}
```

---

### Backend endpoint needed:
`DELETE /posts/:postId/comment/:commentId` — deletes the comment. Only the comment owner should be allowed to delete.

> Tell me when ready and I'll add the next task!
