'use client';

import Image from "next/image";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import clsx from "clsx";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@/app/components/Avatar";
import useActiveList from "@/app/hooks/useActiveList";
import { FullMessageType } from "@/app/types";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

export default function MessageBox({ data, isLast }: MessageBoxProps) {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState<string>(data.body || "");
  const { members } = useActiveList();

  const bubbleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((u) => u.email !== data?.sender?.email)
    .map((u) => u.name)
    .join(', ');
  const isSenderActive = data.sender?.email ? members.includes(data.sender.email) : false;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!bubbleRef.current) return;

    const rect = bubbleRef.current.getBoundingClientRect();
    const menuWidth = 144; 
    const menuHeightEstimate = 120; 

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top = rect.bottom + window.scrollY + 8; 
    let left = isOwn
      ? rect.right + window.scrollX - menuWidth
      : rect.left + window.scrollX;

    if (spaceBelow < menuHeightEstimate && spaceAbove > spaceBelow) {
      top = rect.top + window.scrollY - menuHeightEstimate - 8;
    }

    if (left < 16) left = 16;
    if (left + menuWidth > window.innerWidth - 16) {
      left = window.innerWidth - menuWidth - 16;
    }

    setMenuPosition({ x: left, y: top });
    setMenuOpen(true);
  };

  const handleCopy = async () => {
    const textToCopy = data.body || data.image || "";
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    } finally {
      setMenuOpen(false);
    }
  };

  const startEdit = () => {
    if (!isOwn || !data.body) return;
    setEditText(data.body);
    setIsEditing(true);
    setMenuOpen(false);
  };

  const saveEdit = async () => {
    const nextBody = editText.trim();
    if (!nextBody) {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: data.id, body: nextBody })
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Message updated');
      (data as any).body = nextBody;
      setIsEditing(false);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={clsx(
          "flex items-end gap-3 py-2.5 px-4 group/message",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div className={clsx("flex-shrink-0 relative", isOwn && "order-3")}>
          <Avatar user={data.sender} size={40} />
          {isSenderActive && (
            <>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black animate-ping opacity-75" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black" />
            </>
          )}
        </div>

        {/* Message Content */}
        <div
          className={clsx(
            "flex flex-col max-w-[70%]",
            isOwn ? "items-end mr-2" : "items-start ml-2"
          )}
        >
          {/* Header */}
          {isOwn ? (
            <>
              <div className="text-xs text-neutral-300 font-medium mb-0.5">
                {data.sender.name}
              </div>
              <div className="text-xs text-neutral-400 mb-1">
                {format(new Date(data.createdAt), "MMM d, yyyy h:mm a")}
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-2 text-xs text-neutral-400 mb-1">
              <span className="font-medium text-neutral-300">{data.sender.name}</span>
              <span>{format(new Date(data.createdAt), "MMM d, yyyy h:mm a")}</span>
            </div>
          )}

          {/* Bubble */}
          <motion.div
            ref={bubbleRef}
            whileHover={{ scale: 1.02 }}
            className={clsx(
              "relative rounded-3xl px-4 py-2.5 text-sm break-words",
              "backdrop-blur-md border border-neutral-800/50 shadow-lg",
              isOwn
                ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-none"
                : "bg-neutral-800/90 text-neutral-100 rounded-tl-none"
            )}
            onContextMenu={openMenu}
            onClick={(e) => e.button === 2 && openMenu(e)} // Optional: right-click
          >
            {/* Editing Mode */}
            {isEditing ? (
              <div className="w-full">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={clsx(
                    "w-full resize-none rounded-lg bg-transparent p-0 outline-none",
                    "text-inherit placeholder-neutral-400 appearance-none",
                    "border-0 ring-0 focus:ring-0 focus:border-0 shadow-none",
                    isOwn ? "caret-white" : "caret-cyan-300"
                  )}
                  rows={3}
                  autoFocus
                />
                <div className={clsx("mt-2 flex gap-2", isOwn ? "justify-end" : "justify-start")}>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs rounded-md border border-neutral-600/60 text-neutral-300 bg-transparent hover:bg-neutral-800/40"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className={clsx(
                      "px-3 py-1.5 text-xs rounded-md text-white",
                      isOwn
                        ? "bg-white/15 hover:bg-white/25"
                        : "bg-cyan-600/80 hover:bg-cyan-600"
                    )}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : data.image ? (
              <div className="relative overflow-hidden rounded-xl">
                <ImageModal
                  src={data.image}
                  isOpen={imageModalOpen}
                  onClose={() => setImageModalOpen(false)}
                />
                <Image
                  src={data.image}
                  alt="Sent"
                  width={260}
                  height={260}
                  className="rounded-xl object-cover cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => setImageModalOpen(true)}
                />
              </div>
            ) : (
              <div className="leading-relaxed">{data.body}</div>
            )}

            {/* Hover Glow */}
            <div
              className={clsx(
                "absolute inset-0 rounded-3xl bg-cyan-500/10 opacity-0 group-hover/message:opacity-100 transition-opacity pointer-events-none",
                isOwn ? "-right-1 -top-1" : "-left-1 -top-1"
              )}
            />
          </motion.div>

          {/* Seen By */}
          {isLast && isOwn && seenList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-neutral-500 mt-1"
            >
              Seen by {seenList}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Context Menu Portal */}
      {menuOpen && menuPosition && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] w-36 overflow-hidden rounded-md border border-neutral-800/60 bg-black/90 backdrop-blur-xl shadow-xl"
          style={{
            top: menuPosition.y,
            left: menuPosition.x,
          }}
        >
          <button
            className="w-full px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800/70 transition-colors"
            onClick={handleCopy}
          >
            Copy
          </button>
          {isOwn && !!data.body && (
            <button
              className="w-full px-3 py-2 text-left text-neutral-200 hover:bg-neutral-800/70 transition-colors"
              onClick={startEdit}
            >
              Edit
            </button>
          )}
          {isOwn && (
            <button
              className="w-full px-3 py-2 text-left text-red-400 hover:bg-neutral-800/70 transition-colors"
              onClick={async () => {
                try {
                  const res = await fetch('/api/messages', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageId: data.id })
                  });
                  if (!res.ok) throw new Error('Failed');
                  toast.success('Message deleted');
                } catch {
                  toast.error('Failed to delete');
                } finally {
                  setMenuOpen(false);
                }
              }}
            >
              Delete
            </button>
          )}
        </div>,
        document.body
      )}
    </>
  );
}