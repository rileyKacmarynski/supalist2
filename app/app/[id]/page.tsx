import { notFound, redirect } from 'next/navigation'
import List from '@/app/app/[id]/list'
import { ListWithItems } from '@/app/app/schema'

import { createServerComponentClient } from '@/lib/supabase-client'

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient()
  const { data } = await supabase
    .from('lists')
    .select(
      `*,
      list_items (
        *
      )
    `
    )
    .match({ id: params.id })

  if (!data) {
    return notFound()
  }

  return <List serverList={data[0] as unknown as ListWithItems} />
}
