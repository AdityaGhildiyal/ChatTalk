"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  className?: string; // Add this
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = "text",
  required,
  register,
  errors,
  disabled,
  className = "", // default empty
}) => {
  return (
    <div className={className}>
      <div className="relative">
        <input
          type={type}
          id={id}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          className={clsx(
            `
              peer
              w-full
              px-4 py-3
              bg-neutral-800/50
              border
              rounded-xl
              text-white
              placeholder-transparent
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-500
              focus:border-cyan-500
              transition-all
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
              file:border-0
              file:bg-neutral-700
              file:text-neutral-300
              file:rounded-lg
              file:px-3
              file:py-1.5
              file:text-sm
              file:font-medium
              file:cursor-pointer
              file:hover:bg-neutral-600
            `,
            errors[id]
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-700"
          )}
        />
        <label
          htmlFor={id}
          className={clsx(
            `
              absolute
              left-4
              -top-2.5
              px-1
              text-sm
              font-medium
              text-neutral-400
              bg-neutral-900/90
              transition-all
              duration-200
              pointer-events-none
              peer-placeholder-shown:text-base
              peer-placeholder-shown:top-3
              peer-placeholder-shown:left-4
              peer-focus:-top-2.5
              peer-focus:text-cyan-400
              peer-focus:text-sm
            `,
            errors[id] && "text-red-400 peer-focus:text-red-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
    </div>
  );
};

export default Input;