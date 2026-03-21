import { Plus } from "lucide-react";

interface StoryUser {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
  isViewed: boolean;
}

interface Props {
  currentUser: {
    username: string;
    avatar?: string;
  };
  stories: StoryUser[];
  onAddStory: () => void;
  onViewStory: (userId: string) => void;
}

export function StoriesBar({ currentUser, stories, onAddStory, onViewStory }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto rounded-xl border border-gray-200 bg-white px-4 py-3 scrollbar-hide">
      {/* Add story */}
      <button
        onClick={onAddStory}
        className="flex shrink-0 flex-col items-center gap-1"
      >
        <div className="relative">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt="Your story"
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-600 border-2 border-gray-200">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white">
            <Plus className="h-3 w-3" />
          </div>
        </div>
        <span className="w-16 truncate text-center text-[11px] text-gray-500">
          Your story
        </span>
      </button>

      {/* Other stories */}
      {stories.map((s) => (
        <button
          key={s.id}
          onClick={() => onViewStory(s.id)}
          className="flex shrink-0 flex-col items-center gap-1"
        >
          <div
            className={`rounded-full p-[2px] ${
              s.hasStory && !s.isViewed
                ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
                : s.hasStory && s.isViewed
                  ? "bg-gray-300"
                  : "bg-transparent"
            }`}
          >
            {s.avatar ? (
              <img
                src={s.avatar}
                alt={s.username}
                className="h-[60px] w-[60px] rounded-full border-2 border-white object-cover"
              />
            ) : (
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-white bg-brand-100 text-sm font-semibold text-brand-600">
                {s.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="w-16 truncate text-center text-[11px] text-gray-500">
            {s.username}
          </span>
        </button>
      ))}
    </div>
  );
}
