import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { searchUsers, fetchExplorePosts } from '../features/search/searchSlice';
import { followUser } from '../features/suggestion/suggestionSlice';
import { logout } from '../features/auth/authSlice';
import { Navbar } from '../components/Navbar';
import { Search, Loader2 } from 'lucide-react';
import { ExploreGrid } from '../components/ExploreGrid';
import { UserCard } from '../components/UserCard';

export function ExplorePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { results, isLoading, explorePosts, exploreLoading } = useAppSelector((state) => state.search);
  const [query, setQuery] = useState('');

  useEffect(() => {
    dispatch(fetchExplorePosts());
  }, [dispatch]);

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

        {/* Search results or Explore grid */}
        {query.trim().length >= 2 ? (
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              results.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  currentUserId={authUser?.id ?? ""}
                  onFollow={(id) => dispatch(followUser(id))}
                />
              ))
            )}
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-500">Discover</h2>
            <ExploreGrid posts={explorePosts} isLoading={exploreLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
