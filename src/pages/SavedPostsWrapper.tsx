import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchSavedPosts } from '../features/saved/savedSlice';
import { Navbar } from '../components/Navbar';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { SavedPostsPage } from './SavedPostsPage';

export function SavedPostsWrapper() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { savedPosts, isLoading } = useAppSelector((state) => state.saved);

  useEffect(() => {
    dispatch(fetchSavedPosts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        username={user?.username ?? ''}
        avatar={user?.avatar}
        onCreatePost={() => navigate('/')}
        onLogout={() => dispatch(logout())}
      />
      <SavedPostsPage posts={savedPosts} isLoading={isLoading} />
    </div>
  );
}