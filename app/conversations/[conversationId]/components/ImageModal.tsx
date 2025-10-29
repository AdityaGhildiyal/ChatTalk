'use client';

import Image from "next/image";
import Modal from "@/app/components/Modal";

interface ImageModalProps {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
}

export default function ImageModal({ isOpen, onClose, src }: ImageModalProps) {
  if (!src) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden">
        <Image
          src={src}
          alt="Full size"
          fill
          className="object-contain"
        />
      </div>
    </Modal>
  );
}