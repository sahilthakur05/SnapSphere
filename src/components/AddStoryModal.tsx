import { useRef, useState, type ChangeEvent } from "react";
import { X, ImagePlus, Type, Smile, AtSign } from "lucide-react";

const EMOJI_LIST = ["😀", "😂", "😍", "🔥", "❤️", "👏", "🎉", "🤩", "😎", "💯", "🌟", "✨", "🙌", "💪", "🥳", "😇", "🤗", "💕", "🌈", "☕"];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, caption: string) => void;
  isSubmitting: boolean;
}

export function AddStoryModal({ isOpen, onClose, onSubmit, isSubmitting }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionHint, setShowMentionHint] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = () => {
    if (!file) return;
    onSubmit(file, caption);
    setPreview(null);
    setFile(null);
    setCaption("");
    setShowTextInput(false);
  };

  const insertEmoji = (emoji: string) => {
    setCaption((prev) => prev + emoji);
    setShowEmojiPicker(false);
    captionRef.current?.focus();
  };

  const insertMention = () => {
    setCaption((prev) => prev + "@");
    setShowMentionHint(true);
    setShowTextInput(true);
    setTimeout(() => captionRef.current?.focus(), 50);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-lg sm:max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Add Story</h2>
          <button onClick={() => { onClose(); setPreview(null); setFile(null); setCaption(""); setShowTextInput(false); }} className="text-gray-500 hover:text-gray-700">
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
              {/* Caption overlay preview */}
              {caption && (
                <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                  <p className="rounded-lg bg-black/40 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
                    {caption}
                  </p>
                </div>
              )}
              <button
                onClick={() => { setPreview(null); setFile(null); setCaption(""); setShowTextInput(false); }}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Toolbar */}
              <div className="absolute left-2 top-2 flex gap-2">
                <button
                  onClick={() => { setShowTextInput(!showTextInput); setShowEmojiPicker(false); }}
                  className={`rounded-full p-2 text-white backdrop-blur-sm ${showTextInput ? "bg-brand-500" : "bg-black/50 hover:bg-black/70"}`}
                  title="Add text"
                >
                  <Type className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowTextInput(false); }}
                  className={`rounded-full p-2 text-white backdrop-blur-sm ${showEmojiPicker ? "bg-brand-500" : "bg-black/50 hover:bg-black/70"}`}
                  title="Add emoji"
                >
                  <Smile className="h-4 w-4" />
                </button>
                <button
                  onClick={insertMention}
                  className="rounded-full bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
                  title="Mention someone"
                >
                  <AtSign className="h-4 w-4" />
                </button>
              </div>
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

          {/* Emoji picker */}
          {showEmojiPicker && preview && (
            <div className="grid grid-cols-10 gap-1 rounded-lg border border-gray-200 p-2">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100 text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Text input */}
          {showTextInput && preview && (
            <div>
              <textarea
                ref={captionRef}
                value={caption}
                onChange={(e) => {
                  setCaption(e.target.value);
                  setShowMentionHint(e.target.value.endsWith("@"));
                }}
                placeholder="Add caption, #hashtag or @mention..."
                rows={2}
                maxLength={200}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-400">{caption.length}/200</p>
                {showMentionHint && (
                  <p className="text-xs text-brand-500">Type a username after @</p>
                )}
              </div>
            </div>
          )}

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
