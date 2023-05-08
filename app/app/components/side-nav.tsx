'use client'

import React, { useState } from 'react'
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
import { SimpleTooltip } from '@/components/ui/tooltip'

const expandWidth = 240
const shrinkWidth = 44

const NavContext = React.createContext({ navOpen: true, toggleNav: () => {} })

export function useNav() {
  return React.useContext(NavContext)
}

export const sidebarVariants = {
  container: {
    expand: {
      width: expandWidth,
    },
    shrink: {
      width: shrinkWidth,
    },
  },

  icon: {
    expand: { rotateY: '0deg' },
    shrink: { rotateY: '180deg' },
  },
} satisfies { [key in string]: Variants }

export default function SideNav({ children }: { children: React.ReactNode }) {
  // should we just pass the user from the server component here? hmmmm...
  const { user } = useSupabase()
  const [navOpen, setNavOpen] = useState(true)

  const toggleNav = () => setNavOpen((open) => !open)

  return (
    <MotionConfig transition={{ duration: 0.25, ease: 'easeInOut' }}>
      <NavContext.Provider value={{ navOpen, toggleNav }}>
        <motion.div
          variants={sidebarVariants.container}
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
                    <Avatar className="h-6 mx-2 text-base rounded-md w-7">
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
                          className="min-w-0 overflow-hidden flex-nowrap overflow-ellipsis"
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
          {children}
          <SimpleTooltip content={navOpen ? 'collapse menu' : 'expand menu'}>
            <Button
              onClick={toggleNav}
              variant="ghost"
              className="flex items-center justify-center h-auto p-1 mt-auto mb-6 ml-auto mr-2 text-sm transition duration-300 rounded hover:bg-zinc-200 focus:ring-0"
            >
              <motion.div variants={sidebarVariants.icon}>
                <MenuToggleIcon className="w-5 h-5 text-zinc-400" />
              </motion.div>
            </Button>
          </SimpleTooltip>
        </motion.div>
      </NavContext.Provider>
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
