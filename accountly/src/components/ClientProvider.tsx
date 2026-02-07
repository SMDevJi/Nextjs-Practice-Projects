'use client';
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { Toaster, toast } from 'sonner';
const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Toaster />
      {children}
    </SessionProvider>
  )
}

export default ClientProvider