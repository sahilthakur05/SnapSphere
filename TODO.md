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
- [x] Step 22 — Delete Comment
- [x] Step 23 — Suggested Users Sidebar
- [x] Step 24 — Share Post (Copy Link)
- [x] Step 25 — Mobile Bottom Navigation Bar
- [x] Step 26 — Double Tap to Like (Heart Animation)
- [x] Step 27 — Infinite Scroll / Load More Posts
- [x] Step 28 — Skeleton Loading Screens
- [x] Step 29 — Relative Time Formatting
- [x] Step 30 — Image Lightbox Modal
- [x] Step 31 — Profile Grid Hover Stats & Navigation
- [x] Step 32 — Explore Page Discover Grid
- [ ] Step 33 — Change Password

---

## Step 33 — Change Password

**What's already done (UI):**
- `src/components/ChangePasswordModal.tsx` — Modal with current password, new password (with show/hide toggle), confirm password fields. Has client-side validation (required, min 6 chars, match check). Shows error messages from both client and server. Accepts props: `isOpen`, `onClose`, `onSubmit`, `isSubmitting`, `error`.
- `src/pages/ProfilePage.tsx` — Added a "Change Password" button next to "Edit Profile" (own profile only). Uses `showPasswordModal` state (you need to add it).

**Your tasks (Logic):**

### 1. Add `changePassword` thunk in `src/features/auth/authSlice.ts`

```ts
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const res = await api.put("/auth/change-password", { currentPassword, newPassword });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to change password");
    }
  }
);
```

### 2. Wire it up in `src/pages/ProfilePage.tsx`

```ts
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { changePassword } from "../features/auth/authSlice";

// Add state:
const [showPasswordModal, setShowPasswordModal] = useState(false);
const [isChangingPassword, setIsChangingPassword] = useState(false);
const [passwordError, setPasswordError] = useState<string | null>(null);

// Add handler:
const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
  setPasswordError(null);
  setIsChangingPassword(true);
  const result = await dispatch(changePassword(data));
  setIsChangingPassword(false);
  if (changePassword.fulfilled.match(result)) {
    setShowPasswordModal(false);
  } else {
    setPasswordError(result.payload as string);
  }
};

// Render the modal (after EditProfileModal):
<ChangePasswordModal
  isOpen={showPasswordModal}
  onClose={() => { setShowPasswordModal(false); setPasswordError(null); }}
  onSubmit={handleChangePassword}
  isSubmitting={isChangingPassword}
  error={passwordError}
/>
```

---

### Backend endpoint needed:
`PUT /auth/change-password` — accepts `{ currentPassword, newPassword }`, verifies current password, updates to new password.

> Tell me when ready and I'll add the next task!
