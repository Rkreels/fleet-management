'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useFleetStore, type Driver } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import {
  User, FileText, TrendingUp, MapPin, Calendar, Phone,
  Star, AlertTriangle, Car, Award, Shield, Clock, CheckCircle, XCircle
} from 'lucide-react'

interface DriverProfileModalProps {
  children: React.ReactNode
  driverId: number
}

export function DriverProfileModal({ children, driverId }: DriverProfileModalProps) {
  const [open, setOpen] = useState(false)
  const { drivers, vehicles } = useFleetStore()
  const driver = drivers.find(d => d.id === driverId)

  if (!driver) return null

  const assignedVehicle = vehicles.find(v => v.id === driver.vehicleId)

  const getRatingStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      )
    }
    return stars
  }

  const isLicenseExpiringSoon = () => {
    if (!driver.licenseExpiry) return false
    const expiryDate = new Date(driver.licenseExpiry)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isLicenseExpired = () => {
    if (!driver.licenseExpiry) return false
    return new Date(driver.licenseExpiry) < new Date()
  }

  const getPerformanceColor = (value: number, type: 'rating' | 'efficiency' | 'violations') => {
    if (type === 'rating') {
      if (value >= 4.5) return 'text-green-600'
      if (value >= 4.0) return 'text-blue-600'
      if (value >= 3.5) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'efficiency') {
      const efficiency = parseFloat(value)
      if (efficiency >= 5.0) return 'text-green-600'
      if (efficiency >= 4.5) return 'text-blue-600'
      if (efficiency >= 4.0) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'violations') {
      if (value === 0) return 'text-green-600'
      if (value <= 2) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={driver.photo} alt={driver.name} />
                <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5" />
                  {driver.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">{driver.empId}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                    {driver.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {driver.experience}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 space-y-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Contact Information */}
              <div className="col-span-2 space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-medium">{driver.phone}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Address:</span>
                      <p className="font-medium">{driver.address || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Join Date:</span>
                      <p className="font-medium">{driver.joinDate || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Trip:</span>
                      <p className="font-medium">{driver.lastTrip || 'No trips yet'}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Assignment
                  </h3>
                  {assignedVehicle ? (
                    <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{assignedVehicle.regNo}</p>
                        <p className="text-sm text-muted-foreground">{assignedVehicle.model}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No vehicle assigned</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Trips</p>
                      <p className="text-2xl font-bold">{driver.trips}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total KM Driven</p>
                      <p className="text-2xl font-bold">{driver.kmDriven.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold">{driver.rating}</span>
                        <div className="flex">{getRatingStars(driver.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Safety Record
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Violations</span>
                      <span className={`font-semibold ${driver.violations === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {driver.violations}
                      </span>
                    </div>
                    <Progress value={Math.max(0, 100 - driver.violations * 20)} className="h-2" />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{driver.rating}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <div className="flex justify-center gap-0.5 mt-2">
                    {getRatingStars(driver.rating)}
                  </div>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{driver.fuelEfficiency}</p>
                  <p className="text-sm text-muted-foreground">KM/L Efficiency</p>
                  <Progress value={parseFloat(driver.fuelEfficiency) * 10} className="h-2 mt-2" />
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className={`p-3 rounded-full ${driver.violations === 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                      <Shield className={`h-6 w-6 ${driver.violations === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{driver.violations}</p>
                  <p className="text-sm text-muted-foreground">Violations</p>
                  <Progress value={Math.max(0, 100 - driver.violations * 25)} className="h-2 mt-2" />
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Trips</span>
                      <span className="font-semibold">{driver.trips}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Distance</span>
                      <span className="font-semibold">{driver.kmDriven.toLocaleString()} KM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Distance/Trip</span>
                      <span className="font-semibold">
                        {driver.trips > 0 ? Math.round(driver.kmDriven / driver.trips).toLocaleString() : 0} KM
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
                      <span className={`font-semibold ${getPerformanceColor(parseFloat(driver.fuelEfficiency), 'efficiency')}`}>
                        {driver.fuelEfficiency} KM/L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <span className={`font-semibold ${getPerformanceColor(driver.rating, 'rating')}`}>
                        {driver.rating} / 5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Violations</span>
                      <span className={`font-semibold ${getPerformanceColor(driver.violations, 'violations')}`}>
                        {driver.violations}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Performance Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    {driver.rating >= 4.5 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p>
                      {driver.rating >= 4.5 ? 'Excellent' : driver.rating >= 4.0 ? 'Good' : driver.rating >= 3.5 ? 'Average' : 'Below Average'} rating performance
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    {parseFloat(driver.fuelEfficiency) >= 4.5 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p>
                      Fuel efficiency is {parseFloat(driver.fuelEfficiency) >= 4.5 ? 'above' : 'near'} industry average
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    {driver.violations === 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p>
                      {driver.violations === 0 ? 'Clean' : `${driver.violations} violation(s) recorded`} safety record
                    </p>
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
              {(isLicenseExpired() || isLicenseExpiringSoon()) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Document Alert</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      {isLicenseExpired() ? 'License has expired' : 'License is expiring soon'}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {/* License */}
                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Driving License</p>
                        <p className="text-sm text-muted-foreground">{driver.license}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLicenseExpired() ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isLicenseExpiringSoon() ? (
                        <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">Expiring Soon</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-700 hover:bg-green-500/20">Valid</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Insurance</p>
                        <p className="text-sm text-muted-foreground">{driver.insurance || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expires: {driver.insuranceExpiry ? new Date(driver.insuranceExpiry).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline">View</Badge>
                    </div>
                  </div>
                </div>

                {/* Additional Documents Placeholder */}
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">Additional documents can be uploaded here</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Upload Document
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
