import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../app/hooks";
import {
  receiveMessage,
  messageSentViaSocket,
  updateTypingStatus,
  updateOnlineUsers,
  markMessagesAsRead,
  type Message,
} from "../features/message/messageSlice";

export function useSocketListeners() {
  const dispatch = useAppDispatch();
  const [connected, setConnected] = useState(false);

  // Poll for socket availability with a reasonable interval and max attempts
  useEffect(() => {
    let attempts = 0;
    const MAX_ATTEMPTS = 50; // stop after 50 tries (5 seconds)

    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }

    const check = setInterval(() => {
      attempts++;
      const s = getSocket();
      if (s) {
        setConnected(s.connected);
        s.off("connect", onConnect);
        s.off("disconnect", onDisconnect);
        s.on("connect", onConnect);
        s.on("disconnect", onDisconnect);
        clearInterval(check);
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(check);
      }
    }, 100);

    return () => {
      clearInterval(check);
      const s = getSocket();
      if (s) {
        s.off("connect", onConnect);
        s.off("disconnect", onDisconnect);
      }
    };
  }, []);

  // Register event listeners whenever socket is available
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (message: Message & { fromUserId?: string }) => {
      dispatch(receiveMessage(message));
    };

    const onMessageSent = (message: Message) => {
      dispatch(messageSentViaSocket(message));
    };

    const onUserTyping = ({ userId }: { userId: string }) => {
      dispatch(updateTypingStatus({ userId, typing: true }));
    };

    const onUserStopTyping = ({ userId }: { userId: string }) => {
      dispatch(updateTypingStatus({ userId, typing: false }));
    };

    const onOnlineUsers = (userIds: string[]) => {
      dispatch(updateOnlineUsers(userIds));
    };

    const onMessagesRead = (data: { readBy: string }) => {
      dispatch(markMessagesAsRead(data));
    };

    socket.on("newMessage", onNewMessage);
    socket.on("messageSent", onMessageSent);
    socket.on("userTyping", onUserTyping);
    socket.on("userStopTyping", onUserStopTyping);
    socket.on("onlineUsers", onOnlineUsers);
    socket.on("messagesRead", onMessagesRead);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("messageSent", onMessageSent);
      socket.off("userTyping", onUserTyping);
      socket.off("userStopTyping", onUserStopTyping);
      socket.off("onlineUsers", onOnlineUsers);
      socket.off("messagesRead", onMessagesRead);
    };
  }, [dispatch, connected]);
}
