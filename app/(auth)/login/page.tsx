'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/app/supabase-provider'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email({ message: 'must be a valid email' }),
  password: z.string(),
})

type Login = z.infer<typeof schema>

export default function SignUp() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [loggingIn, setLoggingIn] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }: Login) => {
    setLoggingIn(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      router.push('/app')
    } else {
      setLoggingIn(false)
      toast({
        title: 'Error logging in',
        description: error?.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex flex-col items-center max-w-xs gap-4 mx-auto">
      <h1 className="mb-2 text-2xl font-bold tracking-tight mt-36">Log in</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-[260px] flex-col gap-3"
      >
        <div className="flex flex-col justify-between">
          <Input {...register('email')} type="email" placeholder="email" />
          {errors.email && (
            <p className="mx-2 mt-0.5 text-sm text-red-600">
              {errors.email?.message}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <Input
            {...register('password')}
            type="password"
            placeholder="password"
          />
        </div>
        <Button disabled={loggingIn} type="submit">
          Login
        </Button>
      </form>
      <Link
        className="mt-2 text-sm underline transition text-zinc-400 underline-offset-4 hover:text-zinc-500"
        href="/signup"
      >
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  )
}
