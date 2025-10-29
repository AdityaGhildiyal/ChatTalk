'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { motion } from "framer-motion";

import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

export default function ConversationBox({ data, selected }: ConversationBoxProps) {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => data.messages?.[data.messages.length - 1], [data.messages]);

  const userEmail = session.data?.user?.email;
  const hasSeen = useMemo(() => {
    if (!lastMessage || !userEmail) return false;
    return (lastMessage.seen || []).some((user) => user.email === userEmail);
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image";
    if (lastMessage?.body) return lastMessage.body;
    return "Start a conversation";
  }, [lastMessage]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={clsx(
        "relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200",
        "bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50",
        selected
          ? "bg-cyan-600/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
          : "hover:bg-neutral-700/60 hover:border-neutral-600"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {data.isGroup ? <AvatarGroup users={data.users} size="sm" /> : <Avatar user={otherUser} size={48} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-white truncate">
            {data.name || otherUser.name}
          </p>
          {lastMessage?.createdAt && (
            <span className="text-xs text-neutral-400">
              {format(new Date(lastMessage.createdAt), "p")}
            </span>
          )}
        </div>
        <p
          className={clsx(
            "text-sm truncate",
            hasSeen ? "text-neutral-500" : "text-neutral-300 font-medium"
          )}
        >
          {lastMessageText}
        </p>
      </div>

      {/* Unread indicator */}
      {!hasSeen && lastMessage && (
        <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse" />
      )}
    </motion.div>
  );
}