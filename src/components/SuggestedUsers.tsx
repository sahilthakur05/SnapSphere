import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SuggestedUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Props {
  currentUser: {
    username: string;
    fullName?: string;
    avatar?: string;
  };
  users: SuggestedUser[];
  isLoading: boolean;
  onFollow: (userId: string) => void;
}

export function SuggestedUsers({
  currentUser,
  users,
  isLoading,
  onFollow,
}: Props) {
  return (
    <div className="w-80">
      {/* Current user info */}
      <div className="flex items-center gap-3 py-4">
        <Link to={`/profile/${currentUser.username}`}>
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <div>
          <Link
            to={`/profile/${currentUser.username}`}
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            {currentUser.username}
          </Link>
          {currentUser.fullName && (
            <p className="text-xs text-gray-400">{currentUser.fullName}</p>
          )}
        </div>
      </div>

      {/* Suggested header */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm font-semibold text-gray-400">
          Suggested for you
        </p>
      </div>

      {/* User list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
        </div>
      ) : users.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          No suggestions right now
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <Link to={`/profile/${u.username}`} className="shrink-0">
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/profile/${u.username}`}
                  className="block truncate text-sm font-semibold text-gray-900 hover:underline"
                >
                  {u.username}
                </Link>
                <p className="truncate text-xs text-gray-400">{u.fullName}</p>
              </div>
              <button
                onClick={() => onFollow(u.id)}
                className="text-xs font-semibold text-brand-500 hover:text-brand-700"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
