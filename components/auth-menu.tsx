'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider'
import { User } from '@supabase/auth-helpers-nextjs'

import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AuthMenu({ user }: { user: User | null }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const abbreviation = user?.email?.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="pl-2">
      {abbreviation ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="transition cursor-pointer group">
              <AvatarFallback className="transition group-hover:bg-zinc-200 dark:group-hover:bg-zinc-600">
                {abbreviation}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSignOut}>
              <Icons.Logout className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-4">
          <Link href="/signup" className={buttonVariants({ size: 'xs' })}>
            Sign up
          </Link>
          <Link
            href="/login"
            className={buttonVariants({ size: 'xs', variant: 'outline' })}
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  )
}
