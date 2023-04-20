'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createBrowserSupabaseClient,
  type SupabaseClient,
  type User,
} from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/lib/database.types'

export type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user?: User
}

const SupaContext = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [user, setUser] = useState<User>()

  const router = useRouter()
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(undefined)
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <SupaContext.Provider value={{ supabase, user }}>
      <>{children}</>
    </SupaContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupaContext)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupbaseProvider')
  }

  return context
}
