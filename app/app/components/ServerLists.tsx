import { Lists } from '@/app/app/components/Lists'
import { SupabaseClient } from '@supabase/auth-helpers-nextjs'

import { Database } from '@/lib/database.types'
import { createServerComponentClient } from '@/lib/supabase-client'

export default async function ServerLists() {
  const supabase = createServerComponentClient()
  const { data } = await supabase.from('lists').select()

  return <Lists serverLists={data ?? []} />
}
