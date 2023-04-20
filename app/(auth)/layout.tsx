import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="mx-auto px-14">{children}</section>
}
