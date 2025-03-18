import { type NextRequest, NextResponse } from "next/server";
import type { Session } from "next-auth";
import axios from "axios";

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("__Secure-authjs.session-token");
  const requestHeaders = new Headers(request.headers);

  // Check for admin first
  if (token?.value === process.env.ADMIN_TOKEN) {
    requestHeaders.set("x-admin", "true");
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  requestHeaders.set("x-admin", "false");

  // If not admin, check for regular session
  if (token) {
    const { data: session } = await axios.get<Session>(
      `${request.nextUrl.origin}/api/auth/session`,
      {
        headers: {
          Cookie: `__Secure-authjs.session-token=${token.value}`,
        },
      },
    );

    if (session?.user?.id) {
      requestHeaders.set("x-user-id", session.user.id);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // If neither auth method works, return unauthorized
  return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
}

export const config = {
  matcher: "/api/desiredClass/:path*",
};
