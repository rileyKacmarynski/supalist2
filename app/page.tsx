import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { getUser } from '@/lib/data'
import { createServerComponentClient } from '@/lib/supabase-client'
import { buttonVariants } from '@/components/ui/button'

export default async function IndexPage() {
  const supabase = createServerComponentClient()
  const { user } = await getUser(supabase)

  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Simple colaborative list app
          <br className="hidden sm:inline" />
          built with Next 13 and Supabase.
        </h1>
        <p className="max-w-[700px] text-lg text-zinc-700 dark:text-zinc-400 sm:text-xl">
          Share lists with other users and receive updates in real-time.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={user !== null ? '/app' : '/signup'}
          className={buttonVariants({ size: 'lg' })}
        >
          {user ? 'Go to App' : 'Sign Up'}
        </Link>
        <a
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          GitHub
        </a>
      </div>
    </section>
  )
}
