import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const isAdmin = request.headers.get("x-admin");
  const userEmail = request.headers.get("x-user-email");
  return NextResponse.json({ isAdmin, userEmail });
}
