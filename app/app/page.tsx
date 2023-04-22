'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

const initialItems = [...new Array(8)].map((_, i) => {
  const id = i + 1

  return {
    id,
    text: `item ${id}`,
    complete: false,
  }
})

type Item = (typeof initialItems)[number]

const newItemSchema = z.object({
  text: z.string().min(1),
})
type NewItem = z.infer<typeof newItemSchema>

export default function App() {
  const [items, setItems] = useState(initialItems)

  const markComplete = (itemId: string | number) => {
    const newItems = [...items]
    const selectedItem = newItems.find((i) => i.id === itemId)
    if (!selectedItem) throw new Error('boom')

    const index = newItems.indexOf(selectedItem)

    selectedItem.complete = !selectedItem.complete
    newItems.splice(index, 1, selectedItem)

    setItems(newItems)
  }

  const { register, handleSubmit, reset } = useForm<NewItem>({
    resolver: zodResolver(newItemSchema),
  })

  const addItem = ({ text }: NewItem) => {
    const newItem: Item = {
      complete: false,
      id: items.length + 1,
      text,
    }

    setItems([...items, newItem])
    reset()
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
        Groceries
      </h1>
      <ul className="mt-3">
        {items.map((i) => (
          <li className="flex items-center gap-3 mb-1 py-1" key={i.id}>
            <Checkbox
              onCheckedChange={() => markComplete(i.id)}
              checked={i.complete}
              id={`item-${i.id}`}
            />
            <label
              className={cn(
                'text-zinc-500 relative cursor-pointer transition-colors ',
                'before:absolute before:h-[2px] before:bg-transparent before:w-full before:top-1/2',
                i.complete && 'text-zinc-400 before:bg-zinc-400 '
              )}
              htmlFor={`item-${i.id}`}
            >
              {i.text}
            </label>
          </li>
        ))}
        <li className="flex items-center gap-3 mb-1 py-1">
          <Checkbox disabled checked={false} />
          <form onSubmit={handleSubmit(addItem)}>
            <Input
              {...register('text')}
              className="outline-none text-zinc-500 border-none focus:ring-0 p-0 h-auto text-base"
              placeholder="Add item"
            />
            <button type="submit" className="hidden" />
          </form>
        </li>
      </ul>
    </div>
  )
}
