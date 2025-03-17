"use client";
import { useSession } from "next-auth/react";
import { permanentRedirect } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = useSession();
  if (!session.data) {
    permanentRedirect("/");
  }
  return <>{children}</>;
}
