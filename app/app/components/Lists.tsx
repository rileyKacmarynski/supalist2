'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sidebarVariants, useNav } from '@/app/app/components/side-nav'
import { useSupabase } from '@/app/supabase-provider'
import { AnimatePresence, motion } from 'framer-motion'

import { Database } from '@/lib/database.types'
import { Icons } from '@/components/icons'

export type List = Database['public']['Tables']['lists']['Row']

export type ListsProps = {
  serverLists: List[]
}

export function Lists({ serverLists }: ListsProps) {
  const [lists, setLists] = useState(serverLists)
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
            <Link
              href="/"
              className="flex items-center py-0.5 px-1 h-6 my-0.5 mx-1 text-sm transition duration-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 grow"
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
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.nav>
  )
}
