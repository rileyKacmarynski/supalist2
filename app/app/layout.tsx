// 'use client'

import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import ListForm from '@/app/app/components/list-form'
import ServerLists from '@/app/app/components/server-lists'
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
  return (
    <div className="flex h-screen">
      <SideNav>
        {/* @ts-ignore */}
        <ServerLists />
        <ListForm />
      </SideNav>
      <main className="grow">
        <section className="mx-6 mt-8">{children}</section>
      </main>
      <Toaster />
      <TailwindIndicator />
    </div>
  )
}
