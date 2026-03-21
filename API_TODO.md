# SnapSphere — Backend API Reference

All endpoints the frontend expects. Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:8000/api/v1`)

---

## Auth

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| POST | `/auth/register` | `{ username, email, password, fullName }` | `{ token, user }` | Create account |
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` | Login |
| GET | `/auth/me` | — | `{ id, username, email, fullName, avatar }` | Get current user (requires token) |
| POST | `/auth/refresh` | — | `{ accessToken }` | Refresh JWT (uses cookie) |
| PUT | `/auth/change-password` | `{ currentPassword, newPassword }` | `{ message }` | Change password |
| POST | `/auth/forgot-password` | `{ email }` | `{ message }` | Send reset email |
| DELETE | `/auth/account` | `{ password }` | `{ message }` | Delete account permanently |

**User object:**
```json
{ "id", "username", "email", "fullName", "avatar" }
```

---

## Posts

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/posts/feed?page=1&limit=10` | — | `{ posts: Post[], hasMore: boolean }` | Paginated feed |
| GET | `/posts/explore` | — | `[{ id, image, likes }]` | Discover posts (not following) |
| GET | `/posts/saved` | — | `{ posts: Post[], savedPostIds: string[] }` | User's bookmarked posts |
| GET | `/posts/:postId` | — | `Post` | Single post with comments |
| POST | `/posts` | `FormData: { image, caption }` | `Post` | Create post (multipart) |
| PUT | `/posts/:postId` | `{ caption }` | `Post` | Edit post caption |
| DELETE | `/posts/:postId` | — | `{ message }` | Delete post (owner only) |
| PUT | `/posts/:postId/like` | — | `{ postId, likes: string[] }` | Toggle like |
| GET | `/posts/:postId/likes` | — | `[{ id, username, fullName, avatar }]` | Users who liked |
| POST | `/posts/:postId/comment` | `{ text }` | `{ postId, comment: Comment }` | Add comment |
| PUT | `/posts/:postId/comment/:commentId` | `{ text }` | `{ text }` | Edit comment (owner only) |
| DELETE | `/posts/:postId/comment/:commentId` | — | `{ message }` | Delete comment (owner only) |
| PUT | `/posts/:postId/save` | — | `{ postId, saved: boolean }` | Toggle bookmark |
| POST | `/posts/:postId/report` | `{ reason }` | `{ message }` | Report post |

**Post object:**
```json
{
  "id": "string",
  "user": { "id", "username", "avatar", "fullName" },
  "image": "url",
  "caption": "string",
  "likes": ["userId", ...],
  "comments": [Comment, ...],
  "createdAt": "ISO date"
}
```

**Comment object:**
```json
{
  "id": "string",
  "user": { "id", "username", "avatar", "fullName" },
  "text": "string",
  "createdAt": "ISO date"
}
```

---

## Users / Profiles

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/users/:username` | — | `{ user: ProfileUser, posts: ProfilePost[] }` | User profile |
| PUT | `/users/me` | `FormData: { fullName, bio, avatar? }` | `{ user: ProfileUser }` | Update own profile |
| PUT | `/users/:userId/follow` | — | `{ message }` | Toggle follow/unfollow |
| GET | `/users/:username/followers` | — | `{ users: [{ id, username, fullName, avatar }] }` | Followers list |
| GET | `/users/:username/following` | — | `{ users: [{ id, username, fullName, avatar }] }` | Following list |
| GET | `/users/search?q=query` | — | `[{ id, username, fullName, avatar }]` | Search users |
| GET | `/users/suggestions` | — | `[{ id, username, fullName, avatar }]` | Suggested users to follow |

**ProfileUser object:**
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "avatar": "url",
  "bio": "string",
  "followers": ["userId", ...],
  "following": ["userId", ...]
}
```

**ProfilePost object:**
```json
{
  "id": "string",
  "image": "url",
  "likes": ["userId", ...],
  "createdAt": "ISO date"
}
```

---

## Notifications

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/notifications` | — | `{ notifications: Notification[], unreadCount: number }` | All notifications |
| PUT | `/notifications/read` | — | `{ message }` | Mark all as read |

**Notification object:**
```json
{
  "id": "string",
  "type": "like" | "comment" | "follow",
  "sender": { "id", "username", "avatar" },
  "postId": "string (optional, for like/comment)",
  "read": false,
  "createdAt": "ISO date"
}
```

---

## Stories

| Method | Endpoint | Body | Response | Notes |
|--------|----------|------|----------|-------|
| GET | `/stories` | — | `StoryGroup[]` | All active stories from followed users |
| POST | `/stories` | `FormData: { image, caption? }` | `StoryGroup` | Add a story (expires in 24h) |

**StoryGroup object:**
```json
{
  "userId": "string",
  "username": "string",
  "avatar": "url",
  "stories": [
    { "id": "string", "image": "url", "caption": "string?", "createdAt": "ISO date" }
  ]
}
```

---

## Summary

| Category | Endpoints |
|----------|-----------|
| Auth | 7 |
| Posts | 14 |
| Users | 7 |
| Notifications | 2 |
| Stories | 2 |
| **Total** | **32 endpoints** |

---

## Tech Stack Suggestions (Backend)

- **Runtime:** Node.js + Express or Fastify
- **Database:** MongoDB (Mongoose) or PostgreSQL (Prisma)
- **Auth:** JWT (access + refresh tokens)
- **File Upload:** Cloudinary or AWS S3
- **Validation:** Zod or Joi
- **Real-time (optional):** Socket.io for notifications

## Database Models Needed

1. **User** — id, username, email, password, fullName, avatar, bio, followers[], following[]
2. **Post** — id, userId, image, caption, likes[], createdAt
3. **Comment** — id, postId, userId, text, createdAt
4. **Notification** — id, recipientId, senderId, type, postId?, read, createdAt
5. **Story** — id, userId, image, caption, createdAt, expiresAt (24h)
6. **SavedPost** — id, userId, postId
7. **Report** — id, reporterId, postId, reason, createdAt
