'use client'

import { User } from "@/app/generated/prisma"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import Modal from "@/app/components/Modal"
import Input from "@/app/components/inputs/Input"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import Button from "@/app/components/button"

interface SettingsModalProps {
  isOpen?: boolean
  onClose: () => void
  currentUser: User | null  
}

function SettingsModal({ isOpen, onClose, currentUser }: SettingsModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FieldValues>({
      defaultValues: {
        name: currentUser?.name || "",
        image: currentUser?.image || "/images/placeholder.jpg"
      }
    })

  const image = watch("image")

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios.post("/api/settings", data)
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false))
  }

  if (!currentUser) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-neutral-200">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-300">
              Edit your public information
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                label="Name"
                id="name"
                errors={errors}
                register={register}
                disabled={isLoading}
                required
              />
            </div>

            <label className="block text-sm font-medium leading-6 text-gray-900">
              Photo
            </label>

            <div className="mt-2 flex gap-x-3 items-center">
              <Image
                className="rounded-full w-[48px] h-[48px] object-cover"
                src={image || currentUser?.image || "/images/placeholder.jpg"}
                width={48}   // ✅ numbers, not strings
                height={48}
                alt="Avatar"
              />

              <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}   // ✅ updated prop
                uploadPreset="Aditya"
              >
                <Button disabled={isLoading} secondary type="button">
                  Change
                </Button>
              </CldUploadButton>
            </div>
          </div>

          <div className="mt-6 flex justify-center items-center gap-x-6">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal
