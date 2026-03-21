export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Profile header */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="h-24 w-24 shrink-0 rounded-full bg-gray-200" />

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-5 w-32 rounded bg-gray-200" />
              <div className="h-8 w-24 rounded-lg bg-gray-200" />
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="h-4 w-16 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div className="mx-auto max-w-2xl border-t border-gray-200 px-4 pt-4">
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
