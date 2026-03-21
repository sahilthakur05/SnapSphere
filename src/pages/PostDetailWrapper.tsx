import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleBookmark } from "../features/saved/savedSlice";
import { deleteComment, editComment } from "../features/post/postSlice";
import {
  fetchPostById,
  toggleLikeSingle,
  addCommentSingle,
  clearSinglePost,
  deletePost,
  fetchPostLikes,
} from "../features/post/postSlice";
import { PostDetailPage } from "./PostDetailPage";
import { LikesListModal } from "../components/LikesListModal";

export function PostDetailWrapper() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { singlePost, singlePostLoading } = useAppSelector(
    (state) => state.posts,
  );
  const { savedPostIds } = useAppSelector((state) => state.saved);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { likeUsers, likeUsersLoading } = useAppSelector(
    (state) => state.posts,
  );
  const [showLikesModal, setShowLikesModal] = useState(false);
  useEffect(() => {
    if (postId) dispatch(fetchPostById(postId));
    return () => {
      dispatch(clearSinglePost());
    };
  }, [postId, dispatch]);
  const handleShowLikes = (postId: string) => {
    dispatch(fetchPostLikes(postId));
    setShowLikesModal(true);
  };
  return (
    <>
      <PostDetailPage
        post={singlePost}
        isLoading={singlePostLoading}
        currentUserId={currentUser?.id ?? ""}
        onLike={(id) => dispatch(toggleLikeSingle(id))}
        onComment={(id, text) =>
          dispatch(addCommentSingle({ postId: id, text }))
        }
        onBack={() => navigate(-1)}
        onToggleSave={(id) => dispatch(toggleBookmark(id))}
        isSaved={singlePost ? savedPostIds.includes(singlePost.id) : false}
        onDelete={(id) => {
          dispatch(deletePost(id));
          navigate(-1);
        }}
        onShowLikes={handleShowLikes}
        onDeleteComment={(postId, commentId) =>
          dispatch(deleteComment({ postId, commentId }))
        }
        onEditComment={(postId, commentId, text) =>
          dispatch(editComment({ postId, commentId, text }))
        }
      />
      <LikesListModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        users={likeUsers}
        isLoading={likeUsersLoading}
      />
    </>
  );
}
