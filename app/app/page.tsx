'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

  const deleteItem = (id: number | string) => {
    const newItems = items.filter((i) => i.id !== id)

    setItems(newItems)
  }

  return (
    <div>
      <h1 className="ml-5 text-2xl font-medium tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
        Groceries
      </h1>
      <ul className="mt-3">
        <AnimatePresence initial={false}>
          {items.map((i) => (
            <motion.li
              transition={{
                type: 'tween',
                ease: 'easeIn',
                duration: 0.2,
                opacity: { duration: 0.1 },
              }}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="group"
              key={i.id}
            >
              <div className="flex items-center py-1 pb-1">
                <DeleteButton onClick={() => deleteItem(i.id)} />
                <Checkbox
                  onCheckedChange={() => markComplete(i.id)}
                  checked={i.complete}
                  id={`item-${i.id}`}
                />
                <label
                  className={cn(
                    'text-zinc-600 relative pl-3 cursor-pointer transition duration-300',
                    'before:absolute before:h-[2px] before:w-[calc(100%-0.75rem)]',
                    'before:transition  before:duration-200 before:scale-x-0 before:origin-left before:bg-transparent before:top-1/2',
                    i.complete &&
                      'text-zinc-400 before:bg-zinc-400 before:scale-x-100'
                  )}
                  htmlFor={`item-${i.id}`}
                >
                  {i.text}
                </label>
              </div>
            </motion.li>
          ))}
          <li key="form">
            <div className="flex items-center gap-3 py-1 mb-1 ml-6">
              <Checkbox disabled checked={false} />
              <form onSubmit={handleSubmit(addItem)}>
                <Input
                  {...register('text')}
                  className="h-auto p-0 text-base border-t-0 border-b border-l-0 border-r-0 rounded-none outline-none ring-0 border-b-zinc-400 text-zinc-600 focus:ring-0 focus:placeholder:text-transparent placeholder:text-zinc-400"
                  placeholder="Add item"
                />
                <button type="submit" className="hidden" />
              </form>
            </div>
          </li>
        </AnimatePresence>
      </ul>
    </div>
  )
}

type DeleteProps = {
  onClick: () => void
}

function DeleteButton({ onClick }: DeleteProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="w-5 h-5 p-0 mr-1 transition opacity-0 text-zinc-400 focus:ring-0 focus:opacity-100 group-hover:opacity-100 focus:bg-zinc-100 dark:focus:bg-zinc-800"
            onClick={onClick}
          >
            <Icons.Delete className="w-4 h-4 stroke-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>delete item</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
