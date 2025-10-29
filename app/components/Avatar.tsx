"use client";

import Image from "next/image";
import { User } from "@/app/generated/prisma";
import useActiveList from "@/app/hooks/useActiveList";
import clsx from "clsx";

interface AvatarProps {
  user?: User;
  size?: number; // 36 (sm), 48 (md), 56 (lg)
}

export default function Avatar({ user, size = 48 }: AvatarProps) {
  const { members } = useActiveList();
  const isActive = user?.email ? members.includes(user.email) : false;

  return (
    <div className="relative group">
      {/* Avatar */}
      <div
        className={clsx(
          "relative rounded-full overflow-hidden ring-2 transition-all duration-200",
          "ring-neutral-800 group-hover:ring-cyan-500/50"
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={user?.image || "/images/placeholder.jpg"}
          alt={user?.name || "User"}
          fill
          className="object-cover"
        />
      </div>

      {/* Online indicator */}
      {isActive && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 block rounded-full bg-emerald-500 ring-2 transition-all",
            "ring-black",
            size <= 36 ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
          )}
        />
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}