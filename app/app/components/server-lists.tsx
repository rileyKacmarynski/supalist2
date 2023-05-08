import { Lists } from '@/app/app/components/lists'

import { createServerComponentClient } from '@/lib/supabase-client'

export default async function ServerLists() {
  const supabase = createServerComponentClient()
  const { data } = await supabase.from('lists').select()

  return <Lists serverLists={data ?? []} />
}
