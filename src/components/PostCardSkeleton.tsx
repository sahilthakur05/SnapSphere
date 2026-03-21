export function PostCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="h-9 w-9 rounded-full bg-gray-200" />
        <div className="space-y-1.5">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-2.5 w-16 rounded bg-gray-200" />
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square w-full bg-gray-200" />

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <div className="h-6 w-6 rounded bg-gray-200" />
        <div className="h-6 w-6 rounded bg-gray-200" />
        <div className="h-6 w-6 rounded bg-gray-200" />
        <div className="ml-auto h-6 w-6 rounded bg-gray-200" />
      </div>

      {/* Likes */}
      <div className="px-4 pt-2">
        <div className="h-3 w-16 rounded bg-gray-200" />
      </div>

      {/* Caption */}
      <div className="space-y-1.5 px-4 pt-2 pb-3">
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  );
}
