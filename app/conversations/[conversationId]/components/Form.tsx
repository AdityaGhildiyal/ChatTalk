'use client';

import axios from "axios";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";  // <-- Use Widget (no nested button)
import useConversation from "@/app/hooks/useConversation";
import MessageInput from "./MessageInput";

export default function Form() {
  const { conversationId } = useConversation();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
    defaultValues: { message: '' }
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });
    axios.post('/api/messages', { ...data, conversationId });
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId
    });
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800">
      {/* CldUploadWidget – renders its own button, no nesting */}
      <CldUploadWidget
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="Aditya"
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="p-2 rounded-full text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition"
          >
            <HiPhoto size={28} />
          </button>
        )}
      </CldUploadWidget>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex items-center gap-3">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="p-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white transition"
        >
          <HiPaperAirplane size={20} />
        </button>
      </form>
    </div>
  );
}