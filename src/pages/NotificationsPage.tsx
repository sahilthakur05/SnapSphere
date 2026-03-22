import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchNotifications, markAllRead } from '../features/notification/notificationSlice';
import { logout } from '../features/auth/authSlice';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Spinner } from '../components/Spinner';
import type { Notification } from '../features/notification/notificationSlice';
import { timeAgo } from '../lib/timeAgo';
import { usePageTitle } from '../hooks/usePageTitle';

function NotificationIcon({ type }: { type: Notification['type'] }) {
  switch (type) {
    case 'like':
    case 'story_like':
      return <Heart className="h-5 w-5 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-5 w-5 text-brand-500" />;
    case 'follow':
      return <UserPlus className="h-5 w-5 text-green-500" />;
  }
}

function notificationText(n: Notification) {
  switch (n.type) {
    case 'like':
      return 'liked your post';
    case 'story_like':
      return 'liked your story';
    case 'comment':
      return 'commented on your post';
    case 'follow':
      return 'started following you';
  }
}

export function NotificationsPage() {
  usePageTitle("Notifications");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { notifications, isLoading } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(markAllRead());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <Navbar
        username={authUser?.username ?? ''}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate('/')}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Notifications</h2>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, index) => {
              const href = (n.type === 'follow' || n.type === 'story_like')
                ? `/profile/${n.sender.username}`
                : n.postId
                  ? `/post/${n.postId}`
                  : `/profile/${n.sender.username}`;

              return (
                <Link
                  key={n.id}
                  to={href}
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'both' }}
                  className={`animate-slide-up flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    n.read
                      ? 'border-gray-100 bg-white'
                      : 'border-brand-100 bg-brand-50'
                  } hover:bg-gray-50`}
                >
                  {/* Sender avatar */}
                  {n.sender.avatar ? (
                    <img src={n.sender.avatar} alt={n.sender.username} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                      {n.sender.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{n.sender.username}</span>{' '}
                      {notificationText(n)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Story thumbnail or icon */}
                  {n.storyImage ? (
                    <img src={n.storyImage} alt="Story" className="h-11 w-11 rounded-lg object-cover" />
                  ) : (
                    <NotificationIcon type={n.type} />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav
        username={authUser?.username ?? ''}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate('/')}
        unreadCount={0}
      />
    </div>
  );
}
