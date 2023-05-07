// 'use client'

import React from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import ServerLists from '@/app/app/components/ServerLists'
import ListForm from '@/app/app/components/list-form'
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

  const addItem = async (formData: FormData) => {
    'use server'

    console.log(cookies())
  }

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
