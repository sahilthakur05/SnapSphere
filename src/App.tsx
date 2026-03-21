import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authSlice";
import { fetchSavedPosts } from "./features/saved/savedSlice";
import { TopLoadingBar } from "./components/TopLoadingBar";

function App() {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector((s) => s.auth.isLoading);
  const postsLoading = useAppSelector((s) => s.posts.isLoading);
  const isLoading = authLoading || postsLoading;

  useEffect(() => {
    dispatch(loadUser());
    dispatch(fetchSavedPosts())
  }, [dispatch]);
  return (
    <BrowserRouter>
      <TopLoadingBar isLoading={isLoading} />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
