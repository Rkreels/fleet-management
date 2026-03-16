'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddVehicleModal } from '@/components/AddVehicleModal'
import { VehicleDetailModal } from '@/components/VehicleDetailModal'
import { EditVehicleModal } from '@/components/EditVehicleModal'
import { StatusBadge } from '@/components/StatusBadge'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  Truck, Search, Filter, Plus, Download, Eye, Edit, MapPin,
  Fuel, Gauge, CheckCircle, AlertTriangle, Clock, MoreVertical, FileText
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type FilterStatus = 'all' | 'active' | 'inactive'

export default function VehiclesPage() {
  const { vehicles, drivers, deleteVehicle } = useFleetStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchQuery === '' ||
      vehicle.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus

    return matchesSearch && matchesFilter
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)

  // Reset to page 1 when search/filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (value: FilterStatus) => {
    setFilterStatus(value)
    setCurrentPage(1)
  }

  const handleExport = () => {
    setIsLoading(true)
    toast({
      title: 'Exporting Vehicles',
      description: 'Please wait while we generate the CSV file...',
    })

    // Generate CSV content
    const headers = ['Registration No', 'Model', 'Chassis', 'Engine', 'Driver', 'Status', 'KM Reading', 'Fuel Level', 'Location', 'Purchase Date']
    
    const csvContent = [
      headers.join(','),
      ...filteredVehicles.map(v => [
        v.regNo,
        v.model,
        v.chassis,
        v.engine,
        v.driver,
        v.status,
        v.kmReading,
        v.fuelLevel,
        v.location,
        v.purchaseDate
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `vehicles_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setIsLoading(false)
    toast({
      title: 'Export Complete',
      description: `${filteredVehicles.length} vehicles have been exported`,
    })
  }

  const getDocumentStatusBadge = (documents: typeof vehicles[0]['documents']) => {
    const hasExpired = documents.some(d => d.status === 'expired')
    const hasDue = documents.some(d => d.status === 'due')
    const allOk = documents.every(d => d.status === 'ok')

    if (hasExpired) {
      return <Badge variant="destructive" className="text-xs">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Expired
      </Badge>
    }
    if (hasDue) {
      return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Due Soon
      </Badge>
    }
    if (allOk) {
      return <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        Valid
      </Badge>
    }
    return <Badge variant="outline" className="text-xs">Unknown</Badge>
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
            <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
            <p className="text-muted-foreground mt-1">Manage your fleet vehicles</p>
          </div>
          <div className="flex items-center gap-3">
            <AddVehicleModal
              onSuccess={() => {
                toast({
                  title: 'Vehicle Added',
                  description: 'New vehicle has been added to your fleet',
                })
              }}
            >
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </AddVehicleModal>
            <Button variant="outline" onClick={handleExport} disabled={isLoading}>
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
              placeholder="Search vehicles by registration, model, or driver..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Vehicle Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">
              {vehicles.filter(v => v.status === 'active').length} Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">
              {vehicles.filter(v => v.status === 'inactive').length} Inactive
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">
              {vehicles.filter(v => v.documents.some(d => d.status === 'expired')).length} Documents Expired
            </span>
          </div>
        </motion.div>

        {/* Vehicle Grid */}
        <AnimatePresence>
          {filteredVehicles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Truck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Get started by adding your first vehicle'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {paginatedVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{vehicle.regNo}</h3>
                        <p className="text-sm text-muted-foreground truncate">{vehicle.model}</p>
                      </div>
                      <StatusBadge status={vehicle.status} size="sm" />
                    </div>

                    {/* Driver Info */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="text-sm font-medium truncate">{vehicle.driver || 'Not Assigned'}</p>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Gauge className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-muted-foreground">KM:</span>
                        <span className="font-medium">{vehicle.kmReading.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Fuel className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">Fuel:</span>
                        <span className="font-medium">{vehicle.fuelLevel}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium truncate">{vehicle.location || 'Unknown'}</span>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">Documents</span>
                      {getDocumentStatusBadge(vehicle.documents)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <VehicleDetailModal vehicleId={vehicle.id}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                      </VehicleDetailModal>
                      <EditVehicleModal vehicleId={vehicle.id}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </EditVehicleModal>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
          >
            <p>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
              {searchQuery || filterStatus !== 'all' && ` (filtered from ${vehicles.length} total)`}
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
    </motion.div>
  )
}
