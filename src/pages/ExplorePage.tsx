import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { searchUsers } from '../features/search/searchSlice';
import { logout } from '../features/auth/authSlice';
import { Navbar } from '../components/Navbar';
import { Search, Loader2 } from 'lucide-react';

export function ExplorePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { results, isLoading } = useAppSelector((state) => state.search);
  const [query, setQuery] = useState('');

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      dispatch(searchUsers(value.trim()));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        username={authUser?.username ?? ''}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate('/')}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Results */}
        <div className="mt-4 space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : query.trim().length < 2 ? (
            <div className="py-10 text-center text-gray-400">
              <p className="text-sm">Type at least 2 characters to search</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            results.map((user) => (
              <Link
                key={user.id}
                to={`/profile/${user.username}`}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:bg-gray-50"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="h-11 w-11 rounded-full object-cover" />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.fullName}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
