import { Inter as FontSans } from 'next/font/google'

import '@/styles/globals.css'
import SupabaseProvider from '@/app/supabase-provider'
import { ThemeProvider } from 'next-themes'

import { siteConfig } from '@/config/site'
import { absoluteUrl, cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        'bg-white font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50',
        fontSans.variable
      )}
    >
      <body className="flex min-h-screen flex-col">
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <SupabaseProvider>
          <SiteHeader />
          <main className="grow">{children}</main>
          <Toaster />
          <TailwindIndicator />
        </SupabaseProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
