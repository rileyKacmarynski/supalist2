import { cookies, headers } from 'next/headers'
import {
  createRouteHandlerSupabaseClient,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { Database } from '@/lib/database.types'

export function createServerComponentClient() {
  return createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
}

export function createRouteHandlerClient() {
  return createRouteHandlerSupabaseClient<Database>({
    headers,
    cookies,
  })
}

export function createServerActionsClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
