import { Link } from "react-router-dom";

interface Props {
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  currentUserId: string;
  isFollowing?: boolean;
  onFollow?: (userId: string) => void;
}

export function UserCard({ user, currentUserId, isFollowing, onFollow }: Props) {
  const isOwnProfile = user.id === currentUserId;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50">
      <Link to={`/profile/${user.username}`} className="shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${user.username}`}
          className="block truncate text-sm font-semibold text-gray-900 hover:underline"
        >
          {user.username}
        </Link>
        <p className="truncate text-xs text-gray-500">{user.fullName}</p>
      </div>
      {!isOwnProfile && onFollow && (
        <button
          onClick={() => onFollow(user.id)}
          className={`shrink-0 rounded-lg px-4 py-1.5 text-xs font-semibold ${
            isFollowing
              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              : "bg-brand-500 text-white hover:bg-brand-600"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
