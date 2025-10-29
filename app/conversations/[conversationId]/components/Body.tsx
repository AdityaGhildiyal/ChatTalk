'use client';

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default function Body({ initialMessages }: BodyProps) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) return current;
        return [...current, message];
      });
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((msg) => (msg.id === newMessage.id ? newMessage : msg))
      );
    };

    const deleteMessageHandler = ({ id }: { id: string }) => {
      setMessages((current) => current.filter((m) => m.id !== id));
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);
    pusherClient.bind('message:delete', deleteMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
      pusherClient.unbind('message:delete', deleteMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 to-black/95 p-4">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          data={message}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-16" />
    </div>
  );
}