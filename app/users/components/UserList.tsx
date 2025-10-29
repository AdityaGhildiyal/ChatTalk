"use client";

import { User } from "@/app/generated/prisma";
import UserBox from "./UserBox";
import clsx from "clsx";

interface UserListProps {
  items: User[];
}

export default function UserList({ items }: UserListProps) {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 pb-20 lg:pb-0",
        "lg:left-20 lg:w-80",
        "w-full left-0",
        "bg-black/95 backdrop-blur-xl",
        "border-r border-neutral-800/50",
        "overflow-y-auto",
        "z-10"
      )}
    >
      <div className="px-5 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">People</h2>
          <span className="text-xs text-neutral-500 bg-neutral-800/70 px-2 py-1 rounded-full">
            {items.length}
          </span>
        </div>

        {/* User List */}
        <div className="space-y-2">
          {items.map((user) => (
            <UserBox key={user.id} data={user} />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <p className="text-center text-neutral-500 text-sm py-8">
            No users found.
          </p>
        )}
      </div>
    </aside>
  );
}