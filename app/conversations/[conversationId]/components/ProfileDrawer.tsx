'use client';

import { format } from "date-fns";
import { IoClose, IoTrash } from "react-icons/io5";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@/app/generated/prisma";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import Avatar from "@/app/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & { users: User[] };
}

export default function ProfileDrawer({ isOpen, onClose, data }: ProfileDrawerProps) {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.includes(otherUser?.email || "");

  const joinedDate = useMemo(() => format(new Date(otherUser?.createdAt || Date.now()), 'PP'), [otherUser]);
  const title = useMemo(() => data.name || otherUser?.name || "Chat", [data.name, otherUser?.name]);
  const statusText = useMemo(() => data.isGroup ? `${data.users.length} members` : isActive ? 'Active' : 'Offline', [data, isActive]);

  return (
    <>
      <ConfirmModal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-800 py-6 shadow-2xl">
                      <div className="px-6 flex justify-end">
                        <button
                          onClick={onClose}
                          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                        >
                          <IoClose size={24} />
                        </button>
                      </div>

                      <div className="flex-1 px-6 space-y-6">
                        <div className="flex flex-col items-center text-center">
                          {data.isGroup ? (
                            <AvatarGroup users={data.users} size="lg" />
                          ) : (
                            <Avatar user={otherUser} size={96} />
                          )}
                          <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                          <p className="text-sm text-neutral-400">{statusText}</p>
                        </div>

                        <button
                          onClick={() => setConfirmOpen(true)}
                          className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                        >
                          <IoTrash size={20} />
                          <span>Delete Conversation</span>
                        </button>

                        <div className="space-y-6 text-sm">
                          {data.isGroup ? (
                            <div>
                              <h4 className="font-medium text-neutral-300 mb-2">Members</h4>
                              <p className="text-neutral-400">{data.users.map(u => u.email).join(', ')}</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <h4 className="font-medium text-neutral-300">Email</h4>
                                <p className="text-neutral-400">{otherUser.email}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-neutral-300">Joined</h4>
                                <p className="text-neutral-400">{joinedDate}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}