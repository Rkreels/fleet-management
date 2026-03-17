import { toast as sonnerToast } from 'sonner'

export function toast(message: string | { title?: string; description?: string; variant?: string } = {}, options?: any) {
  if (typeof message === 'object' && message !== null) {
    const { title, description, ...rest } = message as any
    return sonnerToast(description || title || '', {
      ...options,
      ...(title && { description: undefined }),
    })
  }
  return sonnerToast(message, options)
}

export default toast
