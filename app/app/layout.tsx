import React from 'react'
import { redirect } from 'next/navigation'

import { getUser } from '@/lib/data'
import { createServerComponentClient } from '@/lib/supabase-client'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient()
  const { user } = await getUser(supabase)
  if (!user) {
    redirect('/')
  }

  return <section>{children}</section>
}
