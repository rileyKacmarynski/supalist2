import { Inter as FontSans } from 'next/font/google'

import '@/styles/globals.css'
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
        'text-slate-950 dark:bg-slate-950 bg-white font-sans antialiased dark:text-slate-50',
        fontSans.variable
      )}
    >
      <body className="min-h">
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <SiteHeader />
        <main>{children}</main>
        <Toaster />
        <TailwindIndicator />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
