import { NavItem } from '@/types/nav'

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: 'SupaList',
  description:
    'Beautifully designed components built with Radix UI and Tailwind CSS.',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
  ],
  links: {
    github: 'https://github.com/rileyKacmarynski/supalist2',
  },
}
