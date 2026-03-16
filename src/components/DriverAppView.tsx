'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  Smartphone, Fuel, Gauge, MapPin, User, LogOut,
  ArrowRight, CheckCircle, Clock, TrendingUp, FileText,
  Home, Calendar, Menu, X, Plus, Send
} from 'lucide-react'

type DriverAppScreen = 'login' | 'dashboard' | 'fuel' | 'km' | 'trip' | 'profile'

interface DriverAppViewProps {
  children: React.ReactNode
  driverId?: number
}

export function DriverAppView({ children, driverId = 1 }: DriverAppViewProps) {
  const [open, setOpen] = useState(false)
  const [screen, setScreen] = useState<DriverAppScreen>('login')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
    fuel: '',
    km: '',
    tripFrom: '',
    tripTo: '',
    tripDistance: '',
  })
  const { drivers, vehicles, addFuelEntry, addTrip } = useFleetStore()
  const driver = drivers.find(d => d.id === driverId)
  const vehicle = vehicles.find(v => v.id === driver?.vehicleId)

  const handleLogin = () => {
    if (formData.phone.length === 10) {
      setIsLoggedIn(true)
      setScreen('dashboard')
      toast({
        title: 'Welcome Back!',
        description: `Logged in as ${driver?.name}`,
      })
    } else {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive'
      })
    }
  }

  const handleFuelSubmit = () => {
    if (formData.fuel && formData.km && driver && vehicle) {
      addFuelEntry({
        vehicle: vehicle.regNo,
        vehicleId: vehicle.id,
        driver: driver.name,
        driverId: driver.id,
        date: new Date().toISOString().split('T')[0],
        km: parseFloat(formData.km),
        fuel: parseFloat(formData.fuel),
        cost: parseFloat(formData.fuel) * 99, // Simulated cost
        kmpl: parseFloat(formData.km) / parseFloat(formData.fuel),
        vendor: 'Fuel Station',
      })
      toast({
        title: 'Fuel Entry Added',
        description: 'Fuel entry has been recorded successfully',
      })
      setFormData({ ...formData, fuel: '', km: '' })
      setScreen('dashboard')
    }
  }

  const handleKmUpdate = () => {
    if (formData.km && driver && vehicle) {
      // Update vehicle KM (simplified)
      toast({
        title: 'KM Updated',
        description: `Vehicle KM updated to ${formData.km}`,
      })
      setFormData({ ...formData, km: '' })
      setScreen('dashboard')
    }
  }

  const handleTripSubmit = () => {
    if (formData.tripFrom && formData.tripTo && formData.tripDistance && driver && vehicle) {
      addTrip({
        vehicle: vehicle.regNo,
        vehicleId: vehicle.id,
        driver: driver.name,
        driverId: driver.id,
        from: formData.tripFrom,
        to: formData.tripTo,
        date: new Date().toISOString().split('T')[0],
        distance: parseFloat(formData.tripDistance),
        freight: 0,
        fuelCost: 0,
        tollCost: 0,
        otherCost: 0,
        status: 'active',
      })
      toast({
        title: 'Trip Started',
        description: `Trip from ${formData.tripFrom} to ${formData.tripTo} has been started`,
      })
      setFormData({
        ...formData,
        tripFrom: '', tripTo: '', tripDistance: ''
      })
      setScreen('dashboard')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setScreen('login')
    setFormData({
      phone: '', otp: '', fuel: '', km: '',
      tripFrom: '', tripTo: '', tripDistance: ''
    })
  }

  const screens = {
    login: (
      <motion.div
        key="login"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2 pt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Fleet Driver App</h2>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              maxLength={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">OTP (Optional)</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              maxLength={6}
            />
          </div>

          <Button onClick={handleLogin} className="w-full">
            <LogOut className="h-4 w-4 mr-2 rotate-180" />
            Login
          </Button>
        </div>
      </motion.div>
    ),

    dashboard: (
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-b-2xl -mx-4 -mt-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{driver?.name}</p>
                <p className="text-xs text-white/80">{driver?.empId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Gauge className="h-5 w-5 mb-1" />
              <p className="text-2xl font-bold">{vehicle?.kmReading || 0}</p>
              <p className="text-xs text-white/80">Total KM</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <Fuel className="h-5 w-5 mb-1" />
              <p className="text-2xl font-bold">{driver?.fuelEfficiency || 0}</p>
              <p className="text-xs text-white/80">KM/L</p>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        {vehicle && (
          <div className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Assigned Vehicle</span>
              <Badge variant="outline" className="text-xs">{vehicle.status}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{vehicle.regNo}</p>
                <p className="text-xs text-muted-foreground">{vehicle.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <MapPin className="h-3 w-3" />
              {vehicle.location || 'Location unknown'}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => setScreen('fuel')}
            >
              <Fuel className="h-6 w-6" />
              <span className="text-xs">Add Fuel</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => setScreen('km')}
            >
              <Gauge className="h-6 w-6" />
              <span className="text-xs">Update KM</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => setScreen('trip')}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-xs">New Trip</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-1"
              onClick={() => setScreen('profile')}
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">Recent Activity</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Last Trip Completed</p>
                <p className="text-xs text-muted-foreground">{driver?.lastTrip || 'No recent trips'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ),

    fuel: (
      <motion.div
        key="fuel"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setScreen('dashboard')}>
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <h2 className="text-lg font-semibold">Add Fuel Entry</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fuel-amount">Fuel Amount (Liters)</Label>
            <Input
              id="fuel-amount"
              type="number"
              placeholder="85"
              value={formData.fuel}
              onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel-km">Current KM Reading</Label>
            <Input
              id="fuel-km"
              type="number"
              placeholder="48320"
              value={formData.km}
              onChange={(e) => setFormData({ ...formData, km: e.target.value })}
            />
          </div>

          {formData.fuel && formData.km && (
            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Estimated KM/L: <span className="font-bold">
                  {(parseFloat(formData.km) / parseFloat(formData.fuel)).toFixed(2)}
                </span>
              </p>
            </div>
          )}

          <Button onClick={handleFuelSubmit} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Entry
          </Button>
        </div>
      </motion.div>
    ),

    km: (
      <motion.div
        key="km"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setScreen('dashboard')}>
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <h2 className="text-lg font-semibold">Update KM Reading</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <Gauge className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-3xl font-bold">{vehicle?.kmReading || 0}</p>
            <p className="text-sm text-muted-foreground">Current KM Reading</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="km-reading">New KM Reading</Label>
            <Input
              id="km-reading"
              type="number"
              placeholder="Enter new KM reading"
              value={formData.km}
              onChange={(e) => setFormData({ ...formData, km: e.target.value })}
            />
          </div>

          {formData.km && vehicle && parseFloat(formData.km) > vehicle.kmReading && (
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                Distance covered: <span className="font-bold">
                  {(parseFloat(formData.km) - vehicle.kmReading).toLocaleString()} KM
                </span>
              </p>
            </div>
          )}

          <Button onClick={handleKmUpdate} className="w-full">
            <Gauge className="h-4 w-4 mr-2" />
            Update KM
          </Button>
        </div>
      </motion.div>
    ),

    trip: (
      <motion.div
        key="trip"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setScreen('dashboard')}>
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <h2 className="text-lg font-semibold">New Trip</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trip-from">From</Label>
            <Input
              id="trip-from"
              placeholder="Chennai"
              value={formData.tripFrom}
              onChange={(e) => setFormData({ ...formData, tripFrom: e.target.value })}
            />
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trip-to">To</Label>
            <Input
              id="trip-to"
              placeholder="Bangalore"
              value={formData.tripTo}
              onChange={(e) => setFormData({ ...formData, tripTo: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trip-distance">Distance (KM)</Label>
            <Input
              id="trip-distance"
              type="number"
              placeholder="350"
              value={formData.tripDistance}
              onChange={(e) => setFormData({ ...formData, tripDistance: e.target.value })}
            />
          </div>

          <Button onClick={handleTripSubmit} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Start Trip
          </Button>
        </div>
      </motion.div>
    ),

    profile: (
      <motion.div
        key="profile"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setScreen('dashboard')}>
            <ArrowRight className="h-5 w-5 rotate-180" />
          </Button>
          <h2 className="text-lg font-semibold">My Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">{driver?.name}</p>
              <p className="text-sm text-muted-foreground">{driver?.empId}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted p-3 rounded-lg text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-lg font-bold">{driver?.trips || 0}</p>
              <p className="text-xs text-muted-foreground">Trips</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Gauge className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <p className="text-lg font-bold">{driver?.kmDriven || 0}</p>
              <p className="text-xs text-muted-foreground">KM</p>
            </div>
            <div className="bg-muted p-3 rounded-lg text-center">
              <Fuel className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <p className="text-lg font-bold">{driver?.fuelEfficiency || 0}</p>
              <p className="text-xs text-muted-foreground">KM/L</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="font-medium">{driver?.phone}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">License</span>
              <span className="font-medium text-sm">{driver?.license}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Experience</span>
              <span className="font-medium">{driver?.experience}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Joined</span>
              <span className="font-medium text-sm">{driver?.joinDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      </motion.div>
    ),
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-sm">
        {/* Mobile Phone Frame */}
        <div className="relative bg-background rounded-3xl overflow-hidden shadow-2xl">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

          {/* Status Bar */}
          <div className="h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-between px-6 pt-2">
            <span className="text-white text-xs font-medium">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white/80 rounded-sm" />
              <div className="w-4 h-2 bg-white/80 rounded-sm" />
              <div className="w-4 h-3 bg-white rounded-sm" />
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[500px] overflow-y-auto">
            <DialogHeader className="px-4 pt-4 pb-2">
              <DialogTitle className="sr-only">Driver App</DialogTitle>
            </DialogHeader>

            <div className="px-4 pb-4">
              <AnimatePresence mode="wait">
                {screens[screen]}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation */}
          {isLoggedIn && (
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t p-2">
              <div className="flex justify-around">
                <button
                  onClick={() => setScreen('dashboard')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    screen === 'dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs">Home</span>
                </button>
                <button
                  onClick={() => setScreen('trip')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    screen === 'trip' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground'
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Trip</span>
                </button>
                <button
                  onClick={() => setScreen('fuel')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    screen === 'fuel' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground'
                  }`}
                >
                  <Fuel className="h-5 w-5" />
                  <span className="text-xs">Fuel</span>
                </button>
                <button
                  onClick={() => setScreen('profile')}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    screen === 'profile' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-muted-foreground'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
