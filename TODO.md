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
- [ ] Step 20 — Edit Post

---

## Step 20 — Edit Post (Caption Only)

**What's already done (UI):**
- `src/components/EditPostModal.tsx` — Pure UI modal that shows the post image (read-only) and an editable caption textarea. Accepts props: `isOpen`, `onClose`, `postImage`, `caption`, `onCaptionChange`, `onSave`, `isSubmitting`.
- `src/components/PostCard.tsx` — Updated with an `onEdit?: (post: Post) => void` prop. The three-dot menu now shows an **Edit Post** button (with pencil icon) above the Delete button for post owners.

**Your tasks (Logic):**

### 1. Add `editPost` thunk in `src/features/post/postSlice.ts`

```ts
export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, caption }: { postId: string; caption: string }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/posts/${postId}`, { caption });
      return res.data; // should return the updated Post
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to edit post");
    }
  }
);
```

### 2. Add the `extraReducer` for `editPost` in the same file

```ts
// Edit post
builder.addCase(
  editPost.fulfilled,
  (state, action: PayloadAction<Post>) => {
    const idx = state.posts.findIndex((p) => p.id === action.payload.id);
    if (idx !== -1) state.posts[idx] = action.payload;
    if (state.singlePost && state.singlePost.id === action.payload.id) {
      state.singlePost = action.payload;
    }
  }
);
```

### 3. Wire it up in `src/pages/HomePage.tsx`

Add state and handler:

```ts
import { EditPostModal } from "../components/EditPostModal";
import { editPost } from "../features/post/postSlice";

// Inside the component:
const [editingPost, setEditingPost] = useState<Post | null>(null);
const [editCaption, setEditCaption] = useState("");
const [isEditSubmitting, setIsEditSubmitting] = useState(false);

const handleEdit = (post: Post) => {
  setEditingPost(post);
  setEditCaption(post.caption);
};

const handleSaveEdit = async () => {
  if (!editingPost) return;
  setIsEditSubmitting(true);
  await dispatch(editPost({ postId: editingPost.id, caption: editCaption }));
  setIsEditSubmitting(false);
  setEditingPost(null);
};
```

Pass the `onEdit` prop to each `<PostCard>`:

```tsx
<PostCard ... onEdit={handleEdit} />
```

Render the modal at the bottom of the page:

```tsx
<EditPostModal
  isOpen={!!editingPost}
  onClose={() => setEditingPost(null)}
  postImage={editingPost?.image || ""}
  caption={editCaption}
  onCaptionChange={setEditCaption}
  onSave={handleSaveEdit}
  isSubmitting={isEditSubmitting}
/>
```

### 4. (Optional) Wire it in `PostDetailPage.tsx` too

Same pattern — add `editingPost` state, pass `onEdit` to the card/detail UI, and render `<EditPostModal>`.

---

### Backend endpoint needed:
`PUT /posts/:postId` — accepts `{ caption }` in body, returns the updated post object.

> Tell me when ready and I'll add the next task!
