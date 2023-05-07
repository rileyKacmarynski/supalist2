import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formToObject(formData: FormData) {
  const obj = {}

  formData.forEach((value, key) => {
    obj[key] = value
  })

  return obj
}
