'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddDriverModal } from '@/components/AddDriverModal'
import { DriverProfileModal } from '@/components/DriverProfileModal'
import { EditDriverModal } from '@/components/EditDriverModal'
import { StatusBadge } from '@/components/StatusBadge'
import { useFleetStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import {
  User, Search, Filter, Plus, Download, Eye, Edit, Phone, Car,
  MapPin, Star, Award, CheckCircle, AlertTriangle, Clock, Shield, TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

type FilterStatus = 'all' | 'active' | 'inactive'

const ITEMS_PER_PAGE = 10

export default function DriversPage() {
  const { drivers, vehicles, deleteDriver } = useFleetStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  
  // Edit modal state
  const [editingDriverId, setEditingDriverId] = useState<number | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Filter drivers
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = searchQuery === '' ||
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery) ||
      driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === 'all' || driver.status === filterStatus

    return matchesSearch && matchesFilter
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredDrivers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex)

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  // Handle page change
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  // Handle edit button click
  const handleEditClick = (driverId: number) => {
    setEditingDriverId(driverId)
    setIsEditModalOpen(true)
  }

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    setEditingDriverId(null)
  }

  // Handle export to CSV
  const handleExport = () => {
    setIsLoading(true)
    
    try {
      // Create CSV headers
      const headers = [
        'Employee ID',
        'Name',
        'Phone',
        'License',
        'License Expiry',
        'Insurance',
        'Insurance Expiry',
        'Status',
        'Vehicle',
        'Join Date',
        'Experience',
        'Trips',
        'KM Driven',
        'Fuel Efficiency',
        'Rating',
        'Violations',
        'Last Trip'
      ]

      // Create CSV rows
      const rows = filteredDrivers.map(driver => [
        driver.empId,
        `"${driver.name}"`,
        `"${driver.phone}"`,
        driver.license,
        driver.licenseExpiry || 'N/A',
        `"${driver.insurance}"`,
        driver.insuranceExpiry || 'N/A',
        driver.status,
        `"${driver.vehicle}"` || 'N/A',
        driver.joinDate || 'N/A',
        `"${driver.experience}"`,
        driver.trips.toString(),
        driver.kmDriven.toString(),
        driver.fuelEfficiency,
        driver.rating.toString(),
        driver.violations.toString(),
        driver.lastTrip || 'N/A'
      ])

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `drivers_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Complete',
        description: `${filteredDrivers.length} drivers have been exported to CSV`,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export drivers. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getLicenseStatusBadge = (licenseExpiry: string) => {
    if (!licenseExpiry) {
      return <Badge variant="outline" className="text-xs">No Expiry</Badge>
    }

    const expiryDate = new Date(licenseExpiry)
    const today = new Date()
    const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <Badge variant="destructive" className="text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Expired
      </Badge>
    }
    if (diffDays <= 30) {
      return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Expiring Soon
      </Badge>
    }
    return <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs">
      <CheckCircle className="h-3 w-3 mr-1" />
      Valid
    </Badge>
  }

  const getRatingStars = (rating: number) => {
    const stars: React.ReactElement[] = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3 w-3 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      )
    }
    return stars
  }

  const getPerformanceColor = (value: number, type: 'rating' | 'efficiency') => {
    if (type === 'rating') {
      if (value >= 4.5) return 'text-green-600'
      if (value >= 4.0) return 'text-blue-600'
      if (value >= 3.5) return 'text-yellow-600'
      return 'text-red-600'
    }
    // efficiency
    const efficiency = typeof value === 'string' ? parseFloat(value) : value
    if (efficiency >= 5.0) return 'text-green-600'
    if (efficiency >= 4.5) return 'text-blue-600'
    if (efficiency >= 4.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
            <p className="text-muted-foreground mt-1">Manage your fleet drivers</p>
          </div>
          <div className="flex items-center gap-3">
            <AddDriverModal
              onSuccess={() => {
                toast({
                  title: 'Driver Added',
                  description: 'New driver has been added to your fleet',
                })
              }}
            >
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Button>
            </AddDriverModal>
            <Button variant="outline" onClick={handleExport} disabled={isLoading || filteredDrivers.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drivers by name, ID, phone, or vehicle..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value: FilterStatus) => {
            setFilterStatus(value)
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Drivers</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Driver Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{drivers.length}</p>
                <p className="text-xs text-muted-foreground">Total Drivers</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{drivers.filter(d => d.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {drivers.length > 0 ? (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1) : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {drivers.reduce((sum, d) => sum + d.trips, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Trips</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Driver Grid */}
        <AnimatePresence>
          {filteredDrivers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Get started by adding your first driver'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {paginatedDrivers.map((driver, index) => (
                <motion.div
                  key={driver.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                    {/* Header with Photo and Status */}
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-14 w-14 border-2 border-border">
                        <AvatarImage src={driver.photo} alt={driver.name} />
                        <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{driver.name}</h3>
                            <p className="text-xs text-muted-foreground">{driver.empId}</p>
                          </div>
                          <StatusBadge status={driver.status} size="sm" />
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {getRatingStars(driver.rating)}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{driver.phone}</span>
                      </div>
                      {driver.vehicle && (
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                          <span className="font-medium truncate">{driver.vehicle}</span>
                        </div>
                      )}
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <Award className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                        <p className="text-sm font-bold">{driver.trips}</p>
                        <p className="text-xs text-muted-foreground">Trips</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                        <p className="text-sm font-bold">{driver.kmDriven.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">KM</p>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded-lg">
                        <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
                        <p className={`text-sm font-bold ${getPerformanceColor(parseFloat(driver.fuelEfficiency), 'efficiency')}`}>
                          {driver.fuelEfficiency}
                        </p>
                        <p className="text-xs text-muted-foreground">KM/L</p>
                      </div>
                    </div>

                    {/* License Status */}
                    <div className="flex items-center justify-between mb-4 p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">License</span>
                      </div>
                      {getLicenseStatusBadge(driver.licenseExpiry)}
                    </div>

                    {/* Violations Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Safety Record</span>
                        <span className={`font-medium ${driver.violations === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {driver.violations} violation{driver.violations !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <Progress
                        value={Math.max(0, 100 - driver.violations * 25)}
                        className="h-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <DriverProfileModal driverId={driver.id}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </DriverProfileModal>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditClick(driver.id)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredDrivers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between text-sm text-muted-foreground"
          >
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredDrivers.length)} of {filteredDrivers.length} drivers
              {searchQuery || filterStatus !== 'all' && ` (filtered from ${drivers.length} total)`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="px-3 py-1 bg-muted rounded-md">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Edit Driver Modal */}
        {editingDriverId !== null && (
          <EditDriverModal
            driverId={editingDriverId}
            open={isEditModalOpen}
            onOpenChange={handleEditModalClose}
          />
        )}
      </motion.div>
  )
}
