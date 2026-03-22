import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchMessages,
  sendMessage,
  clearCurrentChat,
} from "../features/message/messageSlice";
import { timeAgo } from "../lib/timeAgo";
import { ArrowLeft, Send, Image } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export default function ChatPage() {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const { currentChat, chatLoading } = useAppSelector((s) => s.messages);
  const currentUser = useAppSelector((s) => s.auth.user);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const partner = currentChat.user;
  usePageTitle(partner ? `Chat with ${partner.fullName}` : "Chat");

  useEffect(() => {
    if (userId) dispatch(fetchMessages(userId));
    return () => {
      dispatch(clearCurrentChat());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat.messages]);

  const handleSend = () => {
    if (!text.trim() || !userId) return;
    dispatch(sendMessage({ recipientId: userId, text: text.trim() }));
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (chatLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
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
            <img
              src={partner.avatar || `https://ui-avatars.com/api/?name=${partner.fullName}&background=random&size=128`}
              alt={partner.username}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div>
              <p className="text-sm font-bold text-gray-900">{partner.fullName}</p>
              <p className="text-xs text-gray-400">@{partner.username}</p>
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
                          ? "rounded-br-md bg-blue-500 text-white"
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
                          <div className={`flex items-center gap-1 px-2 py-1 text-[10px] ${isOwn ? "bg-blue-600 text-blue-100" : "bg-gray-50 text-gray-400"}`}>
                            <Image size={10} />
                            Replied to story
                          </div>
                        </div>
                      )}
                      <p className="text-[14px] leading-relaxed">{msg.text}</p>
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

      {/* Input */}
      <div className="sticky bottom-0 border-t bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-100"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-blue-500"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
