import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  postImage: string;
  caption: string;
  onCaptionChange: (value: string) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function EditPostModal({
  isOpen,
  onClose,
  postImage,
  caption,
  onCaptionChange,
  onSave,
  isSubmitting,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Post image (read-only preview) */}
          <img
            src={postImage}
            alt="Post"
            className="w-full rounded-lg object-cover max-h-80"
          />

          {/* Caption */}
          <textarea
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
