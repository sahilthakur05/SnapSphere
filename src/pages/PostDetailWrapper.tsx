import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPostById,
  toggleLikeSingle,
  addCommentSingle,
  clearSinglePost,
} from "../features/post/postSlice";
import { PostDetailPage } from "./PostDetailPage";

export function PostDetailWrapper() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { singlePost, singlePostLoading } = useAppSelector(
    (state) => state.posts,
  );
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (postId) dispatch(fetchPostById(postId));
    return () => {
      dispatch(clearSinglePost());
    };
  }, [postId, dispatch]);

  return (
    <PostDetailPage
      post={singlePost}
      isLoading={singlePostLoading}
      currentUserId={currentUser?.id ?? ""}
      onLike={(id) => dispatch(toggleLikeSingle(id))}
      onComment={(id, text) =>
        dispatch(addCommentSingle({ postId: id, text }))
      }
      onBack={() => navigate(-1)}
    />
  );
}
