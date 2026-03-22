import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { X, Camera } from 'lucide-react';
import { ButtonSpinner } from './Spinner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentFullName: string;
  currentAvatar: string;
  currentBio: string;
  onSave: (formData: FormData) => void;
  isSaving: boolean;
}

export function EditProfileModal({ isOpen, onClose, currentFullName, currentAvatar, currentBio, onSave, isSaving }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(currentFullName);
  const [bio, setBio] = useState(currentBio);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [fileError, setFileError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFileError(null);
    if (selected.size > 5 * 1024 * 1024) {
      setFileError("Image must be under 5MB");
      return;
    }
    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(selected.type)) {
      setFileError("Only JPEG, PNG, GIF, and WebP are allowed");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setNameError(null);
    if (!fullName.trim()) {
      setNameError("Full name is required");
      return;
    }
    const formData = new FormData();
    formData.append('fullName', fullName.trim());
    formData.append('bio', bio);
    if (file) formData.append('avatar', file);
    onSave(formData);
  };

  if (!isOpen) return null;

  const avatarSrc = preview || currentAvatar;

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="animate-slide-up w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-2 border-gray-200" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-3xl font-bold text-brand-600">
                  {fullName.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white shadow hover:bg-brand-600"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {fileError && <p className="text-sm text-red-500">{fileError}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setNameError(null); }}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 ${nameError ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-brand-500 focus:ring-brand-500"}`}
            />
            {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself…"
              rows={3}
              maxLength={150}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            <p className="mt-1 text-right text-xs text-gray-400">{bio.length}/150</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {isSaving ? <ButtonSpinner /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
