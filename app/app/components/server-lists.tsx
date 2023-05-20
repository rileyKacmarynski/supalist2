import { Lists } from '@/app/app/components/lists'

import { createServerComponentClient } from '@/lib/supabase-client'

// I can't get this to work right
export default async function ServerLists() {
  const supabase = createServerComponentClient()
  const { data } = await supabase.from('lists').select()

  return <Lists serverLists={data ?? []} />
}
