import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

interface StoryLikeUser {
  id: string;
  username: string;
  avatar: string;
}

interface Story {
  id: string;
  image: string;
  caption?: string;
  likes?: StoryLikeUser[];
  createdAt: string;
}

interface StoryGroup {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  storyGroups: StoryGroup[];
  initialGroupIndex: number;
  onStoryViewed: (userId: string, storyId: string) => void;
  onLikeStory?: (storyId: string) => void;
  onReplyStory?: (storyId: string, text: string) => void;
}

export function StoryViewer({
  isOpen,
  onClose,
  storyGroups,
  initialGroupIndex,
  onStoryViewed,
  onLikeStory,
  onReplyStory,
}: Props) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const currentGroup = storyGroups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  const goNext = useCallback(() => {
    if (!currentGroup) return;
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      setProgress(0);
      setIsLiked(false);
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
      setStoryIndex(0);
      setProgress(0);
      setIsLiked(false);
    } else {
      onClose();
    }
  }, [storyIndex, groupIndex, currentGroup, storyGroups.length, onClose]);

  const goPrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setProgress(0);
      setIsLiked(false);
    } else if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
      setStoryIndex(0);
      setProgress(0);
      setIsLiked(false);
    }
  };

  const handleLike = () => {
    setIsLiked(true);
    setShowHeart(true);
    onLikeStory?.(currentStory?.id ?? "");
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleReply = () => {
    if (!replyText.trim() || !currentStory) return;
    onReplyStory?.(currentStory.id, replyText.trim());
    setReplyText("");
  };

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    onStoryViewed(currentGroup.userId, currentStory.id);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentStory, currentGroup, goNext, onStoryViewed, isPaused]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setGroupIndex(initialGroupIndex);
      setStoryIndex(0);
      setProgress(0);
      setIsLiked(false);
      setReplyText("");
    }
  }, [isOpen, initialGroupIndex]);

  // Pause when typing reply
  useEffect(() => {
    setIsPaused(replyText.length > 0);
  }, [replyText]);

  if (!isOpen || !currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      {(groupIndex > 0 || storyIndex > 0) && (
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 sm:left-4 sm:p-2"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Next */}
      {(groupIndex < storyGroups.length - 1 || storyIndex < currentGroup.stories.length - 1) && (
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 sm:right-4 sm:p-2"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {/* Story content */}
      <div className="relative flex h-full w-full max-w-lg flex-col">
        {/* Progress bars */}
        <div className="absolute left-0 right-0 top-0 z-10 flex gap-1 p-3">
          {currentGroup.stories.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: i < storyIndex ? "100%" : i === storyIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="absolute left-0 right-0 top-6 z-10 flex items-center gap-3 px-4 py-2">
          {currentGroup.avatar ? (
            <img
              src={currentGroup.avatar}
              alt={currentGroup.username}
              className="h-8 w-8 rounded-full object-cover border border-white/50"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
              {currentGroup.username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-semibold text-white drop-shadow">
            {currentGroup.username}
          </span>
          <span className="text-xs text-white/60">
            {new Date(currentStory.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Image */}
        <img
          src={currentStory.image}
          alt="Story"
          className="h-full w-full object-contain"
          onClick={goNext}
          onDoubleClick={(e) => { e.stopPropagation(); handleLike(); }}
        />

        {/* Caption overlay */}
        {currentStory.caption && (
          <div className={`absolute left-0 right-0 px-6 text-center ${currentStory.likes && currentStory.likes.length > 0 ? "bottom-32" : "bottom-20"}`}>
            <p className="rounded-lg bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Heart animation */}
        {showHeart && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart className="h-24 w-24 animate-ping fill-red-500 text-red-500" />
          </div>
        )}

        {/* Story likes — show who liked */}
        {currentStory.likes && currentStory.likes.length > 0 && (
          <div className="absolute bottom-20 left-0 right-0 z-10 px-4">
            <div className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <div className="flex -space-x-2">
                {currentStory.likes.slice(0, 3).map((u) => (
                  u.avatar ? (
                    <img key={u.id} src={u.avatar} alt={u.username} className="h-6 w-6 rounded-full border-2 border-black/50 object-cover" />
                  ) : (
                    <div key={u.id} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-black/50 bg-gray-300 text-[10px] font-bold text-gray-700">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  )
                ))}
              </div>
              <span className="text-xs text-white">
                {currentStory.likes.length === 1
                  ? `${currentStory.likes[0].username} liked this`
                  : currentStory.likes.length <= 3
                    ? `${currentStory.likes.map((u) => u.username).join(", ")} liked this`
                    : `${currentStory.likes[0].username} and ${currentStory.likes.length - 1} others liked this`
                }
              </span>
            </div>
          </div>
        )}

        {/* Bottom bar: Like + Reply */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-3 bg-linear-to-t from-black/60 to-transparent px-4 pb-4 pt-8">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to story..."
            className="flex-1 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/60 backdrop-blur-sm"
            onKeyDown={(e) => e.key === "Enter" && handleReply()}
          />
          {replyText.trim() ? (
            <button
              onClick={handleReply}
              className="rounded-full bg-brand-500 p-2 text-white hover:bg-brand-600"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleLike}
              className="rounded-full p-2 text-white hover:bg-white/10"
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
