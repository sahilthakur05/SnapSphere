import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CreatePostModal } from "../components/CreatePostModal";
import {
  addComment,
  deletePost,
  editPost,
  fetchPostLikes,
  fetchPosts,
  reportPost,
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
import { ScrollToTop } from "../components/ScrollToTop";
import { Toast } from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { usePageTitle } from "../hooks/usePageTitle";
import { StoriesBar } from "../components/StoriesBar";
import { StoryViewer } from "../components/StoryViewer";
import { AddStoryModal } from "../components/AddStoryModal";
import { fetchStories, addStory, markStoryViewed } from "../features/story/storySlice";
import { likeStory, replyToStory, fetchConversations } from "../features/message/messageSlice";
export function HomePage() {
  usePageTitle("Feed");
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
  const { toast, showToast, hideToast } = useToast();
  const { storyGroups, viewedStories } = useAppSelector((state) => state.stories);
  const { totalUnread: unreadMessages } = useAppSelector((state) => state.messages);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyGroupIndex, setStoryGroupIndex] = useState(0);
  const [showAddStory, setShowAddStory] = useState(false);
  const [isAddingStory, setIsAddingStory] = useState(false);

  //fetch post on mount
  useEffect(() => {
    dispatch(fetchPosts(1));
    dispatch(fetchNotifications());
    dispatch(fetchSuggestions());
    dispatch(fetchStories());
    dispatch(fetchConversations());
  }, [dispatch]);
  const handleLike = (postId: string) => {
    dispatch(toggleLike({ postId, userId: user?.id ?? "" }));
  };
  const handleComment = (postId: string, text: string) => {
    return dispatch(addComment({ postId, text }));
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
    showToast("Post updated", "success");
  };

  const handleLoadMore = () => {
    dispatch(fetchPosts(currentPage + 1));
  };

  const handleViewStory = (userId: string) => {
    const idx = storyGroups.findIndex((g) => g.userId === userId);
    if (idx !== -1) {
      setStoryGroupIndex(idx);
      setShowStoryViewer(true);
    }
  };

  const handleAddStory = async (file: File, caption: string) => {
    setIsAddingStory(true);
    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);
    await dispatch(addStory(formData));
    setIsAddingStory(false);
    setShowAddStory(false);
    showToast("Story shared!", "success");
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
        unreadMessages={unreadMessages}
      />

      <div className="mx-auto flex max-w-5xl gap-8 px-2 py-4 sm:px-4 sm:py-6">
        {/* Feed */}
        <main className="mx-auto w-full max-w-2xl space-y-4 sm:space-y-6">
          {/* Stories */}
          <StoriesBar
            currentUser={{ username: user?.username ?? "", avatar: user?.avatar }}
            stories={storyGroups.map((g) => ({
              id: g.userId,
              username: g.username,
              avatar: g.avatar,
              hasStory: g.stories.length > 0,
              isViewed: viewedStories[g.userId]?.length === g.stories.length,
            }))}
            onAddStory={() => setShowAddStory(true)}
            onViewStory={handleViewStory}
          />

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
                  onDelete={(id) => { dispatch(deletePost(id)).unwrap().then(() => showToast("Post deleted", "success")).catch(() => showToast("Failed to delete post", "error")); }}
                  onEdit={handleEdit}
                  onShowLikes={handleShowLikes}
                  onReport={(id, reason) => { dispatch(reportPost({ postId: id, reason })).unwrap().then(() => showToast("Post reported. Thank you.", "info")).catch(() => showToast("Failed to report post", "error")); }}
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
        unreadMessages={unreadMessages}
      />
      <StoryViewer
        isOpen={showStoryViewer}
        onClose={() => setShowStoryViewer(false)}
        storyGroups={storyGroups}
        initialGroupIndex={storyGroupIndex}
        onStoryViewed={(userId, storyId) => dispatch(markStoryViewed({ userId, storyId }))}
        onLikeStory={(storyId) => { dispatch(likeStory(storyId)); showToast("Story liked!", "success"); }}
        onReplyStory={(storyId, text) => { dispatch(replyToStory({ storyId, text })); showToast("Reply sent!", "success"); }}
      />
      <AddStoryModal
        isOpen={showAddStory}
        onClose={() => setShowAddStory(false)}
        onSubmit={handleAddStory}
        isSubmitting={isAddingStory}
      />
      <ScrollToTop />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
