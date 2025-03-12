"use client";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const session = useSession();

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src={"/unb-logo.png"} alt="Logo Unb" width={150} height={10} />
        <h1 className="text-5xl font-bold text-[#1a365d]">| Matrículas</h1>
      </div>
      <button
        onClick={() =>
          session.status === "unauthenticated" ? signIn("google") : signOut()
        }
        className="rounded-md bg-[#1a365d] px-6 py-2 text-2xl font-medium text-white transition-colors hover:bg-[#1a365d]/90"
      >
        {session.status === "authenticated" ? "Sair" : "Fazer Login"}
      </button>
    </nav>
  );
}
