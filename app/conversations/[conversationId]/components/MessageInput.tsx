'use client';

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

export default function MessageInput({
  placeholder = "Write a message...",
  id,
  type = "text",
  required,
  register,
  errors,
}: MessageInputProps) {
  const hasError = !!errors[id];

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className={`
          peer w-full px-5 py-3.5
          bg-neutral-800/60 backdrop-blur-md
          text-white placeholder-neutral-500
          rounded-full
          border
          transition-all duration-300
          focus:outline-none
          focus:bg-neutral-800/80
          focus:shadow-lg focus:shadow-cyan-500/20
          ${hasError 
            ? 'border-red-500/70 ring-2 ring-red-500/30' 
            : 'border-neutral-700/50 focus:border-cyan-500'
          }
        `}
      />


      {/* Error Icon */}
      {hasError && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Glow Ring on Focus */}
      <div
        className={`
          absolute inset-0 rounded-full
          ring-2 ring-transparent
          peer-focus:ring-cyan-500/50
          transition-all duration-300 pointer-events-none
          ${hasError ? 'ring-red-500/30' : ''}
        `}
      />
    </motion.div>
  );
}