import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware logic is handled by withAuth options
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only allow admins to access /admin routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        // Require any user to be logged in for profile/dashboard
        if (req.nextUrl.pathname.startsWith("/profile") || req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/profile", "/dashboard"] };
