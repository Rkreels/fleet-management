'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import { User, Upload, Camera, FileText, Check, Plus, X } from 'lucide-react'

interface AddDriverModalProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function AddDriverModal({ children, onSuccess }: AddDriverModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addDriver, vehicles } = useFleetStore()
  
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
  })

  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  const [documents, setDocuments] = useState({
    aadhaar: { file: null as File | null },
    pan: { file: null as File | null },
    policeVerification: { file: null as File | null },
    medical: { file: null as File | null },
  })

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

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { file }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      
      const newDriver = {
        name: driverDetails.name,
        empId: driverDetails.empId || `EMP-${String(Date.now()).slice(-3)}`,
        phone: driverDetails.phone,
        license: driverDetails.license,
        licenseExpiry: driverDetails.licenseExpiry,
        insurance: driverDetails.insurance,
        insuranceExpiry: driverDetails.insuranceExpiry,
        status: 'active' as const,
        vehicle: vehicle?.regNo || '',
        vehicleId: vehicle?.id,
        joinDate: driverDetails.joinDate,
        address: driverDetails.address,
        photo: photoPreview || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        trips: 0,
        kmDriven: 0,
        fuelEfficiency: '0',
        rating: 0,
        violations: 0,
        lastTrip: '',
        experience: driverDetails.experience || '0 Years',
      }

      addDriver(newDriver)
      
      toast({
        title: 'Driver Added Successfully',
        description: `Driver ${driverDetails.name} has been added to the fleet`,
      })

      // Reset form
      setDriverDetails({
        name: '', empId: '', phone: '', license: '', licenseExpiry: '',
        insurance: '', insuranceExpiry: '', vehicleId: '', joinDate: '', address: '', experience: ''
      })
      setPhoto(null)
      setPhotoPreview('')
      setDocuments({
        aadhaar: { file: null },
        pan: { file: null },
        policeVerification: { file: null },
        medical: { file: null },
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add driver. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Driver
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
                    // Simulate camera capture
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
                  {vehicles.filter(v => !v.driverId).map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.regNo} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'aadhaar', label: 'Aadhaar Card' },
                { key: 'pan', label: 'PAN Card' },
                { key: 'policeVerification', label: 'Police Verification' },
                { key: 'medical', label: 'Medical Certificate' },
              ].map(doc => (
                <div key={doc.key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{doc.label}</span>
                    </div>
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Upload className="h-4 w-4" />
                        {documents[doc.key as keyof typeof documents].file ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <Check className="h-4 w-4" />
                            Uploaded
                          </span>
                        ) : (
                          <span>Upload</span>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => handleDocumentUpload(doc.key, e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Driver...' : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Driver
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
