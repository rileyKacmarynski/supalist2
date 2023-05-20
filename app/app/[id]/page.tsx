import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import List from '@/app/app/[id]/list'
import { ListWithItems } from '@/app/app/schema'
import { useSupabase } from '@/app/supabase-provider'
import { SupabaseClient } from '@supabase/supabase-js'

import { Database } from '@/lib/database.types'
import { createServerComponentClient } from '@/lib/supabase-client'

// I don't think this is wokring
// It's not refetching on each request
// client component for now
// export const revalidate = 0

const getList = cache(
  async (supabase: SupabaseClient<Database>, id: string) => {
    return supabase
      .from('lists')
      .select(
        `*,
      list_items (
        *
      )
    `
      )
      .match({ id })
  }
)

export default function Page({ params }: { params: { id: string } }) {
  // const supabase = createServerComponentClient()
  // const { data } = await getList(supabase, params.id)

  // console.log('running list server component')
  // console.log(data)

  return <List id={params.id} />
}
