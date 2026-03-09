'use client'

import { motion } from 'framer-motion'
import { LucideIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'yellow'
  trend?: {
    value: number
    label: string
  }
  className?: string
}

const colorConfig = {
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    iconBg: 'bg-orange-500',
    iconText: 'text-white',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    iconBg: 'bg-green-500',
    iconText: 'text-white',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    iconBg: 'bg-blue-500',
    iconText: 'text-white',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-500',
    iconBg: 'bg-purple-500',
    iconText: 'text-white',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    iconBg: 'bg-red-500',
    iconText: 'text-white',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    iconBg: 'bg-yellow-500',
    iconText: 'text-white',
  },
}

export function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'orange',
  trend,
  className 
}: KpiCardProps) {
  const config = colorConfig[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg',
        className
      )}
    >
      {/* Background Pattern */}
      <div className={cn(
        'absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10',
        config.bg
      )} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.h3 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="mt-2 text-3xl font-bold text-foreground"
          >
            {value}
          </motion.h3>

          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-2 flex items-center gap-1"
            >
              {trend.value > 0 ? (
                <ArrowUp className={cn('h-4 w-4', 'text-green-500')} />
              ) : trend.value < 0 ? (
                <ArrowDown className={cn('h-4 w-4', 'text-red-500')} />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(
                'text-sm font-medium',
                trend.value > 0 ? 'text-green-600 dark:text-green-400' :
                trend.value < 0 ? 'text-red-600 dark:text-red-400' :
                'text-muted-foreground'
              )}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-muted-foreground">{trend.label}</span>
            </motion.div>
          )}
        </div>

        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            config.iconBg
          )}
        >
          <Icon className={cn('h-6 w-6', config.iconText)} />
        </motion.div>
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={cn('absolute bottom-0 left-0 h-1', config.bg)}
      />
    </motion.div>
  )
}
