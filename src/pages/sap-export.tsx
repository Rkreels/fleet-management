'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '@/components/Layout'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  FileDown, Calendar, Database, Download, History,
  CheckCircle, Clock, AlertCircle, Truck, Users, Route,
  Fuel as FuelIcon, Wrench
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type DataType = 'vehicles' | 'drivers' | 'trips' | 'fuel' | 'maintenance'

interface ExportHistory {
  id: number
  dataType: DataType
  date: string
  records: number
  status: 'completed' | 'pending' | 'failed'
}

export default function SAPExportPage() {
  const { vehicles, drivers, trips, fuelEntries, maintenance } = useFleetStore()
  const [dataType, setDataType] = useState<DataType>('vehicles')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'history'>('preview')

  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    { id: 1, dataType: 'vehicles', date: '2026-01-14 10:30', records: 5, status: 'completed' },
    { id: 2, dataType: 'fuel', date: '2026-01-13 15:45', records: 5, status: 'completed' },
    { id: 3, dataType: 'trips', date: '2026-01-12 09:15', records: 5, status: 'completed' },
    { id: 4, dataType: 'maintenance', date: '2026-01-10 14:20', records: 5, status: 'completed' },
  ])

  const getDataTypeIcon = (type: DataType) => {
    switch (type) {
      case 'vehicles': return <Truck className="h-4 w-4" />
      case 'drivers': return <Users className="h-4 w-4" />
      case 'trips': return <Route className="h-4 w-4" />
      case 'fuel': return <FuelIcon className="h-4 w-4" />
      case 'maintenance': return <Wrench className="h-4 w-4" />
    }
  }

  const getDataTypeLabel = (type: DataType) => {
    switch (type) {
      case 'vehicles': return 'Vehicles'
      case 'drivers': return 'Drivers'
      case 'trips': return 'Trips'
      case 'fuel': return 'Fuel'
      case 'maintenance': return 'Maintenance'
    }
  }

  const getPreviewData = () => {
    switch (dataType) {
      case 'vehicles':
        return vehicles.map(v => ({
          'ID': v.id,
          'Registration No': v.regNo,
          'Model': v.model,
          'Status': v.status,
          'Driver': v.driver,
          'KM Reading': v.kmReading,
          'Location': v.location
        }))
      case 'drivers':
        return drivers.map(d => ({
          'ID': d.id,
          'Name': d.name,
          'Employee ID': d.empId,
          'Phone': d.phone,
          'Status': d.status,
          'Trips': d.trips,
          'KM Driven': d.kmDriven
        }))
      case 'trips':
        return trips.map(t => ({
          'ID': t.id,
          'Vehicle': t.vehicle,
          'Driver': t.driver,
          'From': t.from,
          'To': t.to,
          'Date': t.date,
          'Distance (KM)': t.distance,
          'Freight (৳)': t.freight
        }))
      case 'fuel':
        return fuelEntries.map(f => ({
          'ID': f.id,
          'Vehicle': f.vehicle,
          'Driver': f.driver,
          'Date': f.date,
          'KM': f.km,
          'Fuel (L)': f.fuel,
          'Cost (৳)': f.cost,
          'KMPL': f.kmpl
        }))
      case 'maintenance':
        return maintenance.map(m => ({
          'ID': m.id,
          'Vehicle': m.vehicle,
          'Date': m.date,
          'Work': m.work,
          'Vendor': m.vendor,
          'Cost (৳)': m.cost,
          'VAT (৳)': m.vat,
          'Status': m.status
        }))
    }
  }

  const previewData = getPreviewData()

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast.error('Please select date range')
      return
    }
    setIsExporting(true)

    setTimeout(() => {
      setIsExporting(false)
      setShowPreview(true)

      // Add to export history
      const newExport: ExportHistory = {
        id: exportHistory.length + 1,
        dataType,
        date: new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        records: previewData.length,
        status: 'completed'
      }
      setExportHistory([newExport, ...exportHistory])

      toast.success(`Successfully exported ${previewData.length} ${getDataTypeLabel(dataType)} records to SAP format`)
    }, 1500)
  }

  const getStatusBadge = (status: ExportHistory['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      case 'failed':
        return <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
    }
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SAP Export</h1>
            <p className="text-muted-foreground mt-1">Export fleet data to SAP system format</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setActiveTab('history')}>
              <History className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </div>

        {/* Export Configuration */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Data Type</Label>
              <Select value={dataType} onValueChange={(value: DataType) => {
                setDataType(value)
                setShowPreview(false)
              }}>
                <SelectTrigger>
                  <Database className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicles">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Vehicles
                    </div>
                  </SelectItem>
                  <SelectItem value="drivers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Drivers
                    </div>
                  </SelectItem>
                  <SelectItem value="trips">
                    <div className="flex items-center gap-2">
                      <Route className="h-4 w-4" />
                      Trips
                    </div>
                  </SelectItem>
                  <SelectItem value="fuel">
                    <div className="flex items-center gap-2">
                      <FuelIcon className="h-4 w-4" />
                      Fuel
                    </div>
                  </SelectItem>
                  <SelectItem value="maintenance">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4" />
                      Maintenance
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isExporting ? (
                  <>
                    <FileDown className="h-4 w-4 mr-2 animate-pulse" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export to SAP
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs for Preview and History */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preview' | 'history')}>
          <TabsList>
            <TabsTrigger value="preview">Data Preview</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
          </TabsList>

          {/* Data Preview */}
          <TabsContent value="preview" className="space-y-4">
            <AnimatePresence>
              {showPreview && previewData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getDataTypeIcon(dataType)}
                        <h3 className="text-lg font-semibold">
                          {getDataTypeLabel(dataType)} Data Preview
                        </h3>
                        <Badge variant="outline">{previewData.length} records</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const csv = [
                            Object.keys(previewData[0]).join(','),
                            ...previewData.map(row => Object.values(row).join(','))
                          ].join('\n')

                          const blob = new Blob([csv], { type: 'text/csv' })
                          const url = window.URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `sap-export-${dataType}-${Date.now()}.csv`
                          a.click()
                          window.URL.revokeObjectURL(url)

                          toast.success('CSV downloaded successfully')
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
                    </div>

                    <div className="rounded-md border max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background">
                          <TableRow>
                            {Object.keys(previewData[0]).map((key) => (
                              <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.slice(0, 50).map((row, i) => (
                            <TableRow key={i}>
                              {Object.values(row).map((value, j) => (
                                <TableCell key={j} className="whitespace-nowrap">
                                  {String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {previewData.length > 50 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing first 50 of {previewData.length} records
                      </p>
                    )}
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Data Preview</h3>
                  <p className="text-muted-foreground">
                    Select data type and date range, then click "Export to SAP" to preview data
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Export History */}
          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Exports</h3>
              <div className="rounded-md border max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDataTypeIcon(item.dataType)}
                            <span>{getDataTypeLabel(item.dataType)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.records}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  )
}
