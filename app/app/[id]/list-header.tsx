'use client'

import { useState } from 'react'
import { ListWithItems } from '@/app/app/schema'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SimpleTooltip } from '@/components/ui/tooltip'

export default function ListHeader({ list }: { list: ListWithItems }) {
  return (
    <div className="flex justify-between align-center">
      <h1 className="ml-5 text-2xl font-medium tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
        {list.name}
      </h1>
      <div>
        <Settings list={list} />
      </div>
    </div>
  )
}

function Settings({ list }: { list: ListWithItems }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SimpleTooltip content="sharing settings">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto px-2 py-2 text-zinc-400 focus:bg-zinc-100 dark:focus:bg-zinc-800"
            // onClick={onClick}
          >
            <Icons.Share className="w-5 h-5 stroke-2" />
          </Button>
        </DialogTrigger>
      </SimpleTooltip>
      <DialogContent>
        <DialogHeader>Settings</DialogHeader>
        <DialogDescription>
          Here's where I'm going to put the form
        </DialogDescription>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
