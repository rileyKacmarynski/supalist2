'use client'

import { useSupabase } from '@/app/supabase-provider'
import { Auth as SupaAuth } from '@supabase/auth-ui-react'

export default function Auth() {
  const { supabase } = useSupabase()

  return <div></div>
}
