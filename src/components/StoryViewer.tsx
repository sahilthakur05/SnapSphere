import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  image: string;
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
}

export function StoryViewer({
  isOpen,
  onClose,
  storyGroups,
  initialGroupIndex,
  onStoryViewed,
}: Props) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  const goNext = useCallback(() => {
    if (!currentGroup) return;
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      setProgress(0);
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex(groupIndex + 1);
      setStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIndex, groupIndex, currentGroup, storyGroups.length, onClose]);

  const goPrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setProgress(0);
    } else if (groupIndex > 0) {
      setGroupIndex(groupIndex - 1);
      setStoryIndex(0);
      setProgress(0);
    }
  };

  // Auto-advance timer
  useEffect(() => {
    if (!isOpen || !currentStory) return;

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
  }, [isOpen, currentStory, currentGroup, goNext, onStoryViewed]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setGroupIndex(initialGroupIndex);
      setStoryIndex(0);
      setProgress(0);
    }
  }, [isOpen, initialGroupIndex]);

  if (!isOpen || !currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black">
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
          className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next */}
      {(groupIndex < storyGroups.length - 1 || storyIndex < currentGroup.stories.length - 1) && (
        <button
          onClick={goNext}
          className="absolute right-4 z-10 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
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
        />
      </div>
    </div>
  );
}
