'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useFleetStore, Vehicle } from '@/lib/store'
import { toast } from 'sonner'
import { Car, Upload, ChevronLeft, ChevronRight, FileText, Check, Save } from 'lucide-react'

interface EditVehicleModalProps {
  vehicleId: number
  children: React.ReactNode
  onSuccess?: () => void
}

export function EditVehicleModal({ vehicleId, children, onSuccess }: EditVehicleModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { vehicles, drivers, updateVehicle } = useFleetStore()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  
  // Step 1: Vehicle Details
  const [vehicleDetails, setVehicleDetails] = useState({
    regNo: '',
    model: '',
    chassis: '',
    engine: '',
    driverId: '',
    gpsId: '',
    fuelCard: '',
    fastagId: '',
    purchaseDate: '',
    location: '',
    status: 'active' as 'active' | 'inactive',
    kmReading: 0,
    fuelLevel: 0,
  })

  // Step 2: Documents
  const [documents, setDocuments] = useState({
    rc: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    fc: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    insurance: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    permit: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    nationalPermit: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    roadTax: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
    puc: { file: null as File | null, expiry: '', status: 'ok' as 'ok' | 'expired' | 'due' },
  })

  // Load vehicle data when modal opens
  useEffect(() => {
    if (open) {
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
        
        // Populate vehicle details
        setVehicleDetails({
          regNo: foundVehicle.regNo,
          model: foundVehicle.model,
          chassis: foundVehicle.chassis,
          engine: foundVehicle.engine,
          driverId: foundVehicle.driverId?.toString() || '',
          gpsId: foundVehicle.gpsId,
          fuelCard: foundVehicle.fuelCard,
          fastagId: foundVehicle.fastagId,
          purchaseDate: foundVehicle.purchaseDate,
          location: foundVehicle.location,
          status: foundVehicle.status,
          kmReading: foundVehicle.kmReading,
          fuelLevel: foundVehicle.fuelLevel,
        })

        // Populate documents
        if (foundVehicle.documents && foundVehicle.documents.length > 0) {
          const docsMap = {
            rc: { ...documents.rc, expiry: foundVehicle.documents.find(d => d.name === 'RC')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'RC')?.status || 'ok' },
            fc: { ...documents.fc, expiry: foundVehicle.documents.find(d => d.name === 'FC')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'FC')?.status || 'ok' },
            insurance: { ...documents.insurance, expiry: foundVehicle.documents.find(d => d.name === 'Insurance')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'Insurance')?.status || 'ok' },
            permit: { ...documents.permit, expiry: foundVehicle.documents.find(d => d.name === 'Permit')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'Permit')?.status || 'ok' },
            nationalPermit: { ...documents.nationalPermit, expiry: foundVehicle.documents.find(d => d.name === 'National Permit')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'National Permit')?.status || 'ok' },
            roadTax: { ...documents.roadTax, expiry: foundVehicle.documents.find(d => d.name === 'Road Tax')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'Road Tax')?.status || 'ok' },
            puc: { ...documents.puc, expiry: foundVehicle.documents.find(d => d.name === 'PUC')?.expiry || '', status: foundVehicle.documents.find(d => d.name === 'PUC')?.status || 'ok' },
          }
          setDocuments(docsMap)
        }

        setStep(1)
      }
    }
  }, [open, vehicleId, vehicles])

  const handleDocumentUpload = (docType: string, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { ...prev[docType as keyof typeof prev], file }
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (!vehicleDetails.regNo || !vehicleDetails.model || !vehicleDetails.chassis || !vehicleDetails.engine) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields (Registration No, Model, Chassis No, Engine No)',
          variant: 'destructive'
        })
        return
      }
      setStep(2)
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setIsSubmitting(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const driver = drivers.find(d => d.id === Number(vehicleDetails.driverId))
      
      const updatedVehicleData = {
        regNo: vehicleDetails.regNo,
        model: vehicleDetails.model,
        chassis: vehicleDetails.chassis,
        engine: vehicleDetails.engine,
        driver: driver?.name || '',
        driverId: driver?.id,
        gpsId: vehicleDetails.gpsId,
        fuelCard: vehicleDetails.fuelCard,
        fastagId: vehicleDetails.fastagId,
        status: vehicleDetails.status,
        kmReading: vehicleDetails.kmReading,
        fuelLevel: vehicleDetails.fuelLevel,
        location: vehicleDetails.location,
        purchaseDate: vehicleDetails.purchaseDate,
        documents: [
          { name: 'RC', expiry: documents.rc.expiry, status: documents.rc.status },
          { name: 'FC', expiry: documents.fc.expiry, status: documents.fc.status },
          { name: 'Insurance', expiry: documents.insurance.expiry, status: documents.insurance.status },
          { name: 'Permit', expiry: documents.permit.expiry, status: documents.permit.status },
          { name: 'National Permit', expiry: documents.nationalPermit.expiry, status: documents.nationalPermit.status },
          { name: 'Road Tax', expiry: documents.roadTax.expiry, status: documents.roadTax.status },
          { name: 'PUC', expiry: documents.puc.expiry, status: documents.puc.status },
        ],
      }

      updateVehicle(vehicle.id, updatedVehicleData)
      
      toast({
        title: 'Vehicle Updated Successfully',
        description: `Vehicle ${vehicleDetails.regNo} has been updated`,
      })
      
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle. Please try again.',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Edit Vehicle - {vehicle?.regNo}
          </DialogTitle>
        </DialogHeader>

        {vehicle && (
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Vehicle Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="regNo">Registration Number *</Label>
                      <Input
                        id="regNo"
                        placeholder="TN 09 AB 1234"
                        value={vehicleDetails.regNo}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, regNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input
                        id="model"
                        placeholder="Tata Prima 4028.S"
                        value={vehicleDetails.model}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, model: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chassis">Chassis Number *</Label>
                      <Input
                        id="chassis"
                        placeholder="MAT445103K2B12345"
                        value={vehicleDetails.chassis}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, chassis: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="engine">Engine Number *</Label>
                      <Input
                        id="engine"
                        placeholder="4928CRDL12345"
                        value={vehicleDetails.engine}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, engine: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driver">Assigned Driver</Label>
                      <Select
                        value={vehicleDetails.driverId}
                        onValueChange={(value) => setVehicleDetails({ ...vehicleDetails, driverId: value })}
                      >
                        <SelectTrigger id="driver">
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              {driver.name} ({driver.empId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={vehicleDetails.status}
                        onValueChange={(value: 'active' | 'inactive') => setVehicleDetails({ ...vehicleDetails, status: value })}
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
                    <div className="space-y-2">
                      <Label htmlFor="gpsId">GPS Device ID</Label>
                      <Input
                        id="gpsId"
                        placeholder="GPS-001"
                        value={vehicleDetails.gpsId}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, gpsId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelCard">Fuel Card Number</Label>
                      <Input
                        id="fuelCard"
                        placeholder="FC-2024-001"
                        value={vehicleDetails.fuelCard}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, fuelCard: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fastagId">FASTag ID</Label>
                      <Input
                        id="fastagId"
                        placeholder="FT-TN-001"
                        value={vehicleDetails.fastagId}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, fastagId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kmReading">KM Reading</Label>
                      <Input
                        id="kmReading"
                        type="number"
                        value={vehicleDetails.kmReading}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, kmReading: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
                      <Input
                        id="fuelLevel"
                        type="number"
                        min="0"
                        max="100"
                        value={vehicleDetails.fuelLevel}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, fuelLevel: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input
                        id="purchaseDate"
                        type="date"
                        value={vehicleDetails.purchaseDate}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, purchaseDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="location">Current Location</Label>
                      <Input
                        id="location"
                        placeholder="Chennai, TN"
                        value={vehicleDetails.location}
                        onChange={(e) => setVehicleDetails({ ...vehicleDetails, location: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Documents */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    Update vehicle documents and set their expiry dates
                  </p>

                  <div className="space-y-3">
                    {[
                      { key: 'rc', label: 'RC Book' },
                      { key: 'fc', label: 'Fitness Certificate' },
                      { key: 'insurance', label: 'Insurance' },
                      { key: 'permit', label: 'Permit' },
                      { key: 'nationalPermit', label: 'National Permit' },
                      { key: 'roadTax', label: 'Road Tax' },
                      { key: 'puc', label: 'PUC Certificate' },
                    ].map(doc => (
                      <div key={doc.key} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{doc.label}</span>
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
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              type="date"
                              value={documents[doc.key as keyof typeof documents].expiry}
                              onChange={(e) => setDocuments(prev => ({
                                ...prev,
                                [doc.key]: { ...prev[doc.key as keyof typeof prev], expiry: e.target.value }
                              }))}
                            />
                          </div>
                          <Select
                            value={documents[doc.key as keyof typeof documents].status}
                            onValueChange={(value: 'ok' | 'expired' | 'due') => setDocuments(prev => ({
                              ...prev,
                              [doc.key]: { ...prev[doc.key as keyof typeof prev], status: value }
                            }))}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ok">Valid</SelectItem>
                              <SelectItem value="due">Due Soon</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className={`h-2 w-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`h-2 w-8 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            </div>

            <DialogFooter className="mt-6">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {step === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
