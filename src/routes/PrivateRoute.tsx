import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
