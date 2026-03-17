'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { KpiCard } from '@/components/KpiCard'
import { StatusBadge } from '@/components/StatusBadge'
import { useFleetStore, Vehicle, Driver } from '@/lib/store'
import { toast } from '@/lib/toast'
import {
  CreditCard, Search, Plus, Download, AlertTriangle, RefreshCw,
  ArrowUpDown, TrendingUp, Clock, Wallet, MoreHorizontal, Eye, Banknote,
  MapPin, CheckCircle, SlidersHorizontal, Filter, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'

export default function FASTagPage() {
  const { fastags, vehicles, drivers, rechargeFASTag, addFASTag, deleteFASTag } = useFleetStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<string>('balance')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [rechargeTagId, setRechargeTagId] = useState<number | null>(null)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [viewTag, setViewTag] = useState<any>(null)
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false)

  // Form state for add FASTag
  const [formData, setFormData] = useState({
    fastagId: '',
    vehicleId: '',
    driverId: '',
    initialBalance: '',
    lowBalanceThreshold: '',
    bank: ''
  })

  // Calculate KPIs
  const totalBalance = fastags.reduce((sum, f) => sum + f.balance, 0)
  const criticalFastags = fastags.filter(f => f.status === 'critical')
  const warningFastags = fastags.filter(f => f.status === 'warning')
  const okFastags = fastags.filter(f => f.status === 'ok')

  // Filter and sort FASTags
  const filteredFASTags = fastags.filter(f =>
    f.fastagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.driver.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    let comparison = 0
    if (sortField === 'balance') {
      comparison = a.balance - b.balance
    } else if (sortField === 'monthlyToll') {
      comparison = a.monthlyToll - b.monthlyToll
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const handleAddFASTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!formData.fastagId || !formData.vehicleId || !formData.driverId) {
      toast.error('Please fill all required fields')
      return
    }

    // Create new FASTag
    const newFASTag = {
      fastagId: formData.fastagId,
      vehicle: vehicles.find(v => v.id === parseInt(formData.vehicleId))?.regNo || 'Unknown',
      vehicleId: parseInt(formData.vehicleId),
      driver: drivers.find(d => d.id === parseInt(formData.driverId))?.name || 'Unknown',
      driverId: parseInt(formData.driverId),
      balance: parseFloat(formData.initialBalance) || 0,
      threshold: parseFloat(formData.lowBalanceThreshold) || 500,
      status: 'ok' as const,
      lastToll: new Date().toISOString().split('T')[0],
      monthlyToll: 0,
      bank: formData.bank,
    }

    addFASTag(newFASTag)
    setIsAddModalOpen(false)
    toast.success('FASTag added successfully')

    // Reset form
    setFormData({
      fastagId: '',
      vehicleId: '',
      driverId: '',
      initialBalance: '',
      lowBalanceThreshold: '',
      bank: ''
    })
  }

  const handleRecharge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!rechargeTagId || !rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      toast.error('Please select a FASTag and enter a valid amount')
      return
    }

    rechargeFASTag(rechargeTagId, parseFloat(rechargeAmount))
    setRechargeTagId(null)
    setRechargeAmount('')
    toast.success('FASTag recharged successfully')
  }

  const handleExport = () => {
    const csvContent = [
      ['FASTag ID', 'Vehicle', 'Driver', 'Balance', 'Monthly Toll', 'Bank', 'Status'].join(','),
      ...filteredFASTags.map(f => [
        f.fastagId,
        f.vehicle,
        f.driver,
        f.balance.toLocaleString(),
        f.monthlyToll.toLocaleString(),
        f.bank,
        f.status
      ]).join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fastag-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('FASTag data exported successfully')
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FASTag Management</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage all FASTag balances and transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add FASTag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New FASTag</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddFASTag} className="space-y-4">
                  <div className="space-y-2">
                    <Label>FASTag ID</Label>
                    <Input
                      placeholder="BD-XXX"
                      value={formData.fastagId}
                      onChange={(e) => setFormData({ ...formData, fastagId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle</Label>
                    <select
                      className="w-full px-3 py-2 rounded-md border required"
                      value={formData.vehicleId}
                      onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                      required
                    >
                      <option value="">Select vehicle</option>
                        {vehicles.map((v, index) => (
                          <option key={v.id} value={v.id}>
                            {v.regNo}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <select
                      className="w-full px-3 py-2 rounded-md border required"
                      value={formData.driverId}
                      onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                      required
                    >
                      <option value="">Select driver</option>
                        {drivers.map((d, index) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bank</Label>
                    <Input
                      placeholder="Bank name"
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Initial Balance (৳)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.initialBalance}
                        onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Low Balance Threshold (৳)</Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={formData.lowBalanceThreshold}
                        onChange={(e) => setFormData({ ...formData, lowBalanceThreshold: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      Add FASTag
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KpiCard
            title="Total Balance"
            value={`৳${totalBalance.toLocaleString()}`}
            icon={Wallet}
            color="green"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <KpiCard
            title="Critical FASTags"
            value={criticalFastags.length}
            icon={AlertTriangle}
            color="red"
            trend={{ value: -5, label: 'vs last month' }}
          />
          <KpiCard
            title="Warning FASTags"
            value={warningFastags.length}
            icon={Clock}
            color="yellow"
            trend={{ value: 3, label: 'vs last month' }}
          />
          <KpiCard
            title="OK FASTags"
            value={okFastags.length}
            icon={CheckCircle}
            color="green"
            trend={{ value: 8, label: 'vs last month' }}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by FASTag ID, vehicle, driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortField('balance')}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort by Balance
                    {sortField === 'balance' && (
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField('monthlyToll')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Sort by Monthly Toll
                    {sortField === 'monthlyToll' && (
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.location.reload()}
                title="Refresh Data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FASTag ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Monthly Toll</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFASTags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No FASTag records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFASTags.map((fastag, index) => (
                    <TableRow key={fastag.id}>
                      <TableCell className="font-medium">{fastag.fastagId}</TableCell>
                      <TableCell>{fastag.vehicle}</TableCell>
                      <TableCell>{fastag.driver}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-green-600" />
                          <span className={fastag.balance < fastag.threshold ? 'text-red-600' : 'text-green-600'}>
                            ৳{fastag.balance.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>৳{fastag.monthlyToll.toLocaleString()}</TableCell>
                      <TableCell>{fastag.bank}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            fastag.status === 'ok' ? 'ok' :
                            fastag.status === 'warning' ? 'warning' : 'critical'
                          }
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewTag(fastag)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setRechargeTagId(fastag.id)
                                setIsRechargeModalOpen(true)
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Recharge
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete FASTag ${fastag.fastagId}?`)) {
                                  deleteFASTag(fastag.id)
                                  toast.success('FASTag deleted successfully')
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* View FASTag Details Modal */}
          {viewTag && (
            <Dialog open={!!viewTag} onOpenChange={() => setViewTag(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>FASTag Details - {viewTag.fastagId}</DialogTitle>
                </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vehicle</Label>
                    <p className="font-medium">{viewTag.vehicle}</p>
                  </div>
                  <div>
                    <Label>Driver</Label>
                    <p className="font-medium">{viewTag.driver}</p>
                  </div>
                  <div>
                    <Label>Balance</Label>
                    <p className="font-medium">৳{viewTag.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Monthly Toll</Label>
                    <p className="font-medium">৳{viewTag.monthlyToll.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Bank</Label>
                    <p className="font-medium">{viewTag.bank}</p>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge
                    status={viewTag.status}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setViewTag(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    setRechargeTagId(viewTag.id)
                    setViewTag(null)
                    setIsRechargeModalOpen(true)
                  }}>
                    Recharge
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          )}

          {/* Recharge Modal */}
          <Dialog open={isRechargeModalOpen} onOpenChange={setIsRechargeModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recharge FASTag</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRecharge} className="space-y-4">
                <div>
                  <Label>FASTag ID: {rechargeTagId}</Label>
                  <p className="text-sm text-muted-foreground">
                    Current balance: ৳{fastags.find(f => f.id === rechargeTagId)?.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label>Recharge Amount (৳)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    required
                    min="100"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsRechargeModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    Recharge
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
  )
}
