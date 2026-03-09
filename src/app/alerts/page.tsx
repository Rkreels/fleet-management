'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { useFleetStore, Alert } from '@/lib/store'
import { toast } from 'sonner'
import {
  Bell, BellRing, Check, CheckCheck, Trash2, Filter,
  AlertTriangle, Info, AlertCircle, X, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

type FilterType = 'all' | 'critical' | 'warning' | 'info'
type ReadFilter = 'all' | 'read' | 'unread'

export default function AlertsPage() {
  const { alerts, markAlertRead, clearAlerts, deleteAlert } = useFleetStore()
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [readFilter, setReadFilter] = useState<ReadFilter>('all')
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [alertToDelete, setAlertToDelete] = useState<number | null>(null)

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType
    const matchesRead = readFilter === 'all' ||
      (readFilter === 'read' && alert.read) ||
      (readFilter === 'unread' && !alert.read)
    return matchesType && matchesRead
  })

  const unreadCount = alerts.filter(a => !a.read).length

  const handleMarkAsRead = (id: number) => {
    markAlertRead(id)
    toast.success('Alert marked as read')
  }

  const handleMarkAllAsRead = () => {
    alerts.forEach(alert => markAlertRead(alert.id))
    toast.success('All alerts marked as read')
  }

  const handleClearAll = () => {
    clearAlerts()
    setShowClearDialog(false)
    toast.success('All alerts cleared')
  }

  const handleClearAlert = (id: number) => {
    setAlertToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (alertToDelete) {
      deleteAlert(alertToDelete)
      toast.success('Alert deleted')
    }
    setShowDeleteDialog(false)
    setAlertToDelete(null)
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertBadge = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">Warning</Badge>
      case 'info':
        return <Badge className="bg-blue-500/10 text-blue-700 hover:bg-blue-500/20">Info</Badge>
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BellRing className="h-8 w-8 text-orange-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
              <p className="text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="hidden sm:flex"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setShowClearDialog(true)}
              disabled={alerts.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Alert Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={(value: ReadFilter) => setReadFilter(value)}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Read Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredAlerts.length}</span>
              <span>alerts</span>
            </div>
          </div>
        </Card>

        {/* Alert List */}
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
              <p className="text-muted-foreground">
                {alerts.length === 0
                  ? 'You have no alerts at the moment'
                  : 'Try adjusting your filters'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`p-4 transition-all ${
                    !alert.read
                      ? 'border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/10'
                      : 'border-l-4 border-l-transparent'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Alert Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>

                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getAlertBadge(alert.type)}
                            {!alert.read && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-3">{alert.msg}</p>
                        <div className="flex items-center gap-2">
                          {!alert.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="h-8 text-xs"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark as Read
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setAlertToDelete(alert.id)
                                setShowDeleteDialog(true)
                              }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Alert
                              </DropdownMenuItem>
                              {!alert.read && (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(alert.id)}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Clear All Confirmation Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Alerts?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all {alerts.length} alerts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll} className="bg-red-500 hover:bg-red-600">
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Single Alert Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Alert?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this alert.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </Layout>
  )
}
