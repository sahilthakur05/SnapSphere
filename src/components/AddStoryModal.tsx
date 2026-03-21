import { useRef, useState, type ChangeEvent } from "react";
import { X, ImagePlus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  isSubmitting: boolean;
}

export function AddStoryModal({ isOpen, onClose, onSubmit, isSubmitting }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!file) return;
    onSubmit(file);
    setPreview(null);
    setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Add Story</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Story preview"
                className="w-full rounded-lg object-cover max-h-96"
              />
              <button
                onClick={() => { setPreview(null); setFile(null); }}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-16 text-gray-400 hover:border-brand-500 hover:text-brand-500"
            >
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm">Click to upload an image</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {isSubmitting ? "Uploading…" : "Share Story"}
          </button>
        </div>
      </div>
    </div>
  );
}
