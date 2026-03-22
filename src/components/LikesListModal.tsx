import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Spinner } from "./Spinner";

interface LikeUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: LikeUser[];
  isLoading: boolean;
}

export function LikesListModal({ isOpen, onClose, users, isLoading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-h-[80vh] rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Likes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User list */}
        <div className="max-h-80 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No likes yet
            </p>
          ) : (
            users.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50"
              >
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-400">{u.fullName}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
