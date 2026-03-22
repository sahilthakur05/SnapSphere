import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchMessages,
  clearCurrentChat,
} from "../features/message/messageSlice";
import { getSocket } from "../lib/socket";
import { timeAgo } from "../lib/timeAgo";
import { ArrowLeft, Send, Image, Smile, Paperclip, X } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { currentChat, chatLoading, typingUsers, onlineUsers } = useAppSelector((s) => s.messages);
  const currentUser = useAppSelector((s) => s.auth.user);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSendingImage, setIsSendingImage] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { toast, showToast, hideToast } = useToast();

  const partner = currentChat.user;
  const isPartnerOnline = userId ? onlineUsers.includes(userId) : false;
  const isPartnerTyping = userId ? typingUsers[userId] : false;
  usePageTitle(partner ? `Chat with ${partner.fullName}` : "Chat");

  useEffect(() => {
    if (userId) {
      dispatch(fetchMessages(userId));
      getSocket()?.emit("markRead", { senderId: userId });
    }
    return () => {
      dispatch(clearCurrentChat());
      // Clean up any blob URL to prevent memory leak
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [dispatch, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat.messages]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Send text message via socket
  const handleSend = useCallback(() => {
    if ((!text.trim() && !imagePreview) || !userId) return;
    const socket = getSocket();
    if (!socket) return;

    if (imagePreview && imageFile) {
      // Send image message
      setIsSendingImage(true);
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("sendImage", {
          recipientId: userId,
          imageData: reader.result as string,
          text: text.trim(),
        });
        socket.emit("stopTyping", { recipientId: userId });
        setText("");
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setImageFile(null);
        setIsSendingImage(false);
        inputRef.current?.focus();
      };
      reader.readAsDataURL(imageFile);
    } else {
      // Send text message
      socket.emit("sendMessage", { recipientId: userId, text: text.trim() });
      socket.emit("stopTyping", { recipientId: userId });
      setText("");
      inputRef.current?.focus();
    }
  }, [text, userId, imagePreview, imageFile]);

  // Typing indicator — stop after idle period
  const TYPING_TIMEOUT_MS = 1500;
  const handleInputChange = (value: string) => {
    setText(value);
    const socket = getSocket();
    if (!socket || !userId) return;

    socket.emit("typing", { recipientId: userId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { recipientId: userId });
    }, TYPING_TIMEOUT_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Only image files are supported", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be under 5MB", "error");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Reset file input so the same file can be re-selected
    e.target.value = "";
  };

  const clearImagePreview = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
  };

  if (chatLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b bg-white px-4 py-3 shadow-sm">
        <Link
          to="/messages"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>
        {partner && (
          <Link to={`/profile/${partner.username}`} className="flex items-center gap-3">
            <div className="relative">
              <img
                src={partner.avatar || `https://ui-avatars.com/api/?name=${partner.fullName}&background=random&size=128`}
                alt={partner.username}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
              />
              {isPartnerOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{partner.fullName}</p>
              <p className="text-xs text-gray-400">
                {isPartnerTyping ? (
                  <span className="text-brand-500">typing...</span>
                ) : isPartnerOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  `@${partner.username}`
                )}
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {currentChat.messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            {partner && (
              <>
                <img
                  src={partner.avatar || `https://ui-avatars.com/api/?name=${partner.fullName}&background=random&size=128`}
                  alt={partner.username}
                  className="mb-3 h-16 w-16 rounded-full object-cover"
                />
                <p className="text-sm font-semibold text-gray-700">{partner.fullName}</p>
                <p className="text-xs text-gray-400">@{partner.username}</p>
                <p className="mt-3 text-sm text-gray-400">Send a message to start the conversation</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {currentChat.messages.map((msg, i) => {
              const isOwn = msg.senderId === currentUser?.id;
              const prevMsg = currentChat.messages[i - 1];
              const showDate = !prevMsg || new Date(msg.createdAt).toDateString() !== new Date(prevMsg.createdAt).toDateString();

              return (
                <div key={msg.id}>
                  {showDate && (
                    <div className="my-4 flex items-center justify-center">
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-medium text-gray-500">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        isOwn
                          ? "rounded-br-md bg-brand-500 text-white"
                          : "rounded-bl-md bg-white text-gray-900"
                      }`}
                    >
                      {msg.storyImage && (
                        <div className={`mb-2 overflow-hidden rounded-lg border ${isOwn ? "border-blue-400" : "border-gray-200"}`}>
                          <img
                            src={msg.storyImage}
                            alt="Story"
                            className="h-28 w-24 object-cover"
                          />
                          <div className={`flex items-center gap-1 px-2 py-1 text-[10px] ${isOwn ? "bg-brand-600 text-brand-100" : "bg-gray-50 text-gray-400"}`}>
                            <Image size={10} />
                            Replied to story
                          </div>
                        </div>
                      )}
                      {msg.image && (
                        <div className="mb-2 overflow-hidden rounded-lg">
                          <img
                            src={msg.image}
                            alt="Shared image"
                            className="max-h-60 w-full cursor-pointer rounded-lg object-cover"
                            onClick={() => window.open(msg.image!, "_blank")}
                          />
                        </div>
                      )}
                      {msg.text && (
                        <p className="text-[14px] leading-relaxed break-words">{msg.text}</p>
                      )}
                      <p
                        className={`mt-1 text-right text-[10px] ${
                          isOwn ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {timeAgo(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="border-t bg-white px-4 py-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover border border-gray-200"
            />
            <button
              onClick={clearImagePreview}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-white shadow-sm hover:bg-gray-700"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-20">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={320}
            height={400}
          />
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 border-t bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:bg-gray-100 ${
              showEmojiPicker ? "text-brand-500" : "text-gray-400"
            }`}
            title="Emoji"
          >
            <Smile size={20} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            title="Attach image"
          >
            <Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-1 focus:ring-brand-100"
          />
          <button
            onClick={handleSend}
            disabled={(!text.trim() && !imagePreview) || isSendingImage}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-30 disabled:hover:bg-brand-500"
          >
            {isSendingImage ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
