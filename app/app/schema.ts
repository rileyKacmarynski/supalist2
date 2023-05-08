import { z } from 'zod'

import { Database } from '@/lib/database.types'

export const newListSchema = z.object({
  name: z.string().min(1),
})
export type NewList = z.infer<typeof newListSchema>

export type List = Database['public']['Tables']['lists']['Row']
export type ListItem = Database['public']['Tables']['list_items']['Row']
export type ListWithItems = List & {
  list_items: ListItem[]
}
