"use client";

import clsx from "clsx";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface DesktopItemProps {
  label: string;
  icon: LucideIcon;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

export default function DesktopItem({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}: DesktopItemProps) {
  const handleClick = () => onClick?.();

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
            group relative flex items-center justify-center
            w-12 h-12 rounded-xl
            transition-all duration-200
            hover:scale-110 hover:bg-neutral-800/70
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
          `,
          active
            ? "bg-neutral-800/90 text-cyan-400 shadow-lg"
            : "text-neutral-500 hover:text-cyan-400"
        )}
        aria-label={label}
      >
        {/* Icon */}
        <Icon className="w-6 h-6 transition-colors" />

        {/* Active indicator (left bar) */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full" />
        )}

        {/* Tooltip on hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/90 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
          {label}
        </span>
      </Link>
    </li>
  );
}