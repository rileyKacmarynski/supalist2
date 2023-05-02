import 'server-only'
import { cache } from 'react'

import { createServerComponentClient } from '@/lib/supabase-client'

export const getUser = cache(async () => {
  const supabase = createServerComponentClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
})
