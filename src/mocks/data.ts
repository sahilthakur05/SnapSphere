// ── Mock Users ──
export const mockUsers = [
  {
    id: "u1",
    username: "sahil",
    email: "sahil@test.com",
    fullName: "Sahil Thakur",
    avatar: "https://i.pravatar.cc/150?u=sahil",
    bio: "Full-stack developer. Building cool stuff.",
    followers: ["u2", "u3"],
    following: ["u2"],
  },
  {
    id: "u2",
    username: "priya",
    email: "priya@test.com",
    fullName: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?u=priya",
    bio: "Photographer & traveler",
    followers: ["u1"],
    following: ["u1", "u3"],
  },
  {
    id: "u3",
    username: "arjun",
    email: "arjun@test.com",
    fullName: "Arjun Patel",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    bio: "Designer at heart",
    followers: ["u2"],
    following: ["u1"],
  },
  {
    id: "u4",
    username: "neha",
    email: "neha@test.com",
    fullName: "Neha Gupta",
    avatar: "https://i.pravatar.cc/150?u=neha",
    bio: "",
    followers: [],
    following: [],
  },
  {
    id: "u5",
    username: "rahul",
    email: "rahul@test.com",
    fullName: "Rahul Singh",
    avatar: "https://i.pravatar.cc/150?u=rahul",
    bio: "Coffee & code",
    followers: [],
    following: [],
  },
];

// ── Mock Posts ──
export const mockPosts = [
  {
    id: "p1",
    user: { id: "u1", username: "sahil", avatar: "https://i.pravatar.cc/150?u=sahil", fullName: "Sahil Thakur" },
    image: "https://picsum.photos/seed/post1/600/600",
    caption: "Beautiful sunset today! #sunset #nature @priya",
    likes: ["u2", "u3"],
    comments: [
      { id: "c1", user: { id: "u2", username: "priya", avatar: "https://i.pravatar.cc/150?u=priya", fullName: "Priya Sharma" }, text: "Gorgeous! 😍", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "c2", user: { id: "u3", username: "arjun", avatar: "https://i.pravatar.cc/150?u=arjun", fullName: "Arjun Patel" }, text: "Where is this? #amazing", createdAt: new Date(Date.now() - 1800000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "p2",
    user: { id: "u2", username: "priya", avatar: "https://i.pravatar.cc/150?u=priya", fullName: "Priya Sharma" },
    image: "https://picsum.photos/seed/post2/600/600",
    caption: "Morning coffee vibes ☕ This is a really long caption to test the expand/collapse feature. Sometimes you just need to sit back, relax, and enjoy the little moments in life. #coffee #mornings #relax #vibes #lifestyle",
    likes: ["u1"],
    comments: [
      { id: "c3", user: { id: "u1", username: "sahil", avatar: "https://i.pravatar.cc/150?u=sahil", fullName: "Sahil Thakur" }, text: "Need that right now!", createdAt: new Date(Date.now() - 600000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "p3",
    user: { id: "u3", username: "arjun", avatar: "https://i.pravatar.cc/150?u=arjun", fullName: "Arjun Patel" },
    image: "https://picsum.photos/seed/post3/600/600",
    caption: "New design project 🎨 #design #ui",
    likes: ["u1", "u2", "u4"],
    comments: [],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "p4",
    user: { id: "u1", username: "sahil", avatar: "https://i.pravatar.cc/150?u=sahil", fullName: "Sahil Thakur" },
    image: "https://picsum.photos/seed/post4/600/600",
    caption: "Code, eat, sleep, repeat 💻",
    likes: ["u2"],
    comments: [],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "p5",
    user: { id: "u2", username: "priya", avatar: "https://i.pravatar.cc/150?u=priya", fullName: "Priya Sharma" },
    image: "https://picsum.photos/seed/post5/600/600",
    caption: "Travel diaries 🌍 #travel #explore",
    likes: ["u1", "u3", "u4", "u5"],
    comments: [
      { id: "c4", user: { id: "u4", username: "neha", avatar: "https://i.pravatar.cc/150?u=neha", fullName: "Neha Gupta" }, text: "Take me with you next time!", createdAt: new Date(Date.now() - 43200000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// ── Mock Notifications ──
export const mockNotifications = [
  {
    id: "n1",
    type: "like" as const,
    sender: { id: "u2", username: "priya", avatar: "https://i.pravatar.cc/150?u=priya" },
    postId: "p1",
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "n2",
    type: "comment" as const,
    sender: { id: "u3", username: "arjun", avatar: "https://i.pravatar.cc/150?u=arjun" },
    postId: "p1",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n3",
    type: "follow" as const,
    sender: { id: "u4", username: "neha", avatar: "https://i.pravatar.cc/150?u=neha" },
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "n4",
    type: "like" as const,
    sender: { id: "u5", username: "rahul", avatar: "https://i.pravatar.cc/150?u=rahul" },
    postId: "p4",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
