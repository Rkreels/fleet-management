'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFleetStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { 
  Scan, Camera, Upload, FileText, CheckCircle, 
  AlertCircle, Loader2, Sparkles, X, Download, RefreshCw 
} from 'lucide-react'

interface AIScanModalProps {
  children: React.ReactNode
  documentType?: 'vehicle' | 'driver' | 'fuel' | 'maintenance'
  onScanComplete?: (data: any) => void
}

interface ExtractedData {
  documentNumber?: string
  name?: string
  expiryDate?: string
  issueDate?: string
  vehicleReg?: string
  amount?: number
  vendor?: string
  rawText?: string
}

export function AIScanModal({ children, documentType = 'vehicle', onScanComplete }: AIScanModalProps) {
  const [open, setOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>('')
  const [isCameraActive, setIsCameraActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      startScan()
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please upload a file instead.',
        variant: 'destructive'
      })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageDataUrl = canvas.toDataURL('image/png')
        setFilePreview(imageDataUrl)
        stopCamera()
        startScan()
      }
    }
  }

  const startScan = async () => {
    setIsScanning(true)
    setScanComplete(false)
    setExtractedData(null)

    // Simulate AI scanning process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate extracted data based on document type
    const mockData: ExtractedData = {
      rawText: 'Document scanned successfully. All information has been extracted using AI OCR technology.'
    }

    switch (documentType) {
      case 'vehicle':
        mockData.vehicleReg = 'TN 09 AB 1234'
        mockData.documentNumber = 'MAT445103K2B12345'
        mockData.expiryDate = '2028-06-15'
        mockData.issueDate = '2022-03-15'
        break
      case 'driver':
        mockData.name = 'Rajan Kumar'
        mockData.documentNumber = 'TN0120240012345'
        mockData.expiryDate = '2026-01-25'
        mockData.issueDate = '2021-01-25'
        break
      case 'fuel':
        mockData.vehicleReg = 'TN 09 AB 1234'
        mockData.amount = 8415
        mockData.vendor = 'HP Petrol Pump, Chennai'
        break
      case 'maintenance':
        mockData.vehicleReg = 'TN 09 AB 1234'
        mockData.amount = 8500
        mockData.vendor = 'Sri Murugan Auto Works'
        break
    }

    setExtractedData(mockData)
    setScanComplete(true)
    setIsScanning(false)

    toast({
      title: 'Scan Complete',
      description: 'Document has been scanned and data extracted successfully',
    })

    onScanComplete?.(mockData)
  }

  const handleClose = () => {
    stopCamera()
    setUploadedFile(null)
    setFilePreview('')
    setScanComplete(false)
    setExtractedData(null)
    setOpen(false)
  }

  const handleReset = () => {
    setUploadedFile(null)
    setFilePreview('')
    setScanComplete(false)
    setExtractedData(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            AI Document Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload/Camera Section */}
          {!scanComplete && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {!isCameraActive && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                          <Camera className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm font-medium">Use Camera</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />

                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPG, PNG, PDF
                    </p>
                  </div>
                </div>
              )}

              {isCameraActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-primary/30 m-4 rounded-lg pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 border-2 border-white/50 rounded-lg" />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button type="button" variant="outline" onClick={stopCamera}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="button" onClick={capturePhoto}>
                      <Camera className="h-4 w-4 mr-2" />
                      Capture
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Scanning Animation */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                {filePreview && (
                  <img src={filePreview} alt="Scanning" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-3 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <div>
                      <p className="font-medium">Scanning Document...</p>
                      <p className="text-sm text-white/70">AI is extracting information</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
                <span>Analyzing document structure and text...</span>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {scanComplete && extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Document scanned successfully!
                </p>
              </div>

              {filePreview && (
                <div className="border rounded-lg overflow-hidden">
                  <img src={filePreview} alt="Scanned document" className="w-full max-h-48 object-contain bg-muted" />
                </div>
              )}

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Extracted Data
                </h3>

                <div className="grid gap-3">
                  {extractedData.vehicleReg && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Vehicle Registration</Label>
                      <div className="col-span-2">
                        <Input value={extractedData.vehicleReg} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  {extractedData.name && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <div className="col-span-2">
                        <Input value={extractedData.name} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  {extractedData.documentNumber && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Document Number</Label>
                      <div className="col-span-2">
                        <Input value={extractedData.documentNumber} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  {extractedData.issueDate && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Issue Date</Label>
                      <div className="col-span-2">
                        <Input type="date" value={extractedData.issueDate} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  {extractedData.expiryDate && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Expiry Date</Label>
                      <div className="col-span-2">
                        <Input type="date" value={extractedData.expiryDate} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  {extractedData.amount && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Amount</Label>
                      <div className="col-span-2">
                        <Input 
                          value={`৳${extractedData.amount.toLocaleString()}`} 
                          readOnly 
                          className="bg-muted" 
                        />
                      </div>
                    </div>
                  )}

                  {extractedData.vendor && (
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-sm text-muted-foreground">Vendor</Label>
                      <div className="col-span-2">
                        <Input value={extractedData.vendor} readOnly className="bg-muted" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    <Label className="text-sm text-muted-foreground">Raw Extracted Text</Label>
                    <Textarea
                      value={extractedData.rawText}
                      readOnly
                      rows={3}
                      className="bg-muted resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scan Another
                </Button>
                <Button type="button" onClick={() => {
                  toast({
                    title: 'Data Saved',
                    description: 'Extracted data has been saved successfully',
                  })
                  handleClose()
                }} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Data
                </Button>
              </div>
            </motion.div>
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
