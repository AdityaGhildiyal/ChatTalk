import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // Always allow NextAuth's own endpoints to return JSON (avoid redirects)
        if (pathname.startsWith("/api/auth")) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
    matcher: [
        "/users/:path*",
        "/conversations/:path*",
    ],
}