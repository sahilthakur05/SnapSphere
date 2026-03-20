import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Send } from 'lucide-react';
import type { Post } from '../features/post/postSlice';

interface Props {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
}

export function PostCard({ post, currentUserId, onLike, onComment }: Props) {
  const [commentText, setCommentText] = useState('');
  const isLiked = post.likes.includes(currentUserId);
  const navigate = useNavigate();

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link to={`/profile/${post.user.username}`}>
          {post.user.avatar ? (
            <img src={post.user.avatar} alt={post.user.username} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
              {post.user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <div>
          <Link to={`/profile/${post.user.username}`} className="text-sm font-semibold text-gray-900 hover:underline">{post.user.username}</Link>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Image */}
      <img
        src={post.image}
        alt="Post"
        className="w-full cursor-pointer object-cover"
        onClick={() => navigate(`/post/${post.id}`)}
      />

      {/* Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5">
            <Heart
              className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            />
          </button>
          <MessageCircle className="h-6 w-6 text-gray-600" />
        </div>
        <p className="mt-1 text-sm font-semibold text-gray-900">{post.likes.length} likes</p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pt-1">
          <p className="text-sm text-gray-800">
            <Link to={`/profile/${post.user.username}`} className="font-semibold hover:underline">{post.user.username}</Link>{' '}
            {post.caption}
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
              <Link to={`/profile/${c.user.username}`} className="font-semibold hover:underline">{c.user.username}</Link>{' '}
              {c.text}
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
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
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
  );
}
