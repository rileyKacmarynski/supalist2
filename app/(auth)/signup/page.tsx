'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email({ message: 'must be a valid email' }),
  password: z.string().min(8, { message: 'password must be 8 characters' }),
})

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
      <h1 className="mt-36 mb-2 text-2xl font-bold tracking-tight">
        Create an account
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-[260px] flex-col gap-4">
        <Input {...register('email')} type="email" placeholder="email" />
        <Input {...register('password')} type="password" placeholder="password" />
        <Button type="submit">Sign Up</Button>
      </form>
      <Link
        className="mt-1 text-sm text-zinc-400 underline underline-offset-4 transition hover:text-zinc-500"
        href="/login"
      >
        Already have an account? Sign in
      </Link>
    </div>
  )
}
