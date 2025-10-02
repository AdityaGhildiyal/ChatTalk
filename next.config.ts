import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains:[
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ]
  },
  // other config options here
};

export default nextConfig;
