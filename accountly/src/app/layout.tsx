import type { Metadata } from "next";

import "./globals.css";
import ClientProvider from "@/components/ClientProvider";
import UserContext from "@/context/UserContext";





export const metadata: Metadata = {
  title: "Accountly",
  description: "NextJS demo project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className='bg-black text-green-300 font-semibold'
      >
        <ClientProvider>
          <UserContext>
            {children}
          </UserContext>
        </ClientProvider>

      </body>
    </html>
  );
}
