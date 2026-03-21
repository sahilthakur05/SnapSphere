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
- [ ] Step 23 — Suggested Users Sidebar

---

## Step 23 — Suggested Users Sidebar

**What's already done (UI):**
- `src/components/SuggestedUsers.tsx` — Pure UI component showing the current user's info at top, then a "Suggested for you" list with avatar, username, full name, and a **Follow** button for each user. Accepts props: `currentUser`, `users`, `isLoading`, `onFollow`.
- `src/pages/HomePage.tsx` — Layout updated to a two-column design: feed on the left, sticky sidebar on the right (visible on `lg:` screens and up). The sidebar has a `{/* TODO */}` placeholder for you to wire the component.

**Your tasks (Logic):**

### 1. Create `src/features/suggestion/suggestionSlice.ts`

```ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";

interface SuggestedUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface SuggestionState {
  users: SuggestedUser[];
  isLoading: boolean;
}

const initialState: SuggestionState = {
  users: [],
  isLoading: false,
};

export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users/suggestions");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch suggestions");
    }
  }
);

export const followUser = createAsyncThunk(
  "suggestions/follow",
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.put(`/users/${userId}/follow`);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to follow user");
    }
  }
);

const suggestionSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchSuggestions.fulfilled, (state, action: PayloadAction<SuggestedUser[]>) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
    // Remove user from suggestions after following
    builder.addCase(followUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    });
  },
});

export default suggestionSlice.reducer;
```

### 2. Register the slice in `src/app/store.ts`

```ts
import suggestionReducer from "../features/suggestion/suggestionSlice";

// Add to the reducer map:
suggestions: suggestionReducer,
```

### 3. Wire it up in `src/pages/HomePage.tsx`

Replace the `{/* TODO */}` comment in the `<aside>` with:

```ts
import { SuggestedUsers } from "../components/SuggestedUsers";
import { fetchSuggestions, followUser } from "../features/suggestion/suggestionSlice";

// Inside component, add to selectors:
const { users: suggestedUsers, isLoading: suggestionsLoading } = useAppSelector((state) => state.suggestions);

// Add to the useEffect:
dispatch(fetchSuggestions());

// Replace the aside TODO comment:
<SuggestedUsers
  currentUser={{
    username: user?.username ?? "",
    fullName: user?.fullName,
    avatar: user?.avatar,
  }}
  users={suggestedUsers}
  isLoading={suggestionsLoading}
  onFollow={(id) => dispatch(followUser(id))}
/>
```

---

### Backend endpoint needed:
- `GET /users/suggestions` — returns an array of suggested users `[{ id, username, fullName, avatar }]` (users the current user is not yet following).
- `PUT /users/:userId/follow` — toggles follow/unfollow (you may already have this from the profile page).

> Tell me when ready and I'll add the next task!
