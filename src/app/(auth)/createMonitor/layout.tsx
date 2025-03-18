"use client";
import { useSession } from "next-auth/react";
import { permanentRedirect } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = useSession();

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!session.data) {
      toast.error("Para acessar deve estar logado");
      permanentRedirect("/");
    }
  }, [session.data]);
  return <>{children}</>;
}
