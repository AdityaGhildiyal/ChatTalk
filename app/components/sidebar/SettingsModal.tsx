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
import { Upload, X } from "lucide-react"

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
    setValue("image", result?.info?.secure_url, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios.post("/api/settings", data)
      .then(() => {
        router.refresh()
        onClose()
        toast.success("Profile updated!", { style: { background: '#1a1a1a', color: '#fff' } })
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false))
  }

  if (!currentUser) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <p className="text-sm text-neutral-400 mt-1">Update your public information</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-500 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Avatar + Upload */}
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-neutral-800 transition-all group-hover:ring-cyan-500">
                  <Image
                    src={image || currentUser.image || "/images/placeholder.jpg"}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isLoading && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-cyan-400 border-t-transparent"></div>
                  </div>
                )}
              </div>

              <CldUploadButton
                options={{ maxFiles: 1 }}
                onSuccess={handleUpload}
                uploadPreset="Aditya"
              >
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white
                  border border-neutral-700 hover:border-cyan-500
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                  <Upload className="w-4 h-4" />
                  Change Photo
                </div>
              </CldUploadButton>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Display Name
            </label>
            <Input
              label="Display Name"
              id="name"
              register={register}
              errors={errors}
              required
              disabled={isLoading}
              className="
                w-full px-4 py-3 rounded-xl
                bg-neutral-800/50 border border-neutral-700
                text-white placeholder-neutral-500
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
                transition-all duration-200
                disabled:opacity-50
              "
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="
                px-5 py-2.5 rounded-full text-sm font-medium
                text-neutral-400 hover:text-white
                bg-neutral-800 hover:bg-neutral-700
                border border-neutral-700
                transition-all duration-200
                disabled:opacity-50
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="
                px-6 py-2.5 rounded-full text-sm font-medium text-white
                bg-gradient-to-r from-cyan-500 to-blue-600
                hover:from-cyan-400 hover:to-blue-500
                shadow-lg hover:shadow-cyan-500/25
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default SettingsModal