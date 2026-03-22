import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Spinner } from "./Spinner";

interface ExplorePost {
  id: string;
  image: string;
  likes: string[];
}

interface Props {
  posts: ExplorePost[];
  isLoading: boolean;
}

export function ExploreGrid({ posts, isLoading }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        <p className="text-sm">No posts to explore yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, idx) => {
        // Every 5th item spans 2 rows and 2 cols for a mosaic effect
        const isLarge = idx % 10 === 0 || idx % 10 === 6;

        return (
          <div
            key={post.id}
            className={`group relative cursor-pointer overflow-hidden ${
              isLarge ? "col-span-2 row-span-2" : ""
            }`}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <img
              src={post.image}
              alt="Explore"
              className="h-full w-full object-cover aspect-square transition-opacity group-hover:opacity-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow-lg">
                <Heart className="h-5 w-5 fill-white" />
                {post.likes?.length ?? 0}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
