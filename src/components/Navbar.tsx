import { Link } from 'react-router-dom';
import {
  Camera,
  PlusSquare,
  Search,
  Bell,
  Bookmark,
} from "lucide-react";
import { AccountSwitcher } from "./AccountSwitcher";

interface SavedAccount {
  id: string;
  username: string;
  avatar: string;
}

interface Props {
  username: string;
  avatar?: string;
  onCreatePost: () => void;
  onLogout: () => void;
  unreadCount?: number;
  savedAccounts?: SavedAccount[];
  onSwitchAccount?: (accountId: string) => void;
  onAddAccount?: () => void;
}

export function Navbar({ username, avatar, onCreatePost, onLogout, unreadCount = 0, savedAccounts = [], onSwitchAccount, onAddAccount }: Props) {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-brand-500" />
          <span className="text-xl font-bold text-brand-500">SnapSphere</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/explore"
            className="hidden text-gray-500 hover:text-brand-500 sm:block"
            title="Explore"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            to="/notifications"
            className="hidden relative text-gray-500 hover:text-brand-500 sm:block"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/saved"
            className="text-gray-500 hover:text-brand-500"
            title="Saved"
          >
            <Bookmark className="h-5 w-5" />
          </Link>

          <button
            onClick={onCreatePost}
            className="hidden items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 sm:flex"
          >
            <PlusSquare className="h-4 w-4" />
            Post
          </button>

          <Link
            to={`/profile/${username}`}
            className="hidden items-center hover:opacity-80 sm:flex"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="hidden sm:block">
            <AccountSwitcher
              currentAccount={{ id: "current", username, avatar: avatar || "" }}
              savedAccounts={savedAccounts}
              onSwitch={(id) => onSwitchAccount?.(id)}
              onAddAccount={() => onAddAccount?.() ?? window.location.assign("/login")}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
