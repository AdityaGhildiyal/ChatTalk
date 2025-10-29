"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { MdOutlineGroupAdd } from "react-icons/md";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

export default function ConversationList({ initialItems, users }: ConversationListProps) {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => session.data?.user?.email, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) return current;
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((c) => (c.id === conversation.id ? { ...c, messages: conversation.messages } : c))
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => current.filter((c) => c.id !== conversation.id));
      if (conversationId === conversation.id) router.push("/conversations");
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind_all();
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <aside
        className={clsx(
          "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block",
          "w-full left-0 overflow-y-auto",
          "bg-black/95 backdrop-blur-xl border-r border-neutral-800",
          isOpen ? "hidden" : "block"
        )}
      >
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Messages</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModalOpen(true)}
              className="p-2.5 rounded-full bg-cyan-600 text-white shadow-lg hover:bg-cyan-700 transition"
            >
              <MdOutlineGroupAdd size={20} />
            </motion.button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <ConversationBox data={item} selected={conversationId === item.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
}