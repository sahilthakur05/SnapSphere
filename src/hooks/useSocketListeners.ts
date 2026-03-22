import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../app/hooks";
import {
  receiveMessage,
  messageSentViaSocket,
  updateTypingStatus,
  updateOnlineUsers,
  markMessagesAsRead,
} from "../features/message/messageSlice";

export function useSocketListeners() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (message: any) => {
      dispatch(receiveMessage(message));
    };

    const onMessageSent = (message: any) => {
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
  }, [dispatch]);
}
