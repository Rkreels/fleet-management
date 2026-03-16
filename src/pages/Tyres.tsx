'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { KpiCard } from '@/components/KpiCard'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import { 
  Circle, Search, Plus, Download, AlertTriangle, Gauge,
  ArrowUpDown, MoreHorizontal, Eye, TrendingUp, Truck, Calendar, Trash2
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
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'

export default function TyresPage() {
  const { tyres, vehicles, addTyre, deleteTyre, updateTyre } = useFleetStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<string>('wearPercentage')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewTyre, setViewTyre] = useState<any>(null)
  const [updateKmInput, setUpdateKmInput] = useState('')
  
  // Form state
  const [form, setForm] = useState({
    vehicleId: '',
    tyreNo: '',
    position: '',
    size: '',
    brand: '',
    changeDate: '',
    changeKm: '',
    mileage: '',
    cost: ''
  })

  // Calculate KPIs
  const totalTyres = tyres.length
  const avgCPKM = tyres.length > 0 
    ? (tyres.reduce((sum, t) => sum + t.cpkm, 0) / tyres.length).toFixed(2)
    : '0.00'
  const totalTyreCost = tyres.reduce((sum, t) => sum + t.cost, 0)
  const dueForChange = tyres.filter(t => {
    const kmUsed = t.currentKm - t.changeKm
    const wearPercentage = (kmUsed / t.mileage) * 100
    return wearPercentage >= 80
  }).length

  // Calculate wear percentage for each tyre
  const tyresWithWear = tyres.map(tyre => {
    const kmUsed = tyre.currentKm - tyre.changeKm
    const wearPercentage = (kmUsed / tyre.mileage) * 100
    return {
      ...tyre,
      kmUsed,
      wearPercentage: Math.min(Math.max(wearPercentage, 0), 100)
    }
  })

  // Filter and sort tyres
  const filteredTyres = tyresWithWear
    .filter(t => {
      const matchesSearch = 
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tyreNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.position.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortField === 'wearPercentage') {
        comparison = a.wearPercentage - b.wearPercentage
      } else if (sortField === 'cpkm') {
        comparison = a.cpkm - b.cpkm
      } else if (sortField === 'cost') {
        comparison = a.cost - b.cost
      } else if (sortField === 'vehicle') {
        comparison = a.vehicle.localeCompare(b.vehicle)
      } else if (sortField === 'kmUsed') {
        comparison = a.kmUsed - b.kmUsed
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

  const getWearColor = (wearPercentage: number) => {
    if (wearPercentage >= 80) return 'text-red-600'
    if (wearPercentage >= 60) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getWearProgressColor = (wearPercentage: number) => {
    if (wearPercentage >= 80) return 'bg-red-500'
    if (wearPercentage >= 60) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const handleAddTyre = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const vehicleId = parseInt(form.vehicleId)
    const vehicle = vehicles.find(v => v.id === vehicleId)
    const changeKm = parseInt(form.changeKm) || 0
    const mileage = parseInt(form.mileage) || 0
    const cost = parseFloat(form.cost) || 0
    
    // Calculate CPKM (Cost per Kilometer)
    const cpkm = mileage > 0 ? cost / mileage : 0
    
    addTyre({
      vehicle: vehicle?.regNo || 'Unknown',
      vehicleId: vehicleId || undefined,
      tyreNo: form.tyreNo,
      position: form.position,
      size: form.size,
      brand: form.brand,
      changeDate: form.changeDate,
      changeKm,
      currentKm: changeKm, // Initially same as changeKm
      cost,
      mileage,
      cpkm: parseFloat(cpkm.toFixed(2))
    })
    setForm({ vehicleId: '', tyreNo: '', position: '', size: '', brand: '', changeDate: '', changeKm: '', mileage: '', cost: '' })
    setIsAddModalOpen(false)
    toast({
      title: 'Tyre Added',
      description: 'New tyre entry has been added successfully',
    })
  }

  const handleDeleteTyre = (id: number) => {
    deleteTyre(id)
    toast({
      title: 'Tyre Deleted',
      description: 'Tyre record has been deleted',
    })
  }

  const handleUpdateCurrentKm = () => {
    if (!viewTyre || !updateKmInput) {
      toast({
        title: 'Error',
        description: 'Please enter a valid KM reading',
        variant: 'destructive',
      })
      return
    }

    const newCurrentKm = parseInt(updateKmInput)
    if (isNaN(newCurrentKm) || newCurrentKm < viewTyre.changeKm) {
      toast({
        title: 'Invalid KM',
        description: 'Current KM must be greater than or equal to Change KM',
        variant: 'destructive',
      })
      return
    }

    const kmUsed = newCurrentKm - viewTyre.changeKm
    const wearPercentage = (kmUsed / viewTyre.mileage) * 100
    const newCpkm = kmUsed > 0 ? viewTyre.cost / kmUsed : 0

    updateTyre(viewTyre.id, {
      currentKm: newCurrentKm,
      cpkm: newCpkm,
    })

    // Update viewTyre with new values
    setViewTyre({
      ...viewTyre,
      currentKm: newCurrentKm,
      kmUsed: kmUsed,
      wearPercentage: wearPercentage,
      cpkm: newCpkm,
    })

    setUpdateKmInput('')
    toast({
      title: 'KM Updated',
      description: 'Current KM has been updated successfully',
    })
  }

  const handleViewTyre = (tyre: any) => {
    setViewTyre({
      ...tyre,
      kmUsed: tyre.currentKm - tyre.changeKm,
      wearPercentage: ((tyre.currentKm - tyre.changeKm) / tyre.mileage) * 100,
    })
    setUpdateKmInput('')
  }

  const handleExport = () => {
    const csvContent = [
      ['Vehicle', 'Tyre No', 'Position', 'Size', 'Brand', 'Change Date', 'Change KM', 'KM Used', 'Cost', 'CPKM', 'Wear %'].join(','),
      ...filteredTyres.map(t => [
        t.vehicle,
        t.tyreNo,
        t.position,
        t.size,
        t.brand,
        t.changeDate,
        t.changeKm,
        t.kmUsed,
        t.cost,
        t.cpkm,
        `${t.wearPercentage.toFixed(1)}%`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tyres-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Export Complete',
      description: 'Tyre data has been exported successfully',
    })
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
            <h1 className="text-3xl font-bold tracking-tight">Tyre Management</h1>
            <p className="text-muted-foreground mt-1">
              Track tyre usage, wear, and maintenance schedules
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Tyre Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Tyre Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTyre} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <select 
                        value={form.vehicleId}
                        onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border" 
                        required
                      >
                        <option value="">Select vehicle</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>{v.regNo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tyre Number</Label>
                      <Input 
                        value={form.tyreNo}
                        onChange={(e) => setForm({ ...form, tyreNo: e.target.value })}
                        placeholder="TYR-XXX" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <select 
                        value={form.position}
                        onChange={(e) => setForm({ ...form, position: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border" 
                        required
                      >
                        <option value="">Select position</option>
                        <option value="Front LHS">Front LHS</option>
                        <option value="Front RHS">Front RHS</option>
                        <option value="Rear LHS Outer">Rear LHS Outer</option>
                        <option value="Rear LHS Inner">Rear LHS Inner</option>
                        <option value="Rear RHS Outer">Rear RHS Outer</option>
                        <option value="Rear RHS Inner">Rear RHS Inner</option>
                        <option value="Spare">Spare</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Input 
                        value={form.size}
                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                        placeholder="295/80 R22.5" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand</Label>
                      <Input 
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        placeholder="MRF, CEAT, Apollo, etc." 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Change Date</Label>
                      <Input 
                        type="date" 
                        value={form.changeDate}
                        onChange={(e) => setForm({ ...form, changeDate: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Change KM</Label>
                      <Input 
                        type="number" 
                        value={form.changeKm}
                        onChange={(e) => setForm({ ...form, changeKm: e.target.value })}
                        placeholder="0" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Mileage (KM)</Label>
                      <Input 
                        type="number" 
                        value={form.mileage}
                        onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                        placeholder="80000" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cost (৳)</Label>
                      <Input 
                        type="number" 
                        value={form.cost}
                        onChange={(e) => setForm({ ...form, cost: e.target.value })}
                        placeholder="0" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Tyre</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
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
            title="Total Tyres Tracked"
            value={totalTyres}
            icon={Circle}
            color="blue"
          />
          <KpiCard
            title="Avg CPKM"
            value={`৳${avgCPKM}`}
            icon={TrendingUp}
            color="green"
          />
          <KpiCard
            title="Total Tyre Cost"
            value={`৳${totalTyreCost.toLocaleString()}`}
            icon={Truck}
            color="purple"
          />
          <KpiCard
            title="Due for Change"
            value={dueForChange}
            icon={AlertTriangle}
            color={dueForChange > 0 ? 'red' : 'green'}
          />
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle, tyre no, brand, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {dueForChange > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>{dueForChange} tyre(s) need replacement</span>
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border bg-card overflow-hidden"
        >
          <div className="overflow-x-auto">
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
                  <TableHead>Tyre No</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Change Date
                    </div>
                  </TableHead>
                  <TableHead>Change KM</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('kmUsed')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      KM Used
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('cost')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Cost
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('cpkm')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      CPKM
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('wearPercentage')}
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      Wear %
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTyres.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center">
                      No tyre records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTyres.map((tyre, index) => (
                    <motion.tr
                      key={tyre.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className={`border-b hover:bg-muted/50 ${
                        tyre.wearPercentage >= 80 ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                      }`}
                    >
                      <TableCell className="font-medium">{tyre.vehicle}</TableCell>
                      <TableCell>{tyre.tyreNo}</TableCell>
                      <TableCell>{tyre.position}</TableCell>
                      <TableCell>{tyre.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Circle className="h-3 w-3 text-muted-foreground" />
                          {tyre.brand}
                        </div>
                      </TableCell>
                      <TableCell>{tyre.changeDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          {tyre.changeKm.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{tyre.kmUsed.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>৳{tyre.cost.toLocaleString()}</TableCell>
                      <TableCell>৳{tyre.cpkm.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${getWearColor(tyre.wearPercentage)}`}>
                              {tyre.wearPercentage.toFixed(1)}%
                            </span>
                            {tyre.wearPercentage >= 80 && (
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                          <Progress 
                            value={tyre.wearPercentage} 
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewTyre(tyre)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this tyre record?')) {
                                  handleDeleteTyre(tyre.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        {/* Wear Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">0-60%: Good Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">60-80%: Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">80%+: Replace Soon</span>
          </div>
        </motion.div>
      </div>

      {/* View Tyre Modal */}
      {viewTyre && (
        <Dialog open={!!viewTyre} onOpenChange={() => setViewTyre(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tyre Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Vehicle</Label>
                  <p className="font-medium">{viewTyre.vehicle}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tyre Number</Label>
                  <p className="font-medium">{viewTyre.tyreNo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Position</Label>
                  <p className="font-medium">{viewTyre.position}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Size</Label>
                  <p className="font-medium">{viewTyre.size}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Brand</Label>
                  <p className="font-medium">{viewTyre.brand}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Change Date</Label>
                  <p className="font-medium">{viewTyre.changeDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Change KM</Label>
                  <p className="font-medium">{viewTyre.changeKm.toLocaleString()} KM</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Current KM</Label>
                  <p className="font-medium">{viewTyre.currentKm.toLocaleString()} KM</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">KM Used</Label>
                  <p className="font-medium">{viewTyre.kmUsed.toLocaleString()} KM</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expected Mileage</Label>
                  <p className="font-medium">{viewTyre.mileage.toLocaleString()} KM</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Cost</Label>
                  <p className="font-medium">৳{viewTyre.cost.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">CPKM</Label>
                  <p className="font-medium">৳{viewTyre.cpkm.toFixed(2)}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Label className="text-muted-foreground">Wear Percentage</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getWearColor(viewTyre.wearPercentage)}`}>
                      {viewTyre.wearPercentage.toFixed(1)}%
                    </span>
                    {viewTyre.wearPercentage >= 80 && (
                      <span className="text-sm text-red-600 font-medium">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Needs Replacement
                      </span>
                    )}
                  </div>
                  <Progress 
                    value={viewTyre.wearPercentage} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground">
                    {viewTyre.wearPercentage >= 80
                      ? 'This tyre is near the end of its life and should be replaced soon.'
                      : viewTyre.wearPercentage >= 60
                      ? 'Monitor this tyre regularly. Consider replacement planning.'
                      : 'This tyre is in good condition with plenty of life remaining.'}
                  </p>
                </div>
              </div>

              {/* Update Current KM Section */}
              <div className="pt-4 border-t space-y-3">
                <Label className="font-semibold">Update Current KM</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={updateKmInput}
                    onChange={(e) => setUpdateKmInput(e.target.value)}
                    placeholder="Enter new KM reading"
                    min={viewTyre.changeKm}
                  />
                  <Button onClick={handleUpdateCurrentKm} className="bg-orange-500 hover:bg-orange-600">
                    Update
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: {viewTyre.currentKm.toLocaleString()} KM • Change: {viewTyre.changeKm.toLocaleString()} KM
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
