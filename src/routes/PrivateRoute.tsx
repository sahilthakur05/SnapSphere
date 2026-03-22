import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { useSocketListeners } from "../hooks/useSocketListeners";

export function PrivateRoute() {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      connectSocket(user.id);
    }
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user?.id]);

  // Listen for socket events
  useSocketListeners();

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
