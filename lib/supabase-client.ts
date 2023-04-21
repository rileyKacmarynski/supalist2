import { cookies, headers } from 'next/headers'
import {
  createRouteHandlerSupabaseClient,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'

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
