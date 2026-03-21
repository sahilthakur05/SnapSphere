import { http, HttpResponse } from "msw";
import { mockUsers, mockPosts, mockNotifications, mockStoryGroups } from "./data";

// Current logged-in user (u1 = sahil)
const CURRENT_USER = mockUsers[0];
const TOKEN = "mock-jwt-token-12345";

// Mutable copies so actions persist during session
let posts = [...mockPosts];
let notifications = [...mockNotifications];
let savedPostIds: string[] = ["p3"];

export const handlers = [
  // ── Auth ──
  http.post("*/api/v1/auth/register", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json({
      token: TOKEN,
      user: { id: "u-new", username: body.username, email: body.email, fullName: body.fullName, avatar: "" },
    });
  }),

  http.post("*/api/v1/auth/login", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    const user = mockUsers.find((u) => u.email === body.email);
    if (!user) return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    return HttpResponse.json({
      token: TOKEN,
      user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName, avatar: user.avatar },
    });
  }),

  http.get("*/api/v1/auth/me", () => {
    return HttpResponse.json({
      id: CURRENT_USER.id,
      username: CURRENT_USER.username,
      email: CURRENT_USER.email,
      fullName: CURRENT_USER.fullName,
      avatar: CURRENT_USER.avatar,
    });
  }),

  http.post("*/api/v1/auth/forgot-password", () => {
    return HttpResponse.json({ message: "Reset email sent" });
  }),

  http.put("*/api/v1/auth/change-password", () => {
    return HttpResponse.json({ message: "Password changed" });
  }),

  http.delete("*/api/v1/auth/account", () => {
    return HttpResponse.json({ message: "Account deleted" });
  }),

  // ── Posts Feed ──
  http.get("*/api/v1/posts/feed", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const start = (page - 1) * limit;
    const paged = posts.slice(start, start + limit);
    return HttpResponse.json({ posts: paged, hasMore: start + limit < posts.length });
  }),

  // ── Explore Posts (must be before :postId) ──
  http.get("*/api/v1/posts/explore", () => {
    const explorePosts = posts.map((p) => ({ id: p.id, image: p.image, likes: p.likes }));
    return HttpResponse.json(explorePosts);
  }),

  // ── Saved Posts (must be before :postId) ──
  http.get("*/api/v1/posts/saved", () => {
    const saved = posts.filter((p) => savedPostIds.includes(p.id));
    return HttpResponse.json({ posts: saved, savedPostIds });
  }),

  // ── Single Post ──
  http.get("*/api/v1/posts/:postId", ({ params }) => {
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json({ message: "Post not found" }, { status: 404 });
    return HttpResponse.json(post);
  }),

  // ── Create Post ──
  http.post("*/api/v1/posts", () => {
    const newPost = {
      id: `p${Date.now()}`,
      user: { id: CURRENT_USER.id, username: CURRENT_USER.username, avatar: CURRENT_USER.avatar, fullName: CURRENT_USER.fullName },
      image: `https://picsum.photos/seed/${Date.now()}/600/600`,
      caption: "New post!",
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return HttpResponse.json(newPost);
  }),

  // ── Edit Post ──
  http.put("*/api/v1/posts/:postId", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, string>;
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    post.caption = body.caption;
    return HttpResponse.json(post);
  }),

  // ── Delete Post ──
  http.delete("*/api/v1/posts/:postId", ({ params }) => {
    posts = posts.filter((p) => p.id !== params.postId);
    return HttpResponse.json({ message: "Deleted" });
  }),

  // ── Like/Unlike ──
  http.put("*/api/v1/posts/:postId/like", ({ params }) => {
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const idx = post.likes.indexOf(CURRENT_USER.id);
    if (idx === -1) post.likes.push(CURRENT_USER.id);
    else post.likes.splice(idx, 1);
    return HttpResponse.json({ postId: post.id, likes: post.likes });
  }),

  // ── Comment ──
  http.post("*/api/v1/posts/:postId/comment", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, string>;
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const comment = {
      id: `c${Date.now()}`,
      user: { id: CURRENT_USER.id, username: CURRENT_USER.username, avatar: CURRENT_USER.avatar, fullName: CURRENT_USER.fullName },
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(comment);
    return HttpResponse.json({ postId: post.id, comment });
  }),

  // ── Edit Comment ──
  http.put("*/api/v1/posts/:postId/comment/:commentId", async ({ params, request }) => {
    const body = (await request.json()) as Record<string, string>;
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const comment = post.comments.find((c) => c.id === params.commentId);
    if (comment) comment.text = body.text;
    return HttpResponse.json({ text: body.text });
  }),

  // ── Delete Comment ──
  http.delete("*/api/v1/posts/:postId/comment/:commentId", ({ params }) => {
    const post = posts.find((p) => p.id === params.postId);
    if (post) post.comments = post.comments.filter((c) => c.id !== params.commentId);
    return HttpResponse.json({ message: "Deleted" });
  }),

  // ── Post Likes List ──
  http.get("*/api/v1/posts/:postId/likes", ({ params }) => {
    const post = posts.find((p) => p.id === params.postId);
    if (!post) return HttpResponse.json([], { status: 200 });
    const likeUsers = post.likes.map((uid) => {
      const u = mockUsers.find((u) => u.id === uid);
      return u ? { id: u.id, username: u.username, fullName: u.fullName, avatar: u.avatar } : null;
    }).filter(Boolean);
    return HttpResponse.json(likeUsers);
  }),

  // ── Report Post ──
  http.post("*/api/v1/posts/:postId/report", () => {
    return HttpResponse.json({ message: "Reported" });
  }),

  // ── Search Users (must be before :username) ──
  http.get("*/api/v1/users/search", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const results = mockUsers.filter(
      (u) => u.id !== CURRENT_USER.id && (u.username.includes(q) || u.fullName.toLowerCase().includes(q))
    ).map((u) => ({ id: u.id, username: u.username, fullName: u.fullName, avatar: u.avatar }));
    return HttpResponse.json(results);
  }),

  // ── Suggested Users (must be before :username) ──
  http.get("*/api/v1/users/suggestions", () => {
    const suggestions = mockUsers
      .filter((u) => u.id !== CURRENT_USER.id && !CURRENT_USER.following.includes(u.id))
      .map((u) => ({ id: u.id, username: u.username, fullName: u.fullName, avatar: u.avatar }));
    return HttpResponse.json(suggestions);
  }),

  // ── Profile ──
  http.get("*/api/v1/users/:username", ({ params }) => {
    const user = mockUsers.find((u) => u.username === params.username);
    if (!user) return HttpResponse.json({ message: "User not found" }, { status: 404 });
    const userPosts = posts.filter((p) => p.user.username === user.username).map((p) => ({
      id: p.id, image: p.image, likes: p.likes, createdAt: p.createdAt,
    }));
    return HttpResponse.json({ user, posts: userPosts });
  }),

  // ── Update Profile ──
  http.put("*/api/v1/users/me", () => {
    return HttpResponse.json({ user: CURRENT_USER });
  }),

  // ── Follow/Unfollow ──
  http.put("*/api/v1/users/:userId/follow", ({ params }) => {
    const target = mockUsers.find((u) => u.id === params.userId);
    if (!target) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const idx = target.followers.indexOf(CURRENT_USER.id);
    if (idx === -1) target.followers.push(CURRENT_USER.id);
    else target.followers.splice(idx, 1);
    return HttpResponse.json({ message: "Toggled" });
  }),

  // ── Followers/Following List ──
  http.get("*/api/v1/users/:username/followers", ({ params }) => {
    const user = mockUsers.find((u) => u.username === params.username);
    if (!user) return HttpResponse.json({ users: [] });
    const users = user.followers.map((uid) => {
      const u = mockUsers.find((u) => u.id === uid);
      return u ? { id: u.id, username: u.username, fullName: u.fullName, avatar: u.avatar } : null;
    }).filter(Boolean);
    return HttpResponse.json({ users });
  }),

  http.get("*/api/v1/users/:username/following", ({ params }) => {
    const user = mockUsers.find((u) => u.username === params.username);
    if (!user) return HttpResponse.json({ users: [] });
    const users = user.following.map((uid) => {
      const u = mockUsers.find((u) => u.id === uid);
      return u ? { id: u.id, username: u.username, fullName: u.fullName, avatar: u.avatar } : null;
    }).filter(Boolean);
    return HttpResponse.json({ users });
  }),

  // ── Stories ──
  http.get("*/api/v1/stories", () => {
    return HttpResponse.json(mockStoryGroups);
  }),

  http.post("*/api/v1/stories", () => {
    const newStory = {
      userId: CURRENT_USER.id,
      username: CURRENT_USER.username,
      avatar: CURRENT_USER.avatar,
      stories: [
        { id: `s${Date.now()}`, image: `https://picsum.photos/seed/${Date.now()}/400/700`, createdAt: new Date().toISOString() },
      ],
    };
    return HttpResponse.json(newStory);
  }),

  // ── Notifications ──
  http.get("*/api/v1/notifications", () => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    return HttpResponse.json({ notifications, unreadCount });
  }),

  http.put("*/api/v1/notifications/read", () => {
    notifications.forEach((n) => (n.read = true));
    return HttpResponse.json({ message: "All read" });
  }),

  // ── Toggle Save/Bookmark ──
  http.put("*/api/v1/posts/:postId/save", ({ params }) => {
    const id = params.postId as string;
    const idx = savedPostIds.indexOf(id);
    if (idx === -1) {
      savedPostIds.push(id);
      return HttpResponse.json({ postId: id, saved: true });
    } else {
      savedPostIds.splice(idx, 1);
      return HttpResponse.json({ postId: id, saved: false });
    }
  }),
];
