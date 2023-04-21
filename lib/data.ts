import { cache } from 'react'
import { SupabaseClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/lib/database.types'

export const getUser = cache(async (supabase: SupabaseClient<Database>) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
})
