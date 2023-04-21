import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { getUser } from '@/lib/data'
import { createServerComponentClient } from '@/lib/supabase-client'
import AuthMenu from '@/components/auth-menu'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { buttonVariants } from '@/components/ui/button'

export const SiteHeader = async function SiteHeader() {
  const supabase = createServerComponentClient()
  const { user } = await getUser(supabase)

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-b-zinc-200 dark:border-b-zinc-700 dark:bg-zinc-950">
      <div className="container flex items-center h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                  className: 'text-zinc-700 dark:text-zinc-400',
                })}
              >
                <Icons.GitHub className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </a>
            <AuthMenu user={user} />
          </nav>
        </div>
      </div>
    </header>
  )
} as unknown as () => JSX.Element
