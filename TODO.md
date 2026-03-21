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
- [ ] Step 25 — Mobile Bottom Navigation Bar

---

## Step 25 — Mobile Bottom Navigation Bar

**What's already done (UI):**
- `src/components/BottomNav.tsx` — Instagram-style bottom navigation bar visible only on mobile (`lg:hidden`). Has 5 tabs: Home, Explore, Create Post (branded button), Notifications (with unread badge), and Profile (with avatar). Active tab is highlighted with brand color. Accepts props: `username`, `avatar`, `onCreatePost`, `unreadCount`.
- `src/components/Navbar.tsx` — Updated to hide duplicate items (explore, notifications, create post, profile) on small screens with `sm:block`/`sm:flex`, keeping only logo, saved, and logout visible on mobile. Max-width widened to `max-w-5xl`.
- `src/pages/HomePage.tsx` — Added `pb-16 lg:pb-0` so content isn't hidden behind the bottom nav.

**Your tasks (Logic):**

### 1. Render `<BottomNav>` in `src/pages/HomePage.tsx`

```tsx
import { BottomNav } from "../components/BottomNav";

// Add right before the closing </div> of the page:
<BottomNav
  username={user?.username ?? ""}
  avatar={user?.avatar}
  onCreatePost={() => setShowCreateModal(true)}
  unreadCount={unreadCount}
/>
```

### 2. (Optional) Add `<BottomNav>` to other pages too

If you want the bottom nav on all pages, you can move it into a shared layout wrapper or add it to each page (Profile, Explore, Notifications, etc.). Add `pb-16 lg:pb-0` to each page's root div.

> Tell me when ready and I'll add the next task!
