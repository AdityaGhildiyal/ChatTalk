'use client';

import Button from "@/app/components/button";
import Modal from "@/app/components/Modal";
import useConversation from "@/app/hooks/useConversation";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export default function ConfirmModal({ isOpen, onClose }: ConfirmModalProps) {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push('/conversations');
        router.refresh();
      })
      .catch(() => toast.error('Failed to delete conversation'))
      .finally(() => setIsLoading(false));
  }, [conversationId, onClose, router]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-500">
          <FiAlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <Dialog.Title as="h3" className="text-lg font-semibold text-white">
            Delete conversation
          </Dialog.Title>
          <p className="mt-1 text-sm text-neutral-400">
            This action cannot be undone. All messages will be permanently removed.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button secondary onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          danger
          onClick={onDelete}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
}