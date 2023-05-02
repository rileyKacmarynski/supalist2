// 'use client'

import React from 'react'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import SideNav from '@/app/app/components/side-nav'

import { getUser } from '@/lib/data'
import { createServerComponentClient } from '@/lib/supabase-client'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser()
  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex h-screen">
      <SideNav />
      <main className="grow">
        <section className="mx-6 mt-8">{children}</section>
      </main>
      <Toaster />
      <TailwindIndicator />
    </div>
  )
}
