import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CreatePostModal } from "../components/CreatePostModal";
import {
  addComment,
  deletePost,
  editPost,
  fetchPostLikes,
  fetchPosts,
  toggleLike,
} from "../features/post/postSlice";
import type { Post } from "../features/post/postSlice";
import { logout } from "../features/auth/authSlice";
import { Navbar } from "../components/Navbar";
import { PostCardSkeleton } from "../components/PostCardSkeleton";
import { PostCard } from "../components/PostCard";
import { fetchNotifications } from "../features/notification/notificationSlice";
import { toggleBookmark } from "../features/saved/savedSlice";
import { EditPostModal } from "../components/EditPostModal";
import { LikesListModal } from "../components/LikesListModal";
import { SuggestedUsers } from "../components/SuggestedUsers";
import {
  fetchSuggestions,
  followUser,
} from "../features/suggestion/suggestionSlice";
import { BottomNav } from "../components/BottomNav";
import { LoadMoreTrigger } from "../components/LoadMoreTrigger";
export function HomePage() {
  const dispatch = useAppDispatch();
  const { posts, isLoading, hasMore, loadingMore, currentPage } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { unreadCount } = useAppSelector((state) => state.notifications);
  const { savedPostIds } = useAppSelector((state) => state.saved);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const { likeUsers, likeUsersLoading } = useAppSelector(
    (state) => state.posts,
  );
  const { users: suggestedUsers, isLoading: suggestionsLoading } =
    useAppSelector((state) => state.suggestions);
  const [showLikesModal, setShowLikesModal] = useState(false);
  //fetch post on mount
  useEffect(() => {
    dispatch(fetchPosts(1));
    dispatch(fetchNotifications());
    dispatch(fetchSuggestions())
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

  const handleLoadMore = () => {
    dispatch(fetchPosts(currentPage + 1));
  };

  const handleShowLikes = (postId: string) => {
    dispatch(fetchPostLikes(postId));
    setShowLikesModal(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <Navbar
        username={user?.username ?? ""}
        avatar={user?.avatar}
        onCreatePost={() => setShowCreateModal(true)}
        onLogout={handleLogout}
        unreadCount={unreadCount}
      />

      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-6">
        {/* Feed */}
        <main className="flex-1 max-w-2xl space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm">
                Create a post or follow someone to see their posts here.
              </p>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={user?.id ?? ""}
                  onLike={handleLike}
                  onComment={handleComment}
                  isSaved={savedPostIds.includes(post.id)}
                  onToggleSave={(id) => dispatch(toggleBookmark(id))}
                  onDelete={(id) => dispatch(deletePost(id))}
                  onEdit={handleEdit}
                  onShowLikes={handleShowLikes}
                />
              ))}
              <LoadMoreTrigger
                onTrigger={handleLoadMore}
                isLoading={loadingMore}
                hasMore={hasMore}
              />
            </>
          )}
        </main>

        {/* Suggested Users Sidebar (desktop only) */}
        <aside className="sticky top-20 hidden h-fit lg:block">
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
        </aside>
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <EditPostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        postImage={editingPost?.image || ""}
        caption={editCaption}
        onCaptionChange={setEditCaption}
        onSave={handleSaveEdit}
        isSubmitting={isEditSubmitting}
      />
      <LikesListModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        users={likeUsers}
        isLoading={likeUsersLoading}
      />
      <BottomNav
        username={user?.username ?? ""}
        avatar={user?.avatar}
        onCreatePost={() => setShowCreateModal(true)}
        unreadCount={unreadCount}
      />
    </div>
  );
}
