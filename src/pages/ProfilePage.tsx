import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import { logout, deleteAccount } from "../features/auth/authSlice";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { Grid3X3, Heart, LogOut } from "lucide-react";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { EditProfileModal } from "../components/EditProfileModal";
import {
  clearFollowList,
  fetchFollowList,
  fetchProfile,
  followUser,
  updateProfile,
} from "../features/profile/profileSlice";
import { FollowListModal } from "../components/FollowListModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { DeleteAccountModal } from "../components/DeleteAccountModal";
import { changePassword } from "../features/auth/authSlice";
import { usePageTitle } from "../hooks/usePageTitle";

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  usePageTitle(username ? `${username}` : "Profile");
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
  const [showPasswordModal,setShowPasswordModal]=useState(false)
const [isChangingPassword, setIsChangingPassword] = useState(false);
const [passwordError, setPasswordError] = useState<string | null>(null);
const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
const [isDeletingAccount, setIsDeletingAccount] = useState(false);
const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null);

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
        <ProfileSkeleton />
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

  const handleChangePassword = async(data:{currentPassword:string;newPassword:string})=>{
    setPasswordError(null)
    setIsChangingPassword(true)
    const result = await dispatch(changePassword(data))
    setIsChangingPassword(false)
    if(changePassword.fulfilled.match(result)){
      setShowPasswordModal(false)
    }else{
      setPasswordError(result.payload as string)
    }
  }

  const handleDeleteAccount = async (password: string) => {
    setDeleteAccountError(null);
    setIsDeletingAccount(true);
    const result = await dispatch(deleteAccount(password));
    setIsDeletingAccount(false);
    if (deleteAccount.fulfilled.match(result)) {
      navigate("/login");
    } else {
      setDeleteAccountError(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      <Navbar
        username={authUser?.username ?? ""}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate("/")}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-2xl px-4 py-8">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="h-20 w-20 shrink-0 rounded-full object-cover border-2 border-gray-200 sm:h-24 sm:w-24"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600 sm:h-24 sm:w-24 sm:text-3xl">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 w-full text-center sm:text-left">
            <h1 className="text-xl font-semibold text-gray-900">
              {profile.username}
            </h1>

            {/* Action buttons */}
            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
                  >
                    Change Password
                  </button>
                </>
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

            <p className="mt-2 text-sm font-medium text-gray-800">{profile.fullName}</p>
            {profile.bio && (
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="mt-3 flex justify-center gap-6 sm:justify-start">
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
                <div
                  key={post.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow-lg">
                      <Heart className="h-5 w-5 fill-white" />
                      {post.likes?.length ?? 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Settings section (own profile only) */}
        {isOwnProfile && (
          <div className="mt-8 border-t border-gray-200 pt-6 space-y-6">
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>

            {/* Danger zone */}
            <div>
              <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
              <p className="mt-1 text-xs text-gray-500">
                Permanently delete your account and all associated data.
              </p>
              <button
                onClick={() => setShowDeleteAccountModal(true)}
                className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentFullName={profile.fullName}
          currentAvatar={profile.avatar}
          currentBio={profile.bio ?? ""}
          onSave={handleSaveProfile}
          isSaving={isSaving}
        />
        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordError(null);
          }}
          onSubmit={handleChangePassword}
          isSubmitting={isChangingPassword}
          error={passwordError}
        />
        <FollowListModal
          isOpen={followModalType !== null}
          onClose={handleCloseFollowList}
          title={followModalType ?? "Followers"}
          users={followList}
          isLoading={followListLoading}
        />
        <DeleteAccountModal
          isOpen={showDeleteAccountModal}
          onClose={() => { setShowDeleteAccountModal(false); setDeleteAccountError(null); }}
          onConfirm={handleDeleteAccount}
          isSubmitting={isDeletingAccount}
          error={deleteAccountError}
        />
      </main>
      <BottomNav
        username={authUser?.username ?? ""}
        avatar={authUser?.avatar}
        onCreatePost={() => navigate("/")}
      />
    </div>
  );
}
