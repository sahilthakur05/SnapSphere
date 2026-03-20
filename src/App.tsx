import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { loadUser } from "./features/auth/authSlice";
import { fetchSavedPosts } from "./features/saved/savedSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUser());
    dispatch(fetchSavedPosts())
  }, [dispatch]);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
