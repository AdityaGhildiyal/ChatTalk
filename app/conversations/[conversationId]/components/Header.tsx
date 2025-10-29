'use client';

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@/app/generated/prisma";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & { users: User[] };
}

export default function Header({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.includes(otherUser?.email || "");

  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`;
    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  return (
    <>
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/conversations" className="lg:hidden text-cyan-400 hover:text-cyan-300">
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} size="md" />
          ) : (
            <Avatar user={otherUser} size={48} />
          )}
          <div>
            <div className="font-semibold text-white">
              {conversation.name || otherUser.name}
            </div>
            <div className="text-sm text-neutral-400">{statusText}</div>
          </div>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-full text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition"
        >
          <HiEllipsisHorizontal size={32} />
        </button>
      </div>
    </>
  );
}