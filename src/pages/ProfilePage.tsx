import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { logout } from "../features/auth/authSlice";
import { Navbar } from "../components/Navbar";
import { Grid3X3, Loader2 } from "lucide-react";
import { EditProfileModal } from "../components/EditProfileModal";
import {
  clearFollowList,
  fetchFollowList,
  fetchProfile,
  followUser,
  updateProfile,
} from "../features/profile/profileSlice";
import { FollowListModal } from "../components/FollowListModal";
export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: authUser } = useAppSelector((state) => state.auth);
  const { profile, posts, isLoading, followList, followListLoading } =
    useAppSelector((state) => state.profile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isOwnProfile = authUser?.username === username;
  const isFollowing = profile?.followers?.includes(authUser?.id ?? "") ?? false;
  const [followModalType, setFollowModalType] = useState<
    "Followers" | "Following" | null
  >(null);

  useEffect(() => {
    if (username) dispatch(fetchProfile(username));
  }, [dispatch, username]);

  const handleFollow = () => {
    if (profile) dispatch(followUser(profile.id));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleOpenFollowList = (type: "Followers" | "Following") => {
    if (!username) return;
    setFollowModalType(type);
    dispatch(
      fetchFollowList({
        username,
        type: type.toLowerCase() as "followers" | "following",
      }),
    );
  };
  const handleCloseFollowList = () => {
    setFollowModalType(null);
    dispatch(clearFollowList());
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          username={authUser?.username ?? ""}
          avatar={authUser?.avatar}
          onCreatePost={() => navigate("/")}
          onLogout={handleLogout}
        />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          username={authUser?.username ?? ""}
          avatar={authUser?.avatar}
          onCreatePost={() => navigate("/")}
          onLogout={handleLogout}
        />
        <div className="py-20 text-center text-gray-400">User not found</div>
      </div>
    );
  }
  const handleSaveProfile = async (formData: FormData) => {
    setIsSaving(true);
    await dispatch(updateProfile(formData));
    setIsSaving(false);
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        username={authUser?.username ?? ""}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Profile header */}
        <div className="flex items-center gap-8">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-600">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {profile.username}
              </h1>
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`rounded-lg px-4 py-1.5 text-sm font-semibold ${
                    isFollowing
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-brand-500 text-white hover:bg-brand-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-600">{profile.fullName}</p>

            {/* Stats */}
            <div className="mt-3 flex gap-6">
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {posts.length}
                </span>{" "}
                <span className="text-gray-500">posts</span>
              </div>
              <button
                onClick={() => handleOpenFollowList("Followers")}
                className="text-sm hover:underline"
              >
                <span className="font-semibold text-gray-900">
                  {profile.followers?.length ?? 0}
                </span>{" "}
                <span className="text-gray-500">followers</span>
              </button>
              <button
                onClick={() => handleOpenFollowList("Following")}
                className="text-sm hover:underline"
              >
                <span className="font-semibold text-gray-900">
                  {profile.following?.length ?? 0}
                </span>{" "}
                <span className="text-gray-500">following</span>
              </button>
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="mb-4 flex items-center justify-center gap-1 text-sm font-semibold text-gray-500">
            <Grid3X3 className="h-4 w-4" />
            POSTS
          </div>

          {posts.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <div key={post.id} className="aspect-square overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-full w-full object-cover hover:opacity-90 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentFullName={profile.fullName}
          currentAvatar={profile.avatar}
          onSave={handleSaveProfile}
          isSaving={isSaving}
        />
        <FollowListModal
          isOpen={followModalType !== null}
          onClose={handleCloseFollowList}
          title={followModalType ?? "Followers"}
          users={followList}
          isLoading={followListLoading}
        />
      </main>
    </div>
  );
}
