'use client';

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Button from "@/app/components/button";
import { User } from "@/app/generated/prisma";

interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

export default function GroupChatModal({ isOpen, onClose, users }: GroupChatModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", members: [] },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/conversations", { ...data, isGroup: true })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Failed to create group"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div>
          <h2 className="text-xl font-bold text-white">Create Group Chat</h2>
          <p className="mt-1 text-sm text-neutral-400">Add a name and select members</p>
        </div>

        <div className="space-y-6">
          <Input
            id="name"
            label="Group Name"
            register={register}
            errors={errors}
            required
            disabled={isLoading}
          />
          <Select
            disabled={isLoading}
            label="Members"
            options={users.map((user) => ({
              value: user.id,
              label: user.name || user.email,
            }))}
            onChange={(value) => setValue("members", value, { shouldValidate: true })}
            value={members}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button secondary onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || members.length < 2}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </motion.form>
    </Modal>
  );
}