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

## Current Task: Step 16 — Followers/Following List Modal

### Already done for you (UI):
- `src/components/FollowListModal.tsx` — modal that shows a scrollable list of users (avatar, username, fullName) with links to their profiles

### What you need to do (logic):

#### 1. Add a `fetchFollowList` thunk to `src/features/profile/profileSlice.ts`:

Add this new interface at the top (below the existing interfaces):
```ts
export interface FollowListUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}
```

Add these new fields to `ProfileState`:
```ts
interface ProfileState {
  profile: ProfileUser | null;
  posts: ProfilePost[];
  isLoading: boolean;
  error: string | null;
  followList: FollowListUser[];       // ← add
  followListLoading: boolean;          // ← add
}
```

Update `initialState` to include:
```ts
followList: [],
followListLoading: false,
```

Add this new thunk (below the existing thunks):
```ts
// Fetch followers or following list
export const fetchFollowList = createAsyncThunk(
  'profile/fetchFollowList',
  async ({ username, type }: { username: string; type: 'followers' | 'following' }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${username}/${type}`);
      return res.data; // expects { users: FollowListUser[] }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch list');
    }
  }
);
```

Add a `clearFollowList` reducer inside `reducers: {}`:
```ts
reducers: {
  clearProfile(state) {
    state.profile = null;
    state.posts = [];
  },
  clearFollowList(state) {
    state.followList = [];
  },
},
```

Add extra reducers for `fetchFollowList` (inside `extraReducers`):
```ts
builder.addCase(fetchFollowList.pending, (state) => {
  state.followListLoading = true;
});
builder.addCase(
  fetchFollowList.fulfilled,
  (state, action: PayloadAction<{ users: FollowListUser[] }>) => {
    state.followListLoading = false;
    state.followList = action.payload.users;
  }
);
builder.addCase(fetchFollowList.rejected, (state) => {
  state.followListLoading = false;
});
```

Don't forget to export `clearFollowList`:
```ts
export const { clearProfile, clearFollowList } = profileSlice.actions;
```

#### 2. Wire up the modal in `src/pages/ProfilePage.tsx`:

Add these imports at the top:
```tsx
import { FollowListModal } from '../components/FollowListModal';
import { fetchFollowList, clearFollowList } from '../features/profile/profileSlice';
```

Add this state (next to existing useState calls):
```tsx
const [followModalType, setFollowModalType] = useState<'Followers' | 'Following' | null>(null);
```

Add this selector (next to existing useAppSelector calls):
```tsx
const { followList, followListLoading } = useAppSelector((state) => state.profile);
```

Add this handler function (next to existing handlers):
```tsx
const handleOpenFollowList = (type: 'Followers' | 'Following') => {
  if (!username) return;
  setFollowModalType(type);
  dispatch(fetchFollowList({ username, type: type.toLowerCase() as 'followers' | 'following' }));
};

const handleCloseFollowList = () => {
  setFollowModalType(null);
  dispatch(clearFollowList());
};
```

Now make the follower/following counts **clickable**. Replace the stats section (the `{/* Stats */}` block) with:
```tsx
{/* Stats */}
<div className="mt-3 flex gap-6">
  <div className="text-sm">
    <span className="font-semibold text-gray-900">{posts.length}</span>{' '}
    <span className="text-gray-500">posts</span>
  </div>
  <button onClick={() => handleOpenFollowList('Followers')} className="text-sm hover:underline">
    <span className="font-semibold text-gray-900">{profile.followers?.length ?? 0}</span>{' '}
    <span className="text-gray-500">followers</span>
  </button>
  <button onClick={() => handleOpenFollowList('Following')} className="text-sm hover:underline">
    <span className="font-semibold text-gray-900">{profile.following?.length ?? 0}</span>{' '}
    <span className="text-gray-500">following</span>
  </button>
</div>
```

Finally, add the modal **just before** the closing `</main>` tag (after `EditProfileModal`):
```tsx
<FollowListModal
  isOpen={followModalType !== null}
  onClose={handleCloseFollowList}
  title={followModalType ?? 'Followers'}
  users={followList}
  isLoading={followListLoading}
/>
```

### What this does:
- **fetchFollowList** — fetches user list from `GET /users/:username/followers` or `GET /users/:username/following`
- **FollowListModal** — scrollable modal showing avatar, username, and full name for each user, with links to their profiles
- **ProfilePage** — followers/following counts are now clickable buttons that open the modal

### How to verify:
- No TypeScript errors
- Go to any profile page
- Click on "followers" count → modal opens with list of followers
- Click on "following" count → modal opens with list of following
- Click a user in the list → navigates to their profile
- Close modal → list clears

### Done when:
- [ ] `src/features/profile/profileSlice.ts` updated with `fetchFollowList` thunk, `clearFollowList` reducer, and new state fields
- [ ] `src/pages/ProfilePage.tsx` updated with clickable stats and `FollowListModal` wired up
- [ ] No TypeScript errors

---

> Tell me when done and I'll add the next task!
