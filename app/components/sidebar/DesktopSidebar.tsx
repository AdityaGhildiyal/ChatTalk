"use client";

import { useState } from "react";
import useRoutes from "../../hooks/useRoutes";
import DesktopItem from "@/app/components/sidebar/DesktopItem";
import { User } from "@/app/generated/prisma";
import Avatar from "@/app/components/Avatar";
import SettingsModal from "@/app/components/sidebar/SettingsModal";

interface DesktopSidebarProps {
  currentUser: User;
}

export default function DesktopSidebar({ currentUser }: DesktopSidebarProps) {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className="
          hidden lg:flex lg:flex-col lg:justify-between
          fixed inset-y-0 left-0 z-50 w-20
          bg-black/95 backdrop-blur-xl
          border-r border-neutral-800/50
          py-4 px-3
          transition-all duration-300
        "
      >
        {/* Navigation Icons */}
        <nav className="flex flex-col items-center space-y-2">
          {routes.map((item) => (
            <DesktopItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </nav>

        {/* User Avatar */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="
              group relative p-1 rounded-full
              transition-all duration-200
              hover:scale-110 hover:ring-4 hover:ring-cyan-500/30
            "
            aria-label="Open settings"
          >
            {/* Glow on hover */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <Avatar user={currentUser} size={48} />
              {/* Online indicator */}
              <span
                className="
                  absolute bottom-0 right-0
                  w-3.5 h-3.5 bg-emerald-500
                  border-2 border-black rounded-full
                  ring-2 ring-black
                "
              />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}