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
- [ ] Step 21 — Likes List Modal

---

## Step 21 — Likes List Modal (See Who Liked a Post)

**What's already done (UI):**
- `src/components/LikesListModal.tsx` — Pure UI modal that displays a scrollable list of users who liked a post. Each user shows avatar, username, and full name — clicking navigates to their profile. Accepts props: `isOpen`, `onClose`, `users`, `isLoading`.
- `src/components/PostCard.tsx` — Updated with `onShowLikes?: (postId: string) => void` prop. The likes count (e.g. "12 likes") is now a clickable button below the action icons.

**Your tasks (Logic):**

### 1. Add `fetchPostLikes` thunk in `src/features/post/postSlice.ts`

```ts
export const fetchPostLikes = createAsyncThunk(
  "posts/fetchPostLikes",
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/posts/${postId}/likes`);
      return res.data; // should return array of { id, username, fullName, avatar }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch likes");
    }
  }
);
```

### 2. Add state & reducer in `postSlice.ts`

Add to `PostState` interface:

```ts
likeUsers: { id: string; username: string; fullName: string; avatar: string }[];
likeUsersLoading: boolean;
```

Add to `initialState`:

```ts
likeUsers: [],
likeUsersLoading: false,
```

Add `extraReducers`:

```ts
// Fetch post likes
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
```

### 3. Wire it up in `src/pages/HomePage.tsx`

```ts
import { LikesListModal } from "../components/LikesListModal";
import { fetchPostLikes } from "../features/post/postSlice";

// Inside component:
const { likeUsers, likeUsersLoading } = useAppSelector((state) => state.posts);
const [showLikesModal, setShowLikesModal] = useState(false);

const handleShowLikes = (postId: string) => {
  dispatch(fetchPostLikes(postId));
  setShowLikesModal(true);
};
```

Pass the prop to `<PostCard>`:

```tsx
<PostCard ... onShowLikes={handleShowLikes} />
```

Render the modal:

```tsx
<LikesListModal
  isOpen={showLikesModal}
  onClose={() => setShowLikesModal(false)}
  users={likeUsers}
  isLoading={likeUsersLoading}
/>
```

### 4. Wire it in `PostDetailWrapper.tsx`

The UI is already updated — `PostDetailPage.tsx` now has `onShowLikes` prop and a clickable likes count. You just need to wire it in the wrapper.

In `src/pages/PostDetailWrapper.tsx`:

```ts
import { useState } from "react";
import { fetchPostLikes } from "../features/post/postSlice";
import { LikesListModal } from "../components/LikesListModal";

// Inside component:
const { likeUsers, likeUsersLoading } = useAppSelector((state) => state.posts);
const [showLikesModal, setShowLikesModal] = useState(false);

const handleShowLikes = (postId: string) => {
  dispatch(fetchPostLikes(postId));
  setShowLikesModal(true);
};
```

Pass it to `<PostDetailPage>`:

```tsx
<PostDetailPage ... onShowLikes={handleShowLikes} />
```

Render the modal after `<PostDetailPage>`:

```tsx
<LikesListModal
  isOpen={showLikesModal}
  onClose={() => setShowLikesModal(false)}
  users={likeUsers}
  isLoading={likeUsersLoading}
/>
```

---

### Backend endpoint needed:
`GET /posts/:postId/likes` — returns an array of user objects `[{ id, username, fullName, avatar }]` who liked the post.

> Tell me when ready and I'll add the next task!
