'use client'

import { redirect } from 'next/navigation'
import { useNav } from '@/app/app/components/side-nav'
import { NewList, newListSchema } from '@/app/app/schema'
import { useSupabase } from '@/app/supabase-provider'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  SimpleTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function ListForm() {
  const { supabase, user } = useSupabase()
  const { register, reset, handleSubmit } = useForm<NewList>({
    resolver: zodResolver(newListSchema),
  })
  const { navOpen, toggleNav } = useNav()

  const submit = async ({ name }: NewList) => {
    if (!user) return redirect('/login')

    const { error } = await supabase
      .from('lists')
      .insert({
        id: crypto.randomUUID(),
        author_id: user?.id,
        contributors: [],
        name,
      })
      .select()

    if (!error) {
      reset()
    } else {
      toast({
        title: 'Error creating list',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleAddClick = () => {
    if (!navOpen) toggleNav()
  }

  return (
    <div>
      <div className="px-1 mx-1 mt-2">
        <form onSubmit={handleSubmit(submit)} className="flex items-end">
          <AnimatePresence initial={false}>
            {navOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Input
                  {...register('name')}
                  name="name"
                  className="h-auto p-0 text-sm border-t-0 border-b border-l-0 border-r-0 rounded-none outline-none ring-0 border-b-zinc-400 text-zinc-600 focus:ring-0 focus:placeholder:text-transparent placeholder:text-zinc-400"
                  placeholder="Create list"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <SimpleTooltip content="create list">
            <Button
              // title="create list"
              className="py-0.5 h-6 px-1 mx-0 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800"
              type={navOpen ? 'submit' : 'button'}
              variant="ghost"
              onClick={handleAddClick}
            >
              <Icons.Plus className="w-5 h-4 text-zinc-400" />
            </Button>
          </SimpleTooltip>
        </form>
      </div>
    </div>
  )
}
