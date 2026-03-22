import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, MessageCircle, User } from "lucide-react";

interface Props {
  username: string;
  avatar?: string;
  onCreatePost: () => void;
  unreadCount?: number;
  unreadMessages?: number;
}

export function BottomNav({ username, avatar, onCreatePost, unreadMessages = 0 }: Props) {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-14 items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-0.5 transition-colors duration-150 ${isActive("/") ? "text-brand-500" : "text-gray-500"}`}
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          to="/explore"
          className={`flex flex-col items-center gap-0.5 transition-colors duration-150 ${isActive("/explore") ? "text-brand-500" : "text-gray-500"}`}
        >
          <Search className="h-6 w-6" />
          <span className="text-[10px]">Explore</span>
        </Link>

        <button
          onClick={onCreatePost}
          className="flex flex-col items-center gap-0.5 text-gray-500"
        >
          <div className="rounded-lg bg-brand-500 p-1.5">
            <PlusSquare className="h-5 w-5 text-white" />
          </div>
        </button>

        <Link
          to="/messages"
          className={`relative flex flex-col items-center gap-0.5 transition-colors duration-150 ${pathname.startsWith("/messages") ? "text-brand-500" : "text-gray-500"}`}
        >
          <MessageCircle className="h-6 w-6" />
          {unreadMessages > 0 && (
            <span className="absolute -right-1 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
          <span className="text-[10px]">Messages</span>
        </Link>

        <Link
          to={`/profile/${username}`}
          className={`flex flex-col items-center gap-0.5 transition-colors duration-150 ${pathname.startsWith("/profile") ? "text-brand-500" : "text-gray-500"}`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className={`h-6 w-6 rounded-full object-cover ${pathname.startsWith("/profile") ? "ring-2 ring-brand-500" : ""}`}
            />
          ) : (
            <User className="h-6 w-6" />
          )}
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
