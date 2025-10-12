"use client";

import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

import Button from "@/app/components/button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

interface AuthFormProps {
  variant: Variant;
  setVariant: (variant: Variant) => void;
}

export function AuthForm({ variant, setVariant }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("Something went wrong"))
        .finally(() => setIsLoading(false));
    }
    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }
          if (callback?.ok && !callback.error) {
            toast.success("Logged in!");
            router.push("/users");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }
        if (callback?.ok && !callback.error) {
          toast.success("Logged in!");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="space-y-6">
      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={() => socialAction("google")}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <BsGoogle className="w-5 h-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">
          Login with Google
        </span>
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">or</span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {variant === "REGISTER" && (
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="name"
            label="Name"
          />
        )}
        <Input
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          id="email"
          label="Email"
          type="email"
        />
        <Input
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          id="password"
          label="Password"
          type="password"
        />

        {/* Terms Checkbox */}
        {variant === "REGISTER" && (
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to all{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Term
              </a>
              ,{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Fees
              </a>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <Button disabled={isLoading} fullWidth type="submit">
          {variant === "LOGIN" ? "Log in" : "Sign Up"}
        </Button>
      </form>

      {/* Toggle Login/Register */}
      <div className="text-center text-sm text-gray-600">
        {variant === "LOGIN"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:underline"
          onClick={toggleVariant}
          disabled={isLoading}
        >
          {variant === "LOGIN" ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
}