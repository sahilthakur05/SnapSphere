import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchConversations } from "../features/message/messageSlice";
import { logout } from "../features/auth/authSlice";
import { timeAgo } from "../lib/timeAgo";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { usePageTitle } from "../hooks/usePageTitle";

export default function MessagesPage() {
  usePageTitle("Messages");
  const dispatch = useAppDispatch();
  const { conversations, isLoading, totalUnread, onlineUsers } = useAppSelector((s) => s.messages);
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useAppSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <Navbar
        username={user?.username ?? ""}
        avatar={user?.avatar}
        onCreatePost={() => {}}
        onLogout={() => dispatch(logout())}
        unreadCount={unreadCount}
        unreadMessages={totalUnread}
      />

      <div className="mx-auto max-w-2xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-400 hover:text-gray-700 lg:hidden">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            <Send size={14} />
            New
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="h-14 w-14 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-28 rounded bg-gray-200" />
                  <div className="h-3 w-44 rounded bg-gray-100" />
                </div>
                <div className="h-3 w-12 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <MessageCircle size={36} className="text-blue-400" />
            </div>
            <p className="text-lg font-semibold text-gray-700">No messages yet</p>
            <p className="mt-1 text-sm text-gray-400">Reply to a story or start a conversation</p>
            <Link
              to="/explore"
              className="mt-6 rounded-full bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Find People
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {conversations.map((conv) => (
              <Link
                key={conv.user.id}
                to={`/messages/${conv.user.id}`}
                className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={conv.user.avatar || `https://ui-avatars.com/api/?name=${conv.user.fullName}&background=random&size=128`}
                    alt={conv.user.username}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  {onlineUsers.includes(conv.user.id) && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[15px] font-semibold ${conv.unreadCount > 0 ? "text-gray-900" : "text-gray-600"}`}>
                      {conv.user.fullName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {timeAgo(conv.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1">
                    <p className="text-xs text-gray-400">@{conv.user.username}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {conv.lastMessage.storyImage && (
                      <img src={conv.lastMessage.storyImage} alt="" className="h-5 w-5 rounded object-cover" />
                    )}
                    <p className={`truncate text-sm ${conv.unreadCount > 0 ? "font-medium text-gray-800" : "text-gray-500"}`}>
                      {conv.lastMessage.storyImage ? "Replied to story: " : ""}
                      {conv.lastMessage.text}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <BottomNav
        username={user?.username ?? ""}
        avatar={user?.avatar}
        onCreatePost={() => {}}
        unreadMessages={totalUnread}
      />
    </div>
  );
}
