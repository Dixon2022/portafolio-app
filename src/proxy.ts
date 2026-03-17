import { withAuth } from "next-auth/middleware";

export default withAuth(
  () => {
    return;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (
          req.nextUrl.pathname.startsWith("/admin/login") ||
          req.nextUrl.pathname.startsWith("/admin/forgot-password") ||
          req.nextUrl.pathname.startsWith("/admin/reset-password")
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};