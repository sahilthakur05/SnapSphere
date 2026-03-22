import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2, Pencil, Link2, Check, Flag } from "lucide-react";
import type { Post } from '../features/post/postSlice';
import { ConfirmModal } from "./ConfirmModal";
import { ImageLightbox } from "./ImageLightbox";
import { ReportModal } from "./ReportModal";
import { timeAgo } from "../lib/timeAgo";
import { parseText } from "../lib/parseText";
interface Props {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  isSaved: boolean; // ← add
  onToggleSave: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onShowLikes?: (postId: string) => void;
  onReport?: (postId: string, reason: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onComment,
  isSaved,
  onToggleSave,
  onDelete,
  onEdit,
  onShowLikes,
  onReport,
}: Props) {
  const [commentText, setCommentText] = useState("");
  const isLiked = post.likes.includes(currentUserId);
  const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [showShareMenu, setShowShareMenu] = useState(false);
const [copied, setCopied] = useState(false);
const [showHeartAnim, setShowHeartAnim] = useState(false);
const [showLightbox, setShowLightbox] = useState(false);
const [showReportModal, setShowReportModal] = useState(false);
const [isReporting, setIsReporting] = useState(false);
const [captionExpanded, setCaptionExpanded] = useState(false);
const lastTapRef = useRef(0);
const isOwner = post.user.id === currentUserId;

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer on unmount to prevent state update on unmounted component
  useEffect(() => {
    return () => {
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
    };
  }, []);

  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap — like
      if (singleTapTimer.current) clearTimeout(singleTapTimer.current);
      if (!isLiked) onLike(post.id);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    } else {
      // Single tap — open lightbox (delayed to check for double tap)
      singleTapTimer.current = setTimeout(() => {
        setShowLightbox(true);
      }, 300);
    }
    lastTapRef.current = now;
  };

  return (
    <div className="animate-fade-in rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
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
            {timeAgo(post.createdAt)}
          </p>
        </div>
        {(isOwner && (onDelete || onEdit)) || (!isOwner && onReport) ? (
          <div className="relative ml-auto">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="animate-scale-in absolute right-0 top-8 z-10 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                {isOwner && onEdit && (
                  <button
                    onClick={() => { setShowMenu(false); onEdit(post); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Post
                  </button>
                )}
                {isOwner && onDelete && (
                  <button
                    onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Post
                  </button>
                )}
                {!isOwner && onReport && (
                  <button
                    onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-50"
                  >
                    <Flag className="h-4 w-4" />
                    Report Post
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Image with double-tap to like, single-tap for lightbox */}
      <div className="relative" onClick={handleImageTap}>
        <img
          src={post.image}
          alt="Post"
          loading="lazy"
          className="w-full max-h-[70vh] cursor-pointer object-cover"
        />
        {showHeartAnim && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart className="h-20 w-20 animate-heart-pop fill-white text-white drop-shadow-lg" />
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
            className={`h-6 w-6 transition-all duration-200 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 hover:text-red-500"}`}
          />
        </button>
        <button onClick={() => navigate(`/post/${post.id}`)}>
          <MessageCircle className="h-6 w-6 text-gray-600 hover:text-gray-900" />
        </button>
        <div className="relative">
          <button onClick={() => setShowShareMenu(!showShareMenu)}>
            <Send className="h-5 w-5 text-gray-600 hover:text-gray-900" />
          </button>
          {showShareMenu && (
            <div className="animate-scale-in absolute left-0 top-8 z-10 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
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
            className={`h-6 w-6 transition-all duration-200 ${isSaved ? "fill-gray-900 text-gray-900 scale-110" : "text-gray-600 hover:text-gray-900"}`}
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
            {post.caption.length > 150 && !captionExpanded ? (
              <>
                {parseText(post.caption.slice(0, 150))}
                <button
                  onClick={() => setCaptionExpanded(true)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  ...more
                </button>
              </>
            ) : (
              <>
                {parseText(post.caption)}
                {post.caption.length > 150 && (
                  <button
                    onClick={() => setCaptionExpanded(false)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                  >
                    less
                  </button>
                )}
              </>
            )}
          </p>
        </div>
      )}

      {/* Comments preview */}
      {post.comments.length > 0 && (
        <div className="px-4 pt-2 space-y-1">
          {post.comments.length > 2 && (
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              View all {post.comments.length} comments
            </button>
          )}
          {post.comments.slice(-2).map((c) => (
            <p key={c.id} className="text-sm text-gray-700">
              <Link
                to={`/profile/${c.user.username}`}
                className="font-semibold hover:underline"
              >
                {c.user.username}
              </Link>{" "}
              {parseText(c.text)}
            </p>
          ))}
        </div>
      )}

      {/* Add comment */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2.5 mt-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment…"
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
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        onConfirm={() => {
          onDelete?.(post.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <ImageLightbox
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        src={post.image}
        alt={`Post by ${post.user.username}`}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={async (reason) => {
          setIsReporting(true);
          onReport?.(post.id, reason);
          setIsReporting(false);
          setShowReportModal(false);
        }}
        isSubmitting={isReporting}
      />
    </div>
  );
}
