import { withAuth } from "next-auth/middleware";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type MiddlewareToken = {
  email?: string | null;
  authenticatedAt?: number;
};

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

        if (!token) {
          return false;
        }

        const typedToken = token as MiddlewareToken;

        if (!typedToken.email) {
          return false;
        }

        const configuredAdminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

        if (configuredAdminEmail && typedToken.email.toLowerCase() !== configuredAdminEmail) {
          return false;
        }

        if (!typedToken.authenticatedAt) {
          return false;
        }

        const tokenAgeSeconds = Math.floor(Date.now() / 1000) - typedToken.authenticatedAt;

        return tokenAgeSeconds <= ADMIN_SESSION_MAX_AGE_SECONDS;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};