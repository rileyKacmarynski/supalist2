'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sidebarVariants, useNav } from '@/app/app/components/side-nav'
import { useSupabase } from '@/app/supabase-provider'
import { useToast } from '@/hooks/use-toast'
import { AnimatePresence, motion } from 'framer-motion'

import { Database } from '@/lib/database.types'
import { Icons } from '@/components/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { SimpleTooltip } from '@/components/ui/tooltip'

export type List = Database['public']['Tables']['lists']['Row']

export type ListsProps = {
  serverLists: List[]
}

export function Lists({ serverLists }: ListsProps) {
  const [lists, setLists] = useState(serverLists)
  const { toast } = useToast()
  const { supabase } = useSupabase()
  const { navOpen } = useNav()

  useEffect(() => {
    const channel = supabase
      .channel('all-list-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lists' },
        (payload) => {
          console.log('lists changed', payload)
          if (payload.eventType === 'INSERT') {
            setLists((lists) => [...lists, payload.new as List])
          } else if (payload.eventType === 'DELETE') {
            const { id } = payload.old
            setLists((lists) => [...lists.filter((l) => l.id !== id)])
          }
        }
      )
      .subscribe()

    return () => void supabase.removeChannel(channel)
  }, [lists, supabase])

  const deleteList = async (id: string) => {
    console.log('deleting', id)
    const { error } = await supabase.from('lists').delete().eq('id', id)

    if (error) {
      toast({
        title: 'Error deleting list',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <motion.nav
      variants={sidebarVariants.container}
      className="overflow-hidden font-medium text-zinc-500 dark:text-zinc-300"
    >
      <AnimatePresence initial={false}>
        {lists.map((list) => (
          <motion.div
            transition={{
              type: 'tween',
              ease: 'easeIn',
              duration: 0.1,
              opacity: { duration: 0.05 },
            }}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-1"
            key={list.id}
          >
            <div className="relative flex items-center justify-between transition duration-300 hover:bg-zinc-200 dark:hover:bg-zinc-700">
              <Link
                href="/"
                className="flex items-center py-0.5 px-1 h-6 my-0.5 mx-1 text-sm rounded grow"
              >
                {/* eventually I'll figure out some icon picker */}
                <Icons.Hash className="w-5 h-4 text-zinc-400 shrink-0" />
                <AnimatePresence initial={false}>
                  {navOpen && (
                    <motion.span
                      className="min-w-0 ml-1 overflow-hidden whitespace-nowrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {list.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <DeleteButton onDelete={() => deleteList(list.id)} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.nav>
  )
}

function DeleteButton({ onDelete }: { onDelete(): Promise<void> }) {
  return (
    <AlertDialog>
      <SimpleTooltip content="delete item">
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="absolute w-5 h-5 p-0 transition right-3 text-zinc-400 focus:bg-zinc-100 dark:focus:bg-zinc-800"
          >
            <Icons.Delete className="w-4 h-4 stroke-2" />
          </Button>
        </AlertDialogTrigger>
      </SimpleTooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this list an all its items for you and
            all contributors
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="text-red-900 bg-red-100 hover:bg-red-200 dark:text-red-100 dark:bg-red-900 dark:hover:bg-red-800"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
