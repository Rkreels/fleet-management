'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFleetStore, Driver } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { User, Upload, Camera, FileText, Check, X, Save } from 'lucide-react'

interface EditDriverModalProps {
  driverId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditDriverModal({ driverId, open, onOpenChange, onSuccess }: EditDriverModalProps) {
  const { updateDriver, vehicles, drivers } = useFleetStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const driver = drivers.find(d => d.id === driverId)
  
  const [driverDetails, setDriverDetails] = useState({
    name: '',
    empId: '',
    phone: '',
    license: '',
    licenseExpiry: '',
    insurance: '',
    insuranceExpiry: '',
    vehicleId: '',
    joinDate: '',
    address: '',
    experience: '',
    status: 'active' as 'active' | 'inactive',
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    if (driver && open) {
      setDriverDetails({
        name: driver.name,
        empId: driver.empId,
        phone: driver.phone,
        license: driver.license,
        licenseExpiry: driver.licenseExpiry,
        insurance: driver.insurance,
        insuranceExpiry: driver.insuranceExpiry,
        vehicleId: driver.vehicleId?.toString() || '',
        joinDate: driver.joinDate,
        address: driver.address,
        experience: driver.experience,
        status: driver.status,
      })
      setPhotoPreview(driver.photo)
    }
  }, [driver, open])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(null)
    setPhotoPreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!driver) return

    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!driverDetails.name || !driverDetails.phone || !driverDetails.license) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields (Name, Phone, License)',
          variant: 'destructive'
        })
        setIsSubmitting(false)
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const vehicle = vehicles.find(v => v.id === Number(driverDetails.vehicleId))
      
      const updatedDriver: Partial<Driver> = {
        name: driverDetails.name,
        empId: driverDetails.empId,
        phone: driverDetails.phone,
        license: driverDetails.license,
        licenseExpiry: driverDetails.licenseExpiry,
        insurance: driverDetails.insurance,
        insuranceExpiry: driverDetails.insuranceExpiry,
        status: driverDetails.status,
        vehicle: vehicle?.regNo || '',
        vehicleId: vehicle?.id,
        joinDate: driverDetails.joinDate,
        address: driverDetails.address,
        photo: photoPreview || driver.photo,
        experience: driverDetails.experience,
      }

      updateDriver(driver.id, updatedDriver)
      
      toast({
        title: 'Driver Updated Successfully',
        description: `Driver ${driverDetails.name} has been updated`,
      })
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update driver. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!driver) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Driver - {driver.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6"
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-muted">
                {photoPreview ? (
                  <AvatarImage src={photoPreview} alt="Driver photo" />
                ) : (
                  <AvatarFallback>
                    <User className="h-12 w-12 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="photo" className="text-sm font-medium">
                Driver Photo
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Upload a clear photo of the driver
              </p>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: 'Camera',
                      description: 'Camera feature would open device camera',
                    })
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Capture
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Rajan Kumar"
                  value={driverDetails.name}
                  onChange={(e) => setDriverDetails({ ...driverDetails, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={driverDetails.phone}
                  onChange={(e) => setDriverDetails({ ...driverDetails, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="empId">Employee ID</Label>
                <Input
                  id="empId"
                  placeholder="EMP-001"
                  value={driverDetails.empId}
                  onChange={(e) => setDriverDetails({ ...driverDetails, empId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number *</Label>
                <Input
                  id="license"
                  placeholder="TN0120240012345"
                  value={driverDetails.license}
                  onChange={(e) => setDriverDetails({ ...driverDetails, license: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={driverDetails.licenseExpiry}
                  onChange={(e) => setDriverDetails({ ...driverDetails, licenseExpiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  placeholder="5 Years"
                  value={driverDetails.experience}
                  onChange={(e) => setDriverDetails({ ...driverDetails, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Provider</Label>
                <Input
                  id="insurance"
                  placeholder="HDFC-DRV-001"
                  value={driverDetails.insurance}
                  onChange={(e) => setDriverDetails({ ...driverDetails, insurance: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={driverDetails.insuranceExpiry}
                  onChange={(e) => setDriverDetails({ ...driverDetails, insuranceExpiry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={driverDetails.joinDate}
                  onChange={(e) => setDriverDetails({ ...driverDetails, joinDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={driverDetails.status}
                  onValueChange={(value: 'active' | 'inactive') => setDriverDetails({ ...driverDetails, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="12, Anna Nagar, Chennai - 600040"
                  value={driverDetails.address}
                  onChange={(e) => setDriverDetails({ ...driverDetails, address: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vehicle Assignment</h3>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Assign Vehicle</Label>
              <Select
                value={driverDetails.vehicleId}
                onValueChange={(value) => setDriverDetails({ ...driverDetails, vehicleId: value })}
              >
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle to assign (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Vehicle Assigned</SelectItem>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.regNo} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
