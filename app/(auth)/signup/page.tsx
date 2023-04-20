'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSupabase } from '@/app/supabase-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AnimatePresence,
  MotionConfig,
  MotionProps,
  motion,
} from 'framer-motion'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email({ message: 'must be a valid email' }),
  password: z.string().min(8, { message: 'password must be 8 characters' }),
})

type SignUp = z.infer<typeof schema>

export default function SignUp() {
  const { supabase } = useSupabase()
  const [accountCreated, setAccountCreated] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email, password }: SignUp) => {
    setSubmitting(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setAccountCreated(true)
    setSubmitting(false)
  }

  return (
    <div className="max-w-xs mx-auto text-center">
      <MotionConfig transition={{ duration: 0.3 }}>
        <AnimatePresence initial={false} mode="wait">
          {!accountCreated ? (
            <motion.div key="form" {...animateProps}>
              <h1 className="mb-3 text-2xl font-bold tracking-tight mt-36">
                Create an account
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto flex w-[260px] flex-col gap-3"
              >
                <div className="flex flex-col justify-between">
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="email"
                  />
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
                  {errors.password && (
                    <p className="mx-2 mt-0.5 text-sm text-red-600">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <Button disabled={submitting} type="submit">
                  Sign Up
                </Button>
              </form>
              <Link
                className="mt-2 text-sm underline transition text-zinc-400 underline-offset-4 hover:text-zinc-500"
                href="/login"
              >
                Already have an account? Log in
              </Link>
            </motion.div>
          ) : (
            <motion.div key="confirm" {...animateProps}>
              <h1 className="text-2xl font-bold tracking-tight mt-36">
                Account created
              </h1>
              <p>Check your email for a confirmation link.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  )
}

const animateProps: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
