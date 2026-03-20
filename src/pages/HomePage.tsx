import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CreatePostModal } from "../components/CreatePostModal";
import { addComment, fetchPosts, toggleLike } from "../features/post/postSlice";
import { logout } from "../features/auth/authSlice";
import { Navbar } from "../components/Navbar";
import { Loader2 } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { fetchNotifications } from "../features/notification/notificationSlice";

export function HomePage() {
  const dispatch = useAppDispatch();
  const { posts, isLoading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  //fetch post on mount
  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchNotifications())
  }, [dispatch]);
  const handleLike = (postId: string) => {
    dispatch(toggleLike(postId));
  };
  const handleComment = (postId: string, text: string) => {
    dispatch(addComment({ postId, text }));
  };
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        username={user?.username ?? ""}
        avatar={user?.avatar}
        onCreatePost={() => setShowCreateModal(true)}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm">
              Create a post or follow someone to see their posts here.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id ?? ""}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </main>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
