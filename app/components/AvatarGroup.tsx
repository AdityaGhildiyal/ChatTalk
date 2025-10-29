"use client";

import { User } from "@/app/generated/prisma";
import Image from "next/image";
import clsx from "clsx";

interface AvatarGroupProps {
  users?: User[];
  size?: "sm" | "md" | "lg"; // 36, 48, 56
  max?: number; // max avatars to show
}

export default function AvatarGroup({
  users = [],
  size = "md",
  max = 3,
}: AvatarGroupProps) {
  const sizeMap = {
    sm: 36,
    md: 48,
    lg: 56,
  };

  const avatarSize = sizeMap[size];
  const innerSize = Math.floor(avatarSize * 0.55); // 55% of container
  const gap = Math.floor(avatarSize * 0.15);

  const slicedUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center rounded-full",
        "ring-2 ring-neutral-800 transition-all duration-200",
        "group hover:ring-cyan-500/50"
      )}
      style={{ width: avatarSize, height: avatarSize }}
    >
      {/* Avatars */}
      {slicedUsers.map((user, index) => {
        const position = {
          0: `top-0 left-[${gap}px]`,
          1: `bottom-0 left-0`,
          2: `bottom-0 right-0`,
        }[index];

        return (
          <div
            key={user.id}
            className={clsx(
              "absolute rounded-full overflow-hidden ring-2 ring-black transition-transform duration-200",
              "hover:scale-110 hover:z-10",
              position
            )}
            style={{ width: innerSize, height: innerSize }}
          >
            <Image
              src={user.image || "/images/placeholder.jpg"}
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          </div>
        );
      })}

      {/* +N Badge */}
      {remaining > 0 && (
        <div
          className={clsx(
            "absolute flex items-center justify-center rounded-full",
            "bg-neutral-800 text-neutral-300 text-xs font-medium",
            "ring-2 ring-black",
            "bottom-0 right-0"
          )}
          style={{
            width: innerSize,
            height: innerSize,
            fontSize: `${innerSize * 0.35}px`,
          }}
        >
          +{remaining}
        </div>
      )}

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}