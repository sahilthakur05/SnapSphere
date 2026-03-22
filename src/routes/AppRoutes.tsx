import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";
import { ExplorePage } from "../pages/ExplorePage";
import { NotificationsPage } from "../pages/NotificationsPage";
import { PostDetailWrapper } from "../pages/PostDetailWrapper";
import { SavedPostsWrapper } from "../pages/SavedPostsWrapper";
import { ForgotPasswordWrapper } from "../pages/ForgotPasswordWrapper";
import MessagesPage from "../pages/MessagesPage";
import ChatPage from "../pages/ChatPage";
export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes — redirect to home if already logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordWrapper />} />
      </Route>
      {/* Private routes — redirect to login if not logged in */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/post/:postId" element={<PostDetailWrapper />} />
        <Route path="/saved" element={<SavedPostsWrapper />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/:userId" element={<ChatPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
