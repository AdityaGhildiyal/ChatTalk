import { MessageCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-[#1a1a1a] px-4 py-10">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Glassmorphic Icon with subtle pulse */}
        <div className="relative inline-flex items-center justify-center mx-auto">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl animate-pulse"></div>
          <div className="relative p-6 rounded-full bg-neutral-900/50 backdrop-blur-md border border-neutral-800/50 shadow-xl">
            <MessageCircle className="w-14 h-14 text-cyan-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title with gradient */}
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Select a chat
        </h3>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
          Choose a conversation from the sidebar to start messaging.
        </p>
      </div>
    </div>
  );
}