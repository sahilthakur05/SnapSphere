# 📸 SnapSphere — Software Requirements Specification (SRS)
### Instagram-Clone Social Media App | React.js Frontend | Version 2.0 | March 2026

---

> **Includes:** Complete API Reference (45 Endpoints) · 18-Step Dev Guide · Full Folder Structure · Milestones

---

## Table of Contents

1. [Introduction & Tech Stack](#1-introduction--tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Pages & Route Architecture](#5-pages--route-architecture)
6. [Complete API List — All 45 Endpoints](#6-complete-api-list--all-45-endpoints)
   - [6.1 Auth APIs (5)](#61-auth-apis--5-endpoints)
   - [6.2 User / Profile APIs (8)](#62-user--profile-apis--8-endpoints)
   - [6.3 Post APIs (10)](#63-post-apis--10-endpoints)
   - [6.4 Comment APIs (5)](#64-comment-apis--5-endpoints)
   - [6.5 Story APIs (6)](#65-story-apis--6-endpoints)
   - [6.6 Explore / Search APIs (4)](#66-explore--search-apis--4-endpoints)
   - [6.7 Notification APIs (3)](#67-notification-apis--3-endpoints)
   - [6.8 Message / DM APIs (4)](#68-message--dm-apis--4-endpoints)
   - [6.9 WebSocket Events](#69-websocket-events)
7. [Step-by-Step Development Guide (18 Steps)](#7-step-by-step-development-guide)
8. [Component Design Guidelines](#8-component-design-guidelines)
9. [Development Milestones & Timeline](#9-development-milestones--timeline)
10. [Pre-Launch Checklist](#10-pre-launch-checklist)

---

## 1. Introduction & Tech Stack

### 1.1 What We Are Building

SnapSphere is a full-featured photo & video sharing social media platform — similar to Instagram. Users can post content, follow each other, DM in real-time, watch 24h stories, and explore trending content.

This SRS covers:
- All frontend functional & non-functional requirements
- Every API endpoint (45 total) the frontend needs to call
- An 18-step development guide with exact code snippets

---

### 1.2 Technology Stack

| Layer | Tool / Library | Why We Use It |
|---|---|---|
| UI Framework | React 18 | Component model, concurrent features, hooks |
| Language | TypeScript 5 | Type safety, better IDE support, fewer bugs |
| Build Tool | Vite 5 | 10x faster than CRA, instant HMR |
| Routing | React Router v6 | Nested routes, auth guards, lazy loading |
| State Management | Redux Toolkit | Predictable global state + DevTools |
| API Layer | RTK Query | Auto caching, refetch, optimistic updates |
| HTTP Client | Axios | Interceptors for JWT attach & silent refresh |
| Styling | Tailwind CSS v3 | Utility-first, zero unused CSS in production |
| UI Components | shadcn/ui | Accessible, fully customizable components |
| Forms | React Hook Form + Zod | Minimal re-renders + schema validation |
| Real-time | Socket.io-client | WebSocket for DMs and live notifications |
| Image Editing | react-image-crop | In-browser crop before upload |
| Testing | Vitest + RTL | Fast unit + component tests |
| Code Quality | ESLint + Prettier | Consistent code style enforcement |

---

## 2. Folder Structure

> **Architecture Pattern: Feature-Sliced Design (FSD)** — used at Meta, Airbnb, Spotify.
> Each feature owns its own state, API, and components. Nothing is a "God file".

### Key Rules
- `pages/` → **Thin.** Only COMPOSE features — no business logic here.
- `features/` → **Fat.** Own state + API + UI components for one domain.
- `components/common/` → **Dumb UI.** No Redux, no API calls — props only.
- `hooks/` → **Reusable stateful logic.** No JSX inside hooks.

```
snapsphere/
├── public/
│   └── assets/icons/                   ← Static SVG icons
│
├── src/
│   ├── app/                            ← Redux store setup
│   │   ├── store.ts                    ← Combine all reducers here
│   │   ├── rootReducer.ts
│   │   └── hooks.ts                    ← useAppDispatch / useAppSelector
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/                     ← Reusable dumb UI (zero business logic)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts            ← export { Button } from './Button'
│   │   │   ├── Avatar/
│   │   │   ├── Modal/
│   │   │   ├── Loader/
│   │   │   ├── Skeleton/
│   │   │   ├── Input/
│   │   │   ├── Textarea/
│   │   │   ├── Dropdown/
│   │   │   ├── Toast/
│   │   │   └── index.ts                ← Barrel: export all common components
│   │   │
│   │   ├── layout/                     ← App shell & navigation
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── MobileNav.tsx       ← Bottom bar on mobile
│   │   │   ├── Sidebar/
│   │   │   ├── RightPanel/             ← Suggested users, trending hashtags
│   │   │   └── AppShell.tsx            ← Navbar + Sidebar + <Outlet> + RightPanel
│   │   │
│   │   └── shared/                     ← Business-aware, used across many features
│   │       ├── PostCard/
│   │       ├── StoryRing/              ← Avatar with gradient ring
│   │       ├── UserCard/
│   │       ├── FollowButton/
│   │       └── HashtagBadge/
│   │
│   ├── features/                       ← Feature-Sliced Design modules
│   │   │
│   │   ├── auth/
│   │   │   ├── authSlice.ts            ← user, token, isAuthenticated state
│   │   │   ├── authApi.ts              ← RTK Query: login, register, refresh
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── OAuthButtons.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── feed/
│   │   │   ├── feedSlice.ts
│   │   │   ├── feedApi.ts              ← GET /posts/feed (infinite scroll)
│   │   │   ├── components/
│   │   │   │   ├── FeedList.tsx        ← Renders list of PostCards
│   │   │   │   ├── StoryBar.tsx        ← Horizontal story ring scroll
│   │   │   │   └── FeedSkeleton.tsx    ← Loading skeleton cards
│   │   │   └── index.ts
│   │   │
│   │   ├── post/
│   │   │   ├── postSlice.ts
│   │   │   ├── postApi.ts
│   │   │   ├── components/
│   │   │   │   ├── PostViewer.tsx      ← Full post with comments
│   │   │   │   ├── PostActions.tsx     ← Like / Comment / Save / Share
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   ├── CreatePostModal.tsx ← Upload + crop + caption flow
│   │   │   │   └── ImageCropper.tsx    ← react-image-crop wrapper
│   │   │   └── index.ts
│   │   │
│   │   ├── profile/
│   │   │   ├── profileSlice.ts
│   │   │   ├── profileApi.ts
│   │   │   ├── components/
│   │   │   │   ├── ProfileHeader.tsx   ← Avatar + bio + counts + follow button
│   │   │   │   ├── ProfileGrid.tsx     ← 3-column post thumbnails
│   │   │   │   ├── FollowersList.tsx
│   │   │   │   └── EditProfileForm.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── explore/
│   │   │   ├── exploreSlice.ts
│   │   │   ├── exploreApi.ts
│   │   │   ├── components/
│   │   │   │   ├── ExploreGrid.tsx     ← Masonry trending posts
│   │   │   │   ├── SearchBar.tsx       ← Debounced live search
│   │   │   │   ├── TrendingHashtags.tsx
│   │   │   │   └── SuggestedUsers.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── messages/
│   │   │   ├── messagesSlice.ts
│   │   │   ├── messagesApi.ts
│   │   │   ├── components/
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── ChatWindow.tsx      ← Infinite scroll UP for older messages
│   │   │   │   ├── MessageBubble.tsx   ← Sent=right+blue / Received=left+grey
│   │   │   │   └── ChatInput.tsx       ← Text + emoji + image attach + send
│   │   │   └── index.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notificationsSlice.ts
│   │   │   ├── notificationsApi.ts
│   │   │   ├── components/
│   │   │   │   ├── NotificationList.tsx
│   │   │   │   └── NotificationItem.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── stories/
│   │       ├── storiesSlice.ts
│   │       ├── storiesApi.ts
│   │       ├── components/
│   │       │   ├── StoryViewer.tsx     ← Fullscreen + progress bars + auto-advance
│   │       │   └── CreateStory.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                          ← Global reusable custom hooks
│   │   ├── useAuth.ts                  ← Returns { user, isLoggedIn, logout }
│   │   ├── useInfiniteScroll.ts        ← IntersectionObserver + auto-fetch next page
│   │   ├── useDebounce.ts              ← Debounce a value (for search input)
│   │   ├── useMediaQuery.ts            ← Responsive breakpoint detection
│   │   ├── useLocalStorage.ts
│   │   └── useClickOutside.ts          ← Close modal when clicking outside
│   │
│   ├── lib/
│   │   ├── axios.ts                    ← Axios instance + JWT interceptors
│   │   └── socket.ts                   ← Socket.io client setup
│   │
│   ├── pages/                          ← Route-level thin page components
│   │   ├── HomePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── PostDetailPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx               ← All <Route> definitions
│   │   ├── PrivateRoute.tsx            ← Redirect to /login if not authenticated
│   │   └── PublicRoute.tsx             ← Redirect to / if already authenticated
│   │
│   ├── types/                          ← Shared TypeScript interfaces
│   │   ├── auth.types.ts
│   │   ├── post.types.ts
│   │   ├── user.types.ts
│   │   ├── comment.types.ts
│   │   ├── story.types.ts
│   │   └── api.types.ts                ← ApiResponse<T>, PaginatedResponse<T>
│   │
│   ├── utils/                          ← Pure helper functions (no side effects)
│   │   ├── formatDate.ts               ← "2 hours ago", "Jan 12"
│   │   ├── formatNumber.ts             ← 1200 → "1.2K"
│   │   ├── validateFile.ts             ← Check file type + size before upload
│   │   ├── cn.ts                       ← clsx + tailwind-merge helper
│   │   └── constants.ts                ← API_URL, MAX_FILE_SIZE, SUPPORTED_FORMATS
│   │
│   ├── styles/
│   │   ├── globals.css                 ← @tailwind directives + CSS custom properties
│   │   └── animations.css              ← Story ring gradient, skeleton pulse keyframes
│   │
│   ├── App.tsx                         ← Root: wraps Router + Redux Provider + Toasts
│   ├── main.tsx                        ← ReactDOM.createRoot entry point
│   └── vite-env.d.ts
│
├── .env.local                          ← Your secrets (NEVER commit this!)
├── .env.example                        ← Template for teammates
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Functional Requirements

### 3.1 Authentication

| ID | Priority | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-AUTH-01 | HIGH | Email/password registration | User created, JWT returned, redirect to feed |
| FR-AUTH-02 | HIGH | Email/password login | Tokens stored in httpOnly cookie |
| FR-AUTH-03 | HIGH | Google OAuth login | One-click sign-in with Google account |
| FR-AUTH-04 | HIGH | JWT refresh token | Silent refresh before expiry — user never sees logout |
| FR-AUTH-05 | MED | Forgot password flow | Email OTP → reset form → success redirect |
| FR-AUTH-06 | MED | Username availability check | Real-time debounced check while typing |
| FR-AUTH-07 | LOW | Two-factor authentication | TOTP via authenticator app |

### 3.2 Posts & Feed

| ID | Priority | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-POST-01 | HIGH | Create post with image/video | Drag-drop or file picker, preview before upload |
| FR-POST-02 | HIGH | Caption + hashtags | Auto-suggest hashtags while typing |
| FR-POST-03 | HIGH | Like / unlike a post | Optimistic UI update, count synced with server |
| FR-POST-04 | HIGH | Comment on a post | Nested replies, @mention support |
| FR-POST-05 | HIGH | Infinite scroll feed | Auto-loads next page at scroll bottom |
| FR-POST-06 | MED | Image crop & filter | Crop to square/portrait/landscape + filters |
| FR-POST-07 | MED | Save / bookmark post | Saved posts appear in profile Saved tab |
| FR-POST-08 | MED | Tag people in post | Search users while composing, tags link to profiles |
| FR-POST-09 | MED | Delete / archive post | Archived hidden from feed but accessible |
| FR-POST-10 | LOW | Post insights | Views, reach, impressions per post |

### 3.3 Profile

| ID | Priority | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-PROF-01 | HIGH | View user profile | Avatar, bio, follower counts, post grid |
| FR-PROF-02 | HIGH | Edit own profile | Name, bio, avatar, website, pronouns |
| FR-PROF-03 | HIGH | Follow / unfollow user | Button toggles, count updates instantly |
| FR-PROF-04 | MED | Private account mode | Follow request required to see posts |
| FR-PROF-05 | MED | Block / restrict user | Blocked users can't see content or DM |
| FR-PROF-06 | LOW | Profile highlights | Pin story highlights to profile |

### 3.4 Stories

| ID | Priority | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-STORY-01 | HIGH | Create image/video story | Full-screen, expires in 24 hours |
| FR-STORY-02 | HIGH | View stories from followed users | Tap avatar ring to open story viewer |
| FR-STORY-03 | HIGH | Story progress bar | Auto-advances every 5s, tap to skip |
| FR-STORY-04 | MED | Text & sticker overlay | Text, emoji stickers, GIFs on story |
| FR-STORY-05 | MED | Story reactions | Quick emoji react while viewing |
| FR-STORY-06 | LOW | Poll / question sticker | Interactive sticker with results view |

### 3.5 Messages (DMs)

| ID | Priority | Requirement | Acceptance Criteria |
|---|---|---|---|
| FR-MSG-01 | HIGH | Send/receive text messages | Real-time via WebSocket, <100ms latency |
| FR-MSG-02 | HIGH | Read receipts | Seen indicator after recipient opens chat |
| FR-MSG-03 | HIGH | Conversation list | Sorted by latest message, unread badge |
| FR-MSG-04 | MED | Send images/video in DMs | Media preview with download option |
| FR-MSG-05 | MED | Typing indicator | Animated dots when other user types |
| FR-MSG-06 | LOW | Delete message for everyone | Replaced with "This message was deleted" |

---

## 4. Non-Functional Requirements

| Category | Metric | Target |
|---|---|---|
| Performance | First Contentful Paint | < 1.5s on 4G |
| Performance | Main bundle size | < 200KB gzipped |
| Performance | Feed scroll | 60fps — no jank |
| Accessibility | WCAG Standard | 2.1 AA compliance throughout |
| Accessibility | Keyboard Nav | Full tab navigation on all pages |
| Responsiveness | Breakpoints | Mobile 320px / Tablet 768px / Desktop 1280px |
| Security | XSS Prevention | All user content sanitized with DOMPurify |
| Security | Auth Tokens | httpOnly cookie only — never localStorage |
| Security | Env Variables | Never exposed in frontend bundle |
| UX | Optimistic UI | All like/follow mutations update instantly |
| UX | Skeleton Loading | Skeleton screens on all loading states |
| SEO | Meta Tags | Open Graph + Twitter Card on post pages |
| Testing | Coverage | Minimum 80% unit test coverage |

---

## 5. Pages & Route Architecture

| Route Path | Auth Required | Page Component | Description |
|---|---|---|---|
| `/` | Yes | `HomePage.tsx` | Feed with stories bar at top |
| `/explore` | Yes | `ExplorePage.tsx` | Trending posts + search |
| `/p/:postId` | Yes | `PostDetailPage.tsx` | Full post view with comments |
| `/:username` | Yes | `ProfilePage.tsx` | User profile + post grid |
| `/stories/:userId` | Yes | `StoriesPage.tsx` | Fullscreen story viewer |
| `/messages` | Yes | `MessagesPage.tsx` | DM conversation list |
| `/messages/:userId` | Yes | `MessagesPage.tsx` | Active chat window |
| `/notifications` | Yes | `NotificationsPage.tsx` | All activity notifications |
| `/settings` | Yes | `SettingsPage.tsx` | Account, privacy, security tabs |
| `/login` | No (public) | `LoginPage.tsx` | Login form — redirects if already authed |
| `/register` | No (public) | `RegisterPage.tsx` | Registration form |
| `/forgot-password` | No (public) | `ForgotPasswordPage.tsx` | Password reset flow |
| `*` | No | `NotFoundPage.tsx` | 404 error page |

---

## 6. Complete API List — All 45 Endpoints

> **Base URL:** `https://api.snapsphere.com/v1`
> **Auth Header:** `Authorization: Bearer <accessToken>`
> **All responses:** `{ success: boolean, data: T, message: string }`
> **Pagination:** cursor-based `?cursor=lastId&limit=10` for feeds | page-based `?page=1&limit=20` for lists

---

### 6.1 Auth APIs — 5 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `POST` | `/auth/register` | Create new account with email + username + password. Returns user object + access token. | No |
| `POST` | `/auth/login` | Login with email + password. Returns JWT access token + sets refresh token in httpOnly cookie. | No |
| `POST` | `/auth/logout` | Invalidate refresh token on server. Clears the httpOnly cookie. | Yes |
| `POST` | `/auth/refresh` | Exchange refresh token cookie for a new access token. Called silently before expiry. | No |
| `POST` | `/auth/forgot-password` | Send OTP/reset link to user's email. Follow up: `PATCH /auth/reset-password`. | No |

---

### 6.2 User / Profile APIs — 8 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/users/me` | Get the currently logged-in user's full profile data. | Yes |
| `PATCH` | `/users/me` | Update own profile: name, bio, website, avatar (multipart), pronouns. | Yes |
| `GET` | `/users/:username` | Get any user's public profile — avatar, bio, follower/post count. | Yes |
| `GET` | `/users/:id/posts` | Paginated post grid for a profile page. `?page=1&limit=12` | Yes |
| `POST` | `/users/:id/follow` | Follow a user. Returns `{ followersCount, isFollowing: true }`. | Yes |
| `DELETE` | `/users/:id/follow` | Unfollow a user. Returns `{ followersCount, isFollowing: false }`. | Yes |
| `GET` | `/users/:id/followers` | List of users who follow this user. Paginated. `?page=1&limit=20` | Yes |
| `GET` | `/users/:id/following` | List of users this user follows. Paginated. | Yes |

---

### 6.3 Post APIs — 10 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/posts/feed` | Feed of posts from followed users. Cursor-based pagination. `?cursor=lastId&limit=10` | Yes |
| `POST` | `/posts` | Create new post. Body: `FormData` with image/video + caption + `hashtags[]` + `taggedUsers[]`. | Yes |
| `GET` | `/posts/:id` | Get a single post with like count, comment count, `isLiked`, `isSaved` for current user. | Yes |
| `PATCH` | `/posts/:id` | Edit post caption or tags. Only the post owner can call this. | Yes |
| `DELETE` | `/posts/:id` | Delete a post and its media from CDN. Owner only. | Yes |
| `POST` | `/posts/:id/like` | Like a post. Idempotent. Returns `{ likesCount, isLiked: true }`. | Yes |
| `DELETE` | `/posts/:id/like` | Unlike a post. Returns `{ likesCount, isLiked: false }`. | Yes |
| `POST` | `/posts/:id/save` | Bookmark a post. Returns `{ isSaved: true }`. | Yes |
| `DELETE` | `/posts/:id/save` | Remove bookmark. Returns `{ isSaved: false }`. | Yes |
| `GET` | `/posts/saved` | Get all posts bookmarked by the current user. Paginated. | Yes |

---

### 6.4 Comment APIs — 5 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/posts/:id/comments` | Get comments for a post. Paginated, newest first. `?page=1&limit=20` | Yes |
| `POST` | `/posts/:id/comments` | Add a comment. Body: `{ text, parentId? }` — `parentId` makes it a reply. | Yes |
| `DELETE` | `/comments/:commentId` | Delete a comment. Author or post owner only. | Yes |
| `POST` | `/comments/:commentId/like` | Like a comment. Returns `{ likesCount }`. | Yes |
| `DELETE` | `/comments/:commentId/like` | Unlike a comment. Returns `{ likesCount }`. | Yes |

---

### 6.5 Story APIs — 6 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/stories/feed` | Get active stories (< 24h) from followed users. Grouped by user. | Yes |
| `POST` | `/stories` | Create story. Body: `FormData` with image/video + optional text overlay. | Yes |
| `DELETE` | `/stories/:id` | Delete own story before 24h expiry. | Yes |
| `POST` | `/stories/:id/view` | Mark story as viewed. Used to show view count to owner. | Yes |
| `GET` | `/stories/:id/viewers` | List of users who viewed a story. Owner-only endpoint. | Yes |
| `POST` | `/stories/:id/react` | React to a story with emoji. Body: `{ emoji }`. Shows in owner's DMs. | Yes |

---

### 6.6 Explore / Search APIs — 4 endpoints

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/explore` | Trending posts grid — algorithm based on engagement in last 48h. Paginated. | Yes |
| `GET` | `/search` | Search users and hashtags. `?q=query&type=users\|hashtags\|all` | Yes |
| `GET` | `/hashtags/:tag/posts` | All posts tagged with a specific hashtag. Paginated. | Yes |
| `GET` | `/users/suggestions` | 5 suggested users to follow based on mutual follows. | Yes |

---

### 6.7 Notification APIs — 3 endpoints

> **Notification types:** `new_follower` | `post_like` | `post_comment` | `comment_like` | `story_react` | `mention`

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/notifications` | Get paginated notification history. Unread count in `X-Unread-Count` header. | Yes |
| `PATCH` | `/notifications/read-all` | Mark all notifications as read. Returns `{ unreadCount: 0 }`. | Yes |
| `PATCH` | `/notifications/:id/read` | Mark a single notification as read. | Yes |

---

### 6.8 Message / DM APIs — 4 endpoints

> Real-time send/receive is via **WebSocket**. REST is used for loading history and as fallback.

| Method | Endpoint | Description | Auth? |
|---|---|---|---|
| `GET` | `/conversations` | All DM conversations sorted by last message. Includes unread count per conversation. | Yes |
| `GET` | `/conversations/:userId` | Message history with a user. Cursor pagination. `?cursor=lastMsgId&limit=30` | Yes |
| `POST` | `/conversations/:userId` | Send message via REST fallback. Body: `{ text?, mediaUrl? }`. | Yes |
| `PATCH` | `/conversations/:userId/read` | Mark all messages in conversation as read. Triggers read receipt. | Yes |

---

### 6.9 WebSocket Events

```
CLIENT  →  SERVER   message:send         { conversationId, text, mediaUrl? }
SERVER  →  CLIENT   message:receive      { message: { id, senderId, text, timestamp } }

CLIENT  →  SERVER   typing:start         { conversationId }
SERVER  →  CLIENT   typing:start         { userId, conversationId }

CLIENT  →  SERVER   typing:stop          { conversationId }
SERVER  →  CLIENT   typing:stop          { userId, conversationId }

SERVER  →  CLIENT   notification:new     { notification object }
SERVER  →  CLIENT   message:read         { conversationId, readBy, readAt }
SERVER  →  CLIENT   user:online          { userId }   ← shows green dot on avatar
```

---

## 7. Step-by-Step Development Guide

> ⚠️ **Follow each step IN ORDER.** Each step builds on the previous one.
> ✅ After each step passes its "Done when" checklist → commit to Git.

---

### Step 1 — Initialize the Project

```bash
npm create vite@latest snapsphere -- --template react-ts
cd snapsphere
npm install
npm run dev

# ✅ You should see:  Local: http://localhost:5173/
# Delete src/App.css and clear src/App.tsx to a blank <div>
```

---

### Step 2 — Install All Dependencies

**Core dependencies:**
```bash
npm install react-router-dom @reduxjs/toolkit react-redux
npm install axios react-hook-form @hookform/resolvers zod
npm install socket.io-client react-intersection-observer
npm install react-image-crop clsx tailwind-merge lucide-react date-fns dompurify
```

**Styling & UI:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize shadcn/ui
npx shadcn-ui@latest init
# Follow prompts: TypeScript=Yes | Style=Default | BaseColor=Slate | CSS vars=Yes
```

**Dev dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D @types/node @types/dompurify
npm install -D eslint prettier eslint-config-prettier
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh
```

---

### Step 3 — Configure Tailwind CSS

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#1a73e8',
          600: '#1558c0',
          900: '#1e3a8a',
        }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: [],
} satisfies Config
```

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Step 4 — Set Up Environment Variables

```bash
# .env.local  — your actual secrets (add this to .gitignore!)
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-name
VITE_MAX_FILE_SIZE_MB=10
```

```bash
# .env.example  — commit this so teammates know what to fill in
VITE_API_BASE_URL=
VITE_SOCKET_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_MAX_FILE_SIZE_MB=10
```

---

### Step 5 — Configure Axios with JWT Interceptors

**File:** `src/lib/axios.ts`

**APIs used:** `POST /auth/refresh`

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,  // sends httpOnly cookie (refresh token)
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: silently refresh token and retry the original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const { data } = await axios.post('/auth/refresh', {}, { withCredentials: true });
      localStorage.setItem('accessToken', data.accessToken);
      return api(error.config);  // retry original request
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Step 6 — Configure Redux Store

**File:** `src/app/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer   from '../store/slices/uiSlice';
// Add more feature reducers as you build them

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui:   uiReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// src/app/hooks.ts  — typed hooks for use across the entire app
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

---

### Step 7 — Configure React Router

**File:** `src/routes/AppRoutes.tsx`

```tsx
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AppShell } from '../components/layout/AppShell';
// import all page components...

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path='/login'            element={<LoginPage />} />
      <Route path='/register'         element={<RegisterPage />} />
      <Route path='/forgot-password'  element={<ForgotPasswordPage />} />

      {/* Private routes — wrapped in AppShell (Navbar + Sidebar) */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppShell />}>
          <Route path='/'                 element={<HomePage />} />
          <Route path='/explore'          element={<ExplorePage />} />
          <Route path='/:username'        element={<ProfilePage />} />
          <Route path='/p/:postId'        element={<PostDetailPage />} />
          <Route path='/messages'         element={<MessagesPage />} />
          <Route path='/messages/:userId' element={<MessagesPage />} />
          <Route path='/notifications'    element={<NotificationsPage />} />
          <Route path='/settings'         element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}
```

---

### Step 8 — Build Auth Pages: Login & Register

**APIs needed:** `POST /auth/register` | `POST /auth/login` | `POST /auth/refresh`

**What to build:**
- `LoginForm.tsx` — React Hook Form + Zod validation
- `RegisterForm.tsx` — with real-time username availability check
- `OAuthButtons.tsx` — Google OAuth button
- `authSlice.ts` — stores `user`, `accessToken`, `isAuthenticated`
- On success: store token in Redux → redirect to `/`
- On error: show toast with error message

**✅ Done when:**
- [ ] User can register and is redirected to the feed
- [ ] User can log in — wrong password shows a clear error
- [ ] Visiting `/explore` without login redirects to `/login`
- [ ] Refreshing the page keeps the user logged in (refresh token in cookie)

---

### Step 9 — Build App Shell: Navbar + Sidebar

**APIs needed:** None — reads auth state from Redux

**What to build:**
- `Navbar.tsx` — Logo | Search bar | Create icon | Bell | Avatar dropdown
- `Sidebar.tsx` — Home | Explore | Messages | Notifications | Profile | Settings
- `MobileNav.tsx` — Bottom bar icons (no labels) on screens < 768px
- `AppShell.tsx` — wraps all private pages: `<Navbar /> + <Sidebar /> + <Outlet /> + <RightPanel />`

**✅ Done when:**
- [ ] Layout looks correct on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Active route is highlighted in the Sidebar
- [ ] Avatar dropdown shows Profile / Settings / Logout

---

### Step 10 — Build Home Feed

**APIs needed:**
- `GET /posts/feed` — paginated feed
- `POST /posts/:id/like` & `DELETE /posts/:id/like`
- `POST /posts/:id/save` & `DELETE /posts/:id/save`
- `GET /stories/feed` — for the story bar

**What to build:**
- `FeedList.tsx` — renders list of `PostCard` components
- `PostCard.tsx` — avatar + username | media | like/comment/save/share | caption | comment preview
- `StoryBar.tsx` — horizontal scroll of `StoryRing` avatars
- `FeedSkeleton.tsx` — skeleton cards while data loads
- Infinite scroll using `useInfiniteScroll` hook (IntersectionObserver)

**✅ Done when:**
- [ ] Feed loads and shows posts with images
- [ ] Tapping heart likes/unlikes instantly (optimistic update — no spinner)
- [ ] New posts load automatically when user scrolls to the bottom
- [ ] Story rings appear at the top — tapping one opens the story viewer

---

### Step 11 — Build Profile Page

**APIs needed:**
- `GET /users/:username`
- `GET /users/:id/posts`
- `POST /users/:id/follow` & `DELETE /users/:id/follow`
- `GET /users/:id/followers` & `GET /users/:id/following`

**What to build:**
- `ProfileHeader.tsx` — avatar, name, bio, website, post/follower/following counts, Follow button
- `ProfileGrid.tsx` — 3-column post thumbnails (clicking opens PostDetailPage)
- Tabs: **Posts | Reels | Saved** (Saved only on own profile)
- `EditProfileForm.tsx` — modal shown when user clicks "Edit Profile"

**✅ Done when:**
- [ ] Visiting `/@username` shows that user's profile
- [ ] Follow / Unfollow button works and counter updates immediately
- [ ] Own profile shows "Edit Profile" button
- [ ] Clicking a post thumbnail navigates to `/p/:postId`

---

### Step 12 — Build Create Post Modal

**APIs needed:** `POST /posts` (multipart FormData)

**What to build:**
- Triggered by `+` icon in Navbar or Sidebar
- **Step 1:** File picker / drag-drop area — accept `jpg`, `png`, `mp4`, `mov` only
- **Step 2:** `ImageCropper.tsx` — crop to square / 4:5 / 16:9 using `react-image-crop`
- **Step 3:** Caption textarea with hashtag auto-suggest + @mention support
- **Step 4:** Upload with progress bar → success toast → feed refetch

```ts
// src/utils/validateFile.ts
export function validateFile(file: File): string | null {
  const ALLOWED = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'];
  const MAX_MB = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 10;
  if (!ALLOWED.includes(file.type)) return 'File type not supported';
  if (file.size > MAX_MB * 1024 * 1024) return `File must be under ${MAX_MB}MB`;
  return null;
}
```

**✅ Done when:**
- [ ] Can drag & drop or pick a file — wrong format shows a clear error
- [ ] Crop tool appears and works
- [ ] After posting, the new post appears at the top of the feed
- [ ] Files over 10MB show an error before attempting upload

---

### Step 13 — Build Stories

**APIs needed:**
- `GET /stories/feed`
- `POST /stories` | `DELETE /stories/:id`
- `POST /stories/:id/view`
- `GET /stories/:id/viewers`
- `POST /stories/:id/react`

**What to build:**
- `StoryViewer.tsx` — fullscreen overlay with progress bars at top
  - Auto-advance every 5 seconds
  - Tap left half = previous | Tap right half = next | Swipe down = close
  - Show viewer count + viewer list for own stories
- `CreateStory.tsx` — similar to post create: pick media, add text overlay, post
- `StoryRing.tsx` — gradient border = unseen stories | grey ring = all seen

**✅ Done when:**
- [ ] Tapping a story ring opens the fullscreen viewer
- [ ] Progress bar advances automatically and moves to the next story
- [ ] Viewed story rings show grey, unviewed show gradient
- [ ] Can create a story — it appears in the story bar

---

### Step 14 — Build Explore Page

**APIs needed:**
- `GET /explore`
- `GET /search`
- `GET /users/suggestions`
- `GET /hashtags/:tag/posts`

**What to build:**
- `SearchBar.tsx` — debounced input (300ms) calling `GET /search` as user types → live dropdown
- `ExploreGrid.tsx` — masonry-style trending posts (hover shows like count)
- `SuggestedUsers.tsx` — shown in right panel on desktop, 5 accounts with Follow buttons
- `TrendingHashtags.tsx` — top 10 hashtags with post counts this week

**✅ Done when:**
- [ ] Typing in search shows live user/hashtag suggestions in dropdown
- [ ] Trending posts grid loads and clicking a post opens post detail
- [ ] Following a suggested user immediately updates button to "Following"

---

### Step 15 — Build Notifications

**APIs needed:**
- `GET /notifications`
- `PATCH /notifications/read-all`
- `PATCH /notifications/:id/read`
- **WebSocket:** listen for `notification:new` event

**What to build:**
- `NotificationItem.tsx` — avatar + action text + timestamp + post thumbnail
- Notification types: `new_follower` | `post_like` | `post_comment` | `comment_like` | `story_react` | `mention`
- Red badge on bell icon in Navbar — updates in real-time via WebSocket
- "Mark all as read" button clears the badge

**✅ Done when:**
- [ ] Notification list shows correct action descriptions
- [ ] New notification arrives in real time without page refresh
- [ ] Red badge on bell shows unread count
- [ ] "Mark all read" clears the badge

---

### Step 16 — Build Messages / DMs

**APIs needed:**
- `GET /conversations`
- `GET /conversations/:userId`
- `POST /conversations/:userId`
- `PATCH /conversations/:userId/read`
- **WebSocket:** `message:send` | `message:receive` | `typing:start` | `typing:stop` | `message:read`

**What to build:**
- `ConversationList.tsx` — sorted by last message, unread count badge per conversation
- `ChatWindow.tsx` — message history, infinite scroll UP to load older messages
- `MessageBubble.tsx` — sent = right + blue | received = left + grey | timestamp + read receipt
- `ChatInput.tsx` — text input + emoji picker + image attach + send button
- `TypingIndicator.tsx` — animated 3-dot pulse when other user is typing

**✅ Done when:**
- [ ] Can open a conversation and see message history
- [ ] Sending a message appears instantly (optimistic update)
- [ ] Receiving a message appears in real time via WebSocket
- [ ] Typing indicator shows animated dots when other user types
- [ ] Unread badge in ConversationList updates automatically

---

### Step 17 — Write Tests

```bash
npx vitest              # Interactive test runner (watches for changes)
npx vitest run          # Run all tests once
npx vitest run --coverage   # Generate coverage report (target: 80%+)
```

**What to test:**

| Type | Files to Test |
|---|---|
| Unit tests | `formatDate`, `formatNumber`, `validateFile`, `cn` |
| Component tests | `Button`, `Avatar`, `PostCard`, `LoginForm`, `FollowButton` |
| Integration tests | Login flow: fill form → submit → redirect to feed |
| Integration tests | Create post: file pick → crop → submit → feed update |

---

### Step 18 — Performance Tuning & Launch Prep

```bash
# 1. Run Lighthouse audit (DevTools → Lighthouse)
#    Target: Performance > 90 | Accessibility > 90

# 2. Analyze bundle size
npm run build
npx vite-bundle-visualizer

# 3. Code-split all route pages
# const HomePage = React.lazy(() => import('./pages/HomePage'));
# Wrap Routes in: <Suspense fallback={<PageSkeleton />}>

# 4. Verify all images have lazy loading
# <img loading="lazy" alt="descriptive text" />

# 5. Check TypeScript errors — must return 0
npx tsc --noEmit

# 6. Check for stray console.logs — should return nothing
grep -r 'console.log' src/

# 7. Run accessibility audit
npx axe-cli http://localhost:5173
```

---

## 8. Component Design Guidelines

### 8.1 Standard Component Template

Every component file follows this exact structure:

```tsx
// 1. External imports first
import { useState, useCallback } from 'react';

// 2. Internal imports (use @/ alias for src/)
import { Avatar } from '@/components/common/Avatar';
import { useAppSelector } from '@/app/hooks';

// 3. Type imports
import type { Post } from '@/types/post.types';

// 4. Interface at the top of the file
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  className?: string;
}

// 5. Named export — NEVER default export for components
export function PostCard({ post, onLike, className }: PostCardProps) {
  // 6. All hooks declared first
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);

  // 7. Event handlers with useCallback
  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);  // optimistic update
    onLike(post.id);
  }, [onLike, post.id]);

  // 8. Early returns for missing/loading data
  if (!post) return null;

  // 9. JSX return — use cn() for conditional classes
  return (
    <div className={cn('rounded-xl border bg-white shadow-sm', className)}>
      {/* ... */}
    </div>
  );
}
```

### 8.2 Naming Conventions

| What | Convention | Example |
|---|---|---|
| Component files | PascalCase | `PostCard.tsx`, `StoryViewer.tsx` |
| Custom hooks | camelCase with `use` prefix | `useInfiniteScroll.ts`, `useAuth.ts` |
| Redux slices | camelCase + `Slice` suffix | `feedSlice.ts`, `authSlice.ts` |
| API files | camelCase + `Api` suffix | `postApi.ts`, `userApi.ts` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE`, `API_TIMEOUT` |
| Event handlers | `handle` prefix | `handleLike`, `handleSubmit` |
| Boolean state | `is/has/can` prefix | `isLoading`, `hasError`, `canEdit` |
| Types & Interfaces | PascalCase | `PostType`, `AuthState`, `ApiResponse<T>` |

---

## 9. Development Milestones & Timeline

| Phase | Name | Steps | Duration |
|---|---|---|---|
| 1 | Foundation | Steps 1–4: Vite, deps, Tailwind, env vars | 2–3 days |
| 2 | Infrastructure | Steps 5–7: Axios, Redux, Router | 2 days |
| 3 | Authentication | Step 8: Login, Register, OAuth, Guards | 3–4 days |
| 4 | App Shell | Step 9: Navbar + Sidebar + Responsive | 2–3 days |
| 5 | Core Feed | Step 10: Feed + PostCard + Infinite Scroll | 5–7 days |
| 6 | Profile | Step 11: Profile + Follow system + Edit | 4–5 days |
| 7 | Create Post | Step 12: Upload + Crop + Caption | 4–5 days |
| 8 | Stories | Step 13: Viewer + Creator + Reactions | 4–5 days |
| 9 | Explore | Step 14: Search + Trending + Suggestions | 3–4 days |
| 10 | Notifications | Step 15: List + Real-time badge | 2–3 days |
| 11 | Messages | Step 16: DM list + Chat + WebSocket | 6–8 days |
| 12 | QA & Launch | Steps 17–18: Tests + Performance + Build | 5–7 days |

> **Estimated Total:**
> - Solo developer: **10–12 weeks**
> - Team of 2: **6–7 weeks**
> - Team of 3–4: **4–5 weeks**

---

## 10. Pre-Launch Checklist

### Code Quality
- [ ] TypeScript strict mode — zero errors (`npx tsc --noEmit`)
- [ ] No `console.log()` left in any source file
- [ ] ESLint passes with 0 warnings
- [ ] No `any` types — all components have proper TypeScript interfaces

### Performance
- [ ] Lighthouse Performance score > 90
- [ ] All route-level pages code-split with `React.lazy()`
- [ ] All images have `loading="lazy"` attribute
- [ ] Main bundle < 200KB gzipped

### Accessibility
- [ ] All images have descriptive `alt` text
- [ ] All icon-only buttons have `aria-label`
- [ ] Tab key navigates all interactive elements
- [ ] Color contrast ratio ≥ 4.5:1 for body text

### Security
- [ ] Auth tokens never in `localStorage` (Redux + httpOnly cookie only)
- [ ] All user-generated HTML sanitized with DOMPurify
- [ ] `.env.local` is listed in `.gitignore`
- [ ] No API keys or secrets hardcoded in source

### Testing
- [ ] `npm test` passes with 0 failures
- [ ] Coverage report shows ≥ 80%
- [ ] Manual test: full flow — register → post → like → DM → logout

---

> 🚀 **Start with Step 1!**
> Build order: **Auth → Shell → Feed → Profile → Create Post → Stories → Explore → Notifications → DMs → Tests → Launch**
> Each step has an "APIs needed" list and a "✅ Done when" checklist. Commit to Git after every step.
