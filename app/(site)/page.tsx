"use client";

import Image from "next/image";
import { AuthForm } from "./components/AuthForm";
import { useState } from "react";

export default function Home() {
  const [variant, setVariant] = useState<"LOGIN" | "REGISTER">("LOGIN");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <Image 
              alt="ChatTalk logo" 
              src="/images/logo.png" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
            <span className="text-3xl font-bold text-gray-900">ChatTalk</span>
          </div>

          {/* Heading - Dynamic based on variant */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {variant === "LOGIN" ? "Login to your account" : "Create your account"}
            </h2>
            <p className="text-gray-600 text-sm">
              {variant === "LOGIN" 
                ? "Welcome back! Please enter your details" 
                : "Let's get started with your 30 days free trial"}
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm variant={variant} setVariant={setVariant} />
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        {/* Background Image with Logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <Image 
            alt="ChatTalk background" 
            src="/images/logo.png" 
            fill
            className="object-cover opacity-20"
            style={{ objectPosition: 'center' }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/60"></div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-center px-12 xl:px-16 text-white z-10">
          {/* Main Text */}
          <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
            Connect & Chat Across
            <br />
            Multiple Databases
          </h1>
          
          <p className="text-xl text-white/90 mb-10 max-w-md leading-relaxed drop-shadow-md">
            Seamlessly integrate conversations with your databases. Real-time sync, powerful queries, and collaborative messaging all in one platform.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold">Real-time Sync</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-semibold">End-to-end Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}