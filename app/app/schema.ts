import { z } from 'zod'

export const newListSchema = z.object({
  name: z.string().min(1),
})
export type NewList = z.infer<typeof newListSchema>
