'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  X,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react'
import { useFleetStore } from '@/lib/store'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const navigate = useNavigate()
  const { alerts, markAlertRead } = useFleetStore()

  const unreadAlerts = alerts.filter(a => !a.read)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-64 right-0 top-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search vehicles, drivers, trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className="flex w-full max-w-md items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm text-muted-foreground hover:border-orange-500/50 hover:bg-accent/50 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search vehicles, drivers, trips...</span>
                <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground md:inline-block">
                  ⌘K
                </kbd>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-background shadow-lg z-50"
                  >
                    <div className="border-b border-border p-4">
                      <h3 className="font-semibold">Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        {unreadAlerts.length} unread
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          No notifications
                        </div>
                      ) : (
                        alerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={cn(
                              'border-b border-border p-4 transition-colors hover:bg-accent/50 cursor-pointer',
                              !alert.read && 'bg-orange-500/10'
                            )}
                            onClick={() => {
                              markAlertRead(alert.id)
                              setNotificationsOpen(false)
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                'mt-0.5 h-2 w-2 rounded-full',
                                alert.type === 'critical' && 'bg-red-500',
                                alert.type === 'warning' && 'bg-yellow-500',
                                alert.type === 'info' && 'bg-blue-500'
                              )} />
                              <div className="flex-1">
                                <p className="text-sm">{alert.msg}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-9 w-9"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500 text-white">
                <User className="h-5 w-5" />
              </div>
            </Button>

            <AnimatePresence>
              {profileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50"
                    onClick={() => setProfileOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-background shadow-lg z-50"
                  >
                    <div className="border-b border-border p-4">
                      <p className="font-semibold">Admin User</p>
                      <p className="text-sm text-muted-foreground">admin@fleetpro.com</p>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        size="sm"
                        onClick={() => {
                          setProfileOpen(false)
                          navigate('/fleet-management/settings')
                        }}
                      >
                        <SettingsIcon className="h-4 w-4" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                        size="sm"
                        onClick={() => {
                          toast.success('Signing out...')
                          setTimeout(() => {
                            navigate('/login')
                          }, 1000)
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
