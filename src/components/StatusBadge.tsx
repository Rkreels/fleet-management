'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Status } from '@/lib/store'

interface StatusBadgeProps {
  status: Status
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig: Record<
  Status,
  {
    label: string
    bgColor: string
    textColor: string
    icon: React.ElementType
    borderColor?: string
  }
> = {
  active: {
    label: 'Active',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500/20',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Inactive',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-600 dark:text-gray-400',
    borderColor: 'border-gray-500/20',
    icon: XCircle,
  },
  expired: {
    label: 'Expired',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/20',
    icon: XCircle,
  },
  due: {
    label: 'Due Soon',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-500/20',
    icon: Clock,
  },
  ok: {
    label: 'OK',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500/20',
    icon: ShieldCheck,
  },
  warning: {
    label: 'Warning',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-500/20',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/20',
    icon: AlertTriangle,
  },
  pending: {
    label: 'Pending',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/20',
    icon: Clock,
  },
  approved: {
    label: 'Approved',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-500/20',
    icon: CheckCircle,
  },
}

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
  lg: 'px-4 py-1.5 text-base gap-2',
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeConfig[size],
        className
      )}
    >
      <Icon className={cn(
        'h-3 w-3',
        size === 'lg' && 'h-4 w-4'
      )} />
      {config.label}
    </motion.span>
  )
}
