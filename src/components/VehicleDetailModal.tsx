'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFleetStore, type Vehicle } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import {
  Car, FileText, Wrench, MapPin, Calendar, Fuel, Gauge,
  AlertTriangle, CheckCircle, XCircle, Clock, User, Shield, Settings
} from 'lucide-react'

interface VehicleDetailModalProps {
  children: React.ReactNode
  vehicleId: number
}

export function VehicleDetailModal({ children, vehicleId }: VehicleDetailModalProps) {
  const [open, setOpen] = useState(false)
  const { vehicles } = useFleetStore()
  const vehicle = vehicles.find(v => v.id === vehicleId)

  if (!vehicle) return null

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'due':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">Valid</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      case 'due':
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">Due Soon</Badge>
      default:
        return null
    }
  }

  const isExpiringSoon = (expiry: string) => {
    if (!expiry) return false
    const expiryDate = new Date(expiry)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expiry: string) => {
    if (!expiry) return false
    return new Date(expiry) < new Date()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Car className="h-5 w-5" />
                {vehicle.regNo}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{vehicle.model}</p>
            </div>
            <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
              {vehicle.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Vehicle Info Card */}
              <div className="col-span-2 space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Chassis No:</span>
                      <p className="font-medium">{vehicle.chassis}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Engine No:</span>
                      <p className="font-medium">{vehicle.engine}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">GPS ID:</span>
                      <p className="font-medium">{vehicle.gpsId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fuel Card:</span>
                      <p className="font-medium">{vehicle.fuelCard || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">FASTag ID:</span>
                      <p className="font-medium">{vehicle.fastagId || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Purchase Date:</span>
                      <p className="font-medium">{vehicle.purchaseDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Current Status
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">KM Reading</p>
                        <p className="font-semibold">{vehicle.kmReading.toLocaleString()} KM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fuel Level</p>
                        <p className="font-semibold">{vehicle.fuelLevel}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold text-sm">{vehicle.location || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Info Card */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assigned Driver
                  </h3>
                  {vehicle.driver ? (
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${vehicle.driver}&background=0D8ABC&color=fff`} />
                        <AvatarFallback>{vehicle.driver.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{vehicle.driver}</p>
                        <p className="text-xs text-muted-foreground">Driver ID: {vehicle.driverId}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No driver assigned</p>
                  )}
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Service Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Last Service:</span>
                      <p className="font-medium">{vehicle.lastService || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Service:</span>
                      <p className="font-medium">{vehicle.nextService}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Document Alerts */}
              {vehicle.documents.some(d => isExpired(d.expiry) || isExpiringSoon(d.expiry)) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Document Alerts</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {vehicle.documents.filter(d => isExpired(d.expiry)).length} expired,{' '}
                      {vehicle.documents.filter(d => isExpiringSoon(d.expiry)).length} expiring soon
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {vehicle.documents.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.expiry ? `Expires: ${new Date(doc.expiry).toLocaleDateString()}` : 'No expiry date'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getDocumentStatusBadge(doc.status)}
                        {getDocumentStatusIcon(doc.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Service Tab */}
          <TabsContent value="service" className="mt-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Last Service Date</span>
                  </div>
                  <p className="text-xl font-bold">{vehicle.lastService || 'Not Serviced Yet'}</p>
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Next Service At</span>
                  </div>
                  <p className="text-xl font-bold">{vehicle.nextService}</p>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Service History
                </h3>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground text-center py-8">
                    <Wrench className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No service records available</p>
                    <p className="text-xs mt-1">Service records will appear here after maintenance</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = `/maintenance`
                    toast({
                      title: 'Schedule Service',
                      description: 'Navigate to Maintenance page to schedule service for this vehicle',
                    })
                  }}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: 'Add Service Record',
                      description: 'Navigate to Maintenance page to add service records',
                    })
                    window.location.href = `/maintenance`
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Service Record
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
