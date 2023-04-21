import { cookies, headers } from 'next/headers'
import {
  createRouteHandlerSupabaseClient,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'

export function createServerComponentClient() {
  return createServerComponentSupabaseClient({
    headers,
    cookies,
  })
}

export function createRouteHandlerClient() {
  return createRouteHandlerSupabaseClient({
    headers,
    cookies,
  })
}
