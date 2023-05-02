'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/app/supabase-provider'
import { AnimatePresence, MotionConfig, Variants, motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const expandWidth = 240
const shrinkWidth = 44

const sidebarVariants: Variants = {
  expand: {
    width: expandWidth,
  },
  shrink: {
    width: shrinkWidth,
  },
}

export default function SideNav() {
  // should we just pass the user from the server component here? hmmmm...
  const { user } = useSupabase()
  const [navOpen, setNavOpen] = useState(true)

  const toggleNav = () => setNavOpen((open) => !open)

  return (
    <MotionConfig transition={{ duration: 0.3 }}>
      <motion.div
        layout
        variants={sidebarVariants}
        initial={false}
        animate={navOpen ? 'expand' : 'shrink'}
        className="flex flex-col overflow-hidden border-r border-r-zinc-200"
      >
        <div className="text-sm rounded-none text-zinc-500">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-full">
                <Button
                  title="open user menu"
                  variant="ghost"
                  className="flex justify-start w-full p-0 text-sm transition duration-300 rounded-none h-11 hover:bg-zinc-200 focus:ring-0"
                >
                  <Avatar className="w-6 h-6 ml-2 text-base rounded-md min-w-40">
                    <AvatarFallback className="text-sm rounded-md text-zinc-400 font-regular">
                      R
                    </AvatarFallback>
                  </Avatar>
                  <AnimatePresence initial={false}>
                    {navOpen && (
                      <motion.span
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        className="min-w-0 ml-1.5 overflow-hidden flex-nowrap overflow-ellipsis"
                      >
                        {user?.email}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={0}
              className="w-[100px]"
            >
              <DropdownMenuLabel className="w-full">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start w-full px-1"
                >
                  <Icons.Logout className="w-4 h-4 mr-2" /> logout
                </Button>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav className="overflow-hidden font-medium w-[240px] text-zinc-500 dark:text-zinc-300">
          {[...new Array(8)].map(() => (
            <div className="flex">
              <Link
                href="/"
                className="justify-start py-0.5 pl-1.5 my-0.5 mx-1 text-sm transition duration-300 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 grow"
              >
                This is a list
              </Link>
            </div>
          ))}
        </nav>
        <Button
          onClick={toggleNav}
          title={navOpen ? 'collapse menu' : 'expand menu'}
          variant="ghost"
          className="flex items-center justify-center h-auto p-1 mt-auto mb-6 ml-auto mr-2 text-sm transition duration-300 rounded hover:bg-zinc-200 focus:ring-0"
        >
          <motion.div
            key="shrink"
            animate={{ rotateY: navOpen ? '0deg' : '180deg' }}
          >
            <MenuToggleIcon className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </Button>
      </motion.div>
    </MotionConfig>
  )
}

type SVGProps = React.SVGAttributes<SVGElement>

const MenuToggleIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={cn('lucide lucide-chevrons-left', className)}
        {...props}
      >
        <polyline points="11 17 6 12 11 7"></polyline>
        <polyline points="18 17 13 12 18 7"></polyline>
      </svg>
    )
  }
)
MenuToggleIcon.displayName = 'ShrinkIcon'
