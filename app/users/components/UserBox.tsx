"use client";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@/app/generated/prisma";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserBoxProps {
  data: User;
}

export default function UserBox({ data }: UserBoxProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", { userId: data.id })
      .then((res) => {
        router.push(`/conversations/${res.data.id}`);
      })
      .catch(() => {
        // Optional: toast.error("Failed to start chat")
      })
      .finally(() => setIsLoading(false));
  }, [data.id, router]);

  return (
    <>
      {isLoading && <LoadingModal />}

      <button
        onClick={handleClick}
        disabled={isLoading}
        className="
          group relative w-full flex items-center gap-3
          p-3 rounded-xl
          bg-neutral-900/50 backdrop-blur-sm
          border border-neutral-800/50
          hover:bg-neutral-800/70 hover:border-neutral-700
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
        "
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar user={data} size={48} />
        </div>

        {/* Name */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-neutral-100 truncate">
            {data.name}
          </p>
          {data.email && (
            <p className="text-xs text-neutral-500 truncate">{data.email}</p>
          )}
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-xl bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    </>
  );
}