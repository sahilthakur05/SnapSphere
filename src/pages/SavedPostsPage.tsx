import { Link } from "react-router-dom";
import { Bookmark, Heart } from "lucide-react";
import { Spinner } from "../components/Spinner";
import type { Post } from "../features/post/postSlice";

interface Props {
  posts: Post[];
  isLoading: boolean;
}

export function SavedPostsPage({ posts, isLoading }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Page header */}
      <div className="mb-6 flex items-center gap-2">
        <Bookmark className="h-5 w-5 text-gray-900" />
        <h1 className="text-xl font-semibold text-gray-900">Saved Posts</h1>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && posts.length === 0 && (
        <div className="py-20 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-3 text-sm text-gray-400">No saved posts yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Tap the bookmark icon on any post to save it here.
          </p>
        </div>
      )}

      {/* Posts grid */}
      {!isLoading && posts.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={post.image}
                alt="Saved post"
                className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow-lg">
                  <Heart className="h-5 w-5 fill-white" />
                  {post.likes.length}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
