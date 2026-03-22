import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  ArrowLeft,
  Bookmark,
  MoreHorizontal,
  Trash2,
  X,
  Link2,
  Check,
  Pencil,
} from "lucide-react";
import type { Post } from "../features/post/postSlice";
import { ConfirmModal } from "../components/ConfirmModal";
import { timeAgo } from "../lib/timeAgo";
import { parseText } from "../lib/parseText";
import { Spinner } from "../components/Spinner";

interface Props {
  post: Post | null;
  isLoading: boolean;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onShowLikes?: (postId: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onEditComment?: (postId: string, commentId: string, text: string) => void;
}

export function PostDetailPage({
  post,
  isLoading,
  currentUserId,
  onLike,
  onComment,
  onBack,
    isSaved,
  onToggleSave,
  onDelete,
  onShowLikes,
  onDeleteComment,
  onEditComment,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const lastTapRef = useRef(0);

  const handleDoubleTap = () => {
    if (!post) return;
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!post.likes.includes(currentUserId)) onLike(post.id);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    lastTapRef.current = now;
  };

  const handleComment = () => {
    if (!commentText.trim() || !post) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" />
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

      <div className="mx-auto max-w-5xl py-2 px-2 sm:py-4 sm:px-4">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden lg:flex lg:max-h-[85vh]">
          {/* Image with double-tap to like */}
          <div className="relative lg:w-1/2 lg:shrink-0" onClick={handleDoubleTap}>
            <img src={post.image} alt="Post" className="w-full object-cover lg:h-full" />
            {showHeartAnim && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Heart className="h-20 w-20 animate-ping fill-white text-white drop-shadow-lg" />
              </div>
            )}
          </div>

          {/* Right side: header + actions + comments */}
          <div className="flex flex-col lg:w-1/2 lg:overflow-y-auto">
          {/* Post header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
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
                {timeAgo(post.createdAt)}
              </p>
            </div>
            {post.user.id === currentUserId && onDelete && (
              <div className="relative ml-auto">
                <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 z-10 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 px-4 pt-2">
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5"
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
              />
            </button>
            <MessageCircle className="h-6 w-6 text-gray-600" />
            <div className="relative">
              <button onClick={() => setShowShareMenu(!showShareMenu)}>
                <Send className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </button>
              {showShareMenu && (
                <div className="absolute left-0 top-8 z-10 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                      setCopied(true);
                      setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 1500);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => onToggleSave(post.id)} className="ml-auto">
              <Bookmark
                className={`h-6 w-6 ${isSaved ? "fill-gray-900 text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              />
            </button>
          </div>

          {/* Likes count */}
          {post.likes.length > 0 && (
            <div className="px-4 pt-1">
              <button
                onClick={() => onShowLikes?.(post.id)}
                className="text-sm font-semibold text-gray-900 hover:text-gray-600"
              >
                {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
              </button>
            </div>
          )}

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
                {parseText(post.caption)}
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
                <div key={c.id} className="group flex gap-2">
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
                  <div className="flex-1">
                    {editingCommentId === c.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-brand-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && editCommentText.trim()) {
                              onEditComment?.(post.id, c.id, editCommentText.trim());
                              setEditingCommentId(null);
                            }
                            if (e.key === "Escape") setEditingCommentId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            if (editCommentText.trim()) {
                              onEditComment?.(post.id, c.id, editCommentText.trim());
                              setEditingCommentId(null);
                            }
                          }}
                          className="text-brand-500 hover:text-brand-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-800">
                          <Link
                            to={`/profile/${c.user.username}`}
                            className="font-semibold hover:underline"
                          >
                            {c.user.username}
                          </Link>{" "}
                          {parseText(c.text)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {timeAgo(c.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                  {c.user.id === currentUserId && editingCommentId !== c.id && (
                    <div className="flex shrink-0 gap-1 self-center opacity-0 transition-opacity group-hover:opacity-100">
                      {onEditComment && (
                        <button
                          onClick={() => {
                            setEditingCommentId(c.id);
                            setEditCommentText(c.text);
                          }}
                          className="text-gray-300 hover:text-brand-500"
                          title="Edit comment"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(post.id, c.id)}
                          className="text-gray-300 hover:text-red-500"
                          title="Delete comment"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
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
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        onConfirm={() => { onDelete?.(post.id); setShowDeleteConfirm(false); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
