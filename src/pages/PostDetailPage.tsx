import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  ArrowLeft,
  Loader2,
  Bookmark,
} from "lucide-react";
import type { Post } from "../features/post/postSlice";

interface Props {
  post: Post | null;
  isLoading: boolean;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onBack: () => void;
  isSaved: boolean; // ← add
  onToggleSave: (postId: string) => void;
}

export function PostDetailPage({
  post,
  isLoading,
  currentUserId,
  onLike,
  onComment,
  onBack,
    isSaved,                            // ← add
  onToggleSave  
}: Props) {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (!commentText.trim() || !post) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-500">Post not found.</p>
        <button
          onClick={onBack}
          className="text-brand-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const isLiked = post.likes.includes(currentUserId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Post</h1>
      </div>

      <div className="mx-auto max-w-xl py-4 px-4">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Post header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <Link to={`/profile/${post.user.username}`}>
              {post.user.avatar ? (
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                  {post.user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
            <div>
              <Link
                to={`/profile/${post.user.username}`}
                className="text-sm font-semibold text-gray-900 hover:underline"
              >
                {post.user.username}
              </Link>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Image */}
          <img src={post.image} alt="Post" className="w-full object-cover" />

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5"
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
              />
            </button>
            <MessageCircle className="h-6 w-6 text-gray-600" />
            <button onClick={() => onToggleSave(post.id)} className="ml-auto">
              <Bookmark
                className={`h-6 w-6 ${isSaved ? "fill-gray-900 text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              />
            </button>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className="px-4 pt-1">
              <p className="text-sm text-gray-800">
                <Link
                  to={`/profile/${post.user.username}`}
                  className="font-semibold hover:underline"
                >
                  {post.user.username}
                </Link>{" "}
                {post.caption}
              </p>
            </div>
          )}

          {/* All comments */}
          {post.comments.length > 0 && (
            <div className="px-4 pt-3 space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-400">
                Comments ({post.comments.length})
              </p>
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <Link to={`/profile/${c.user.username}`} className="shrink-0">
                    {c.user.avatar ? (
                      <img
                        src={c.user.avatar}
                        alt={c.user.username}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                        {c.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div>
                    <p className="text-sm text-gray-800">
                      <Link
                        to={`/profile/${c.user.username}`}
                        className="font-semibold hover:underline"
                      >
                        {c.user.username}
                      </Link>{" "}
                      {c.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add comment */}
          <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2.5 mt-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 text-sm outline-none placeholder:text-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="text-brand-500 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
