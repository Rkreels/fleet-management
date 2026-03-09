'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { KpiCard } from '@/components/KpiCard'
import { StatusBadge } from '@/components/StatusBadge'
import { AIScanModal } from '@/components/AIScanModal'
import { useFleetStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { 
  Wrench, Search, Plus, FileText, Download, CheckCircle, 
  Calendar, DollarSign, Truck, MapPin, Filter, SlidersHorizontal,
  ArrowUpDown, Eye, MoreHorizontal, Trash2
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function MaintenancePage() {
  const { maintenance, vehicles, updateMaintenance, addMaintenance, deleteMaintenance } = useFleetStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<any>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minCost: '',
    maxCost: '',
    vehicleType: 'all',
  })

  // Calculate KPIs
  const totalCost = maintenance.reduce((sum, m) => sum + m.cost + m.gst, 0)
  const pendingApprovals = maintenance.filter(m => m.status === 'pending').length
  const serviceDue = vehicles.filter(v => {
    const nextServiceKm = parseInt(v.nextService.replace(/,/g, ''))
    return v.kmReading >= nextServiceKm - 2000
  }).length
  const avgCostPerVehicle = maintenance.length > 0 
    ? Math.round(totalCost / vehicles.length) 
    : 0

  // Filter and sort maintenance records
  const filteredMaintenance = maintenance
    .filter(m => {
      const matchesSearch =
        m.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.work.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter

      // Advanced filters
      let matchesDateRange = true
      if (advancedFilters.dateFrom) {
        matchesDateRange = matchesDateRange && new Date(m.date) >= new Date(advancedFilters.dateFrom)
      }
      if (advancedFilters.dateTo) {
        matchesDateRange = matchesDateRange && new Date(m.date) <= new Date(advancedFilters.dateTo)
      }

      let matchesCostRange = true
      if (advancedFilters.minCost) {
        matchesCostRange = matchesCostRange && m.cost >= parseInt(advancedFilters.minCost)
      }
      if (advancedFilters.maxCost) {
        matchesCostRange = matchesCostRange && m.cost <= parseInt(advancedFilters.maxCost)
      }

      const matchesVehicleType =
        advancedFilters.vehicleType === 'all' ||
        (advancedFilters.vehicleType === 'active' && vehicles.find(v => v.id === m.vehicleId)?.status === 'active') ||
        (advancedFilters.vehicleType === 'inactive' && vehicles.find(v => v.id === m.vehicleId)?.status === 'inactive')

      return matchesSearch && matchesStatus && matchesDateRange && matchesCostRange && matchesVehicleType
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortField === 'cost') {
        comparison = a.cost - b.cost
      } else if (sortField === 'vehicle') {
        comparison = a.vehicle.localeCompare(b.vehicle)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleClearFilters = () => {
    setAdvancedFilters({
      dateFrom: '',
      dateTo: '',
      minCost: '',
      maxCost: '',
      vehicleType: 'all',
    })
    setIsFilterOpen(false)
    toast({
      title: 'Filters Cleared',
      description: 'All advanced filters have been reset',
    })
  }

  const handleApplyFilters = () => {
    setIsFilterOpen(false)
    toast({
      title: 'Filters Applied',
      description: 'Advanced filters have been applied',
    })
  }

  const handleApprove = (id: number) => {
    updateMaintenance(id, { status: 'approved' })
    toast({
      title: 'Record Approved',
      description: 'Maintenance record has been approved successfully',
    })
  }

  const handleAddMaintenance = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const vehicleId = parseInt(formData.get('vehicleId') as string)
    const vehicle = vehicles.find(v => v.id === vehicleId)
    
    addMaintenance({
      vehicle: vehicle?.regNo || 'Unknown',
      vehicleId,
      date: formData.get('date') as string,
      work: formData.get('work') as string,
      vendor: formData.get('vendor') as string,
      cost: parseFloat(formData.get('cost') as string),
      gst: parseFloat(formData.get('gst') as string),
      status: 'pending' as const,
      nextKm: parseInt(formData.get('nextKm') as string),
    })
    setIsAddModalOpen(false)
    toast({
      title: 'Record Added',
      description: 'Maintenance record has been added successfully',
    })
  }

  const handleExport = () => {
    const csvContent = [
      ['Vehicle', 'Date', 'Work Description', 'Vendor', 'Cost', 'GST', 'Total', 'Next KM', 'Status'].join(','),
      ...filteredMaintenance.map(m => [
        m.vehicle,
        m.date,
        `"${m.work}"`,
        m.vendor,
        m.cost,
        m.gst,
        m.cost + m.gst,
        m.nextKm,
        m.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maintenance-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Export Complete',
      description: 'Maintenance records have been exported successfully',
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all vehicle maintenance records
            </p>
          </div>
          <div className="flex gap-2">
            <AIScanModal documentType="maintenance">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                AI Scan Bill
              </Button>
            </AIScanModal>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Maintenance Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddMaintenance} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <select name="vehicleId" className="w-full px-3 py-2 rounded-md border" required>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.regNo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" name="date" required />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Work Description</Label>
                      <Textarea name="work" placeholder="Describe the maintenance work" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Vendor</Label>
                      <Input name="vendor" placeholder="Service provider name" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost (৳)</Label>
                      <Input type="number" name="cost" placeholder="0.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label>GST (৳)</Label>
                      <Input type="number" name="gst" placeholder="0.00" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Next Service KM</Label>
                      <Input type="number" name="nextKm" placeholder="0" required />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Record</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <KpiCard
            title="Total Maintenance Cost"
            value={`৳${totalCost.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <KpiCard
            title="Pending Approvals"
            value={pendingApprovals}
            icon={Calendar}
            color="yellow"
          />
          <KpiCard
            title="Service Due"
            value={serviceDue}
            icon={Wrench}
            color="orange"
          />
          <KpiCard
            title="Avg Cost/Vehicle"
            value={`৳${avgCostPerVehicle.toLocaleString()}`}
            icon={Truck}
            color="blue"
          />
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-1 gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle, vendor, or work..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
                  Approved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Advanced Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date From</Label>
                      <Input
                        type="date"
                        value={advancedFilters.dateFrom}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateFrom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date To</Label>
                      <Input
                        type="date"
                        value={advancedFilters.dateTo}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, dateTo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Min Cost (৳)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={advancedFilters.minCost}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, minCost: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Cost (৳)</Label>
                      <Input
                        type="number"
                        placeholder="999999"
                        value={advancedFilters.maxCost}
                        onChange={(e) => setAdvancedFilters({ ...advancedFilters, maxCost: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Status</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={advancedFilters.vehicleType === 'all' ? 'default' : 'outline'}
                        onClick={() => setAdvancedFilters({ ...advancedFilters, vehicleType: 'all' })}
                      >
                        All
                      </Button>
                      <Button
                        type="button"
                        variant={advancedFilters.vehicleType === 'active' ? 'default' : 'outline'}
                        onClick={() => setAdvancedFilters({ ...advancedFilters, vehicleType: 'active' })}
                      >
                        Active
                      </Button>
                      <Button
                        type="button"
                        variant={advancedFilters.vehicleType === 'inactive' ? 'default' : 'outline'}
                        onClick={() => setAdvancedFilters({ ...advancedFilters, vehicleType: 'inactive' })}
                      >
                        Inactive
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={handleApplyFilters} className="bg-orange-500 hover:bg-orange-600">
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort('vehicle')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Vehicle
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>Work Description</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort('cost')}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    Cost
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Next KM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaintenance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No maintenance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaintenance.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{record.vehicle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {record.date}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={record.work}>
                      {record.work}
                    </TableCell>
                    <TableCell>{record.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {record.cost?.toLocaleString() || '0'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {record.gst?.toLocaleString() || '0'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {record.nextKm?.toLocaleString() || '0'} KM
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {record.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(record.id)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewRecord(record)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this maintenance record?')) {
                                  deleteMaintenance(record.id)
                                  toast({
                                    title: 'Record Deleted',
                                    description: 'Maintenance record has been deleted',
                                  })
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>

      {/* View Record Modal */}
      {viewRecord && (
        <Dialog open={!!viewRecord} onOpenChange={() => setViewRecord(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Maintenance Record Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Vehicle</Label>
                  <p className="font-medium">{viewRecord.vehicle}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{viewRecord.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vendor</Label>
                  <p className="font-medium">{viewRecord.vendor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={viewRecord.status} />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Work Description</Label>
                <p className="font-medium mt-1">{viewRecord.work}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cost</Label>
                  <p className="font-medium">৳{viewRecord.cost?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">GST</Label>
                  <p className="font-medium">৳{viewRecord.gst?.toLocaleString() || '0'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total</Label>
                  <p className="font-medium">৳{((viewRecord.cost || 0) + (viewRecord.gst || 0)).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Next Service At</Label>
                <p className="font-medium">{viewRecord.nextKm?.toLocaleString() || '0'} KM</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  )
}
