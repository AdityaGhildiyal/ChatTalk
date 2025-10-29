'use client';

import Image from "next/image";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import clsx from "clsx";
import { motion } from "framer-motion";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

export default function MessageBox({ data, isLast }: MessageBoxProps) {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((u) => u.email !== data?.sender?.email)
    .map((u) => u.name)
    .join(', ');

  return (
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
        {/* Online Pulse Dot */}
        <span
          className={clsx(
            "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black",
            "animate-ping opacity-75"
          )}
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-black" />
      </div>

      {/* Message Content */}
      <div
        className={clsx(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end mr-2" : "items-start ml-2"
        )}
      >
        {/* Name + Time */}
        <div className="flex items-baseline gap-2 text-xs text-neutral-400 mb-1">
          <span className="font-medium text-neutral-300">{data.sender.name}</span>
          <span>{format(new Date(data.createdAt), "h:mm a")}</span>
        </div>

        {/* Bubble */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={clsx(
            "relative rounded-3xl px-4 py-2.5 text-sm break-words",
            "backdrop-blur-md border border-neutral-800/50",
            "shadow-lg",
            isOwn
              ? "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-tr-none"
              : "bg-neutral-800/90 text-neutral-100 rounded-tl-none"
          )}
        >
          {/* Image */}
          {data.image ? (
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
  );
}