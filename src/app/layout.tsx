import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import NavBar from "components/navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "UnB Matrículas",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-w-screen px-16 py-12">
        <SessionProvider>
          <Toaster position="top-center" />
          <NavBar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
