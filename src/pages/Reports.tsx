'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFleetStore } from '@/lib/store'
import { toast } from '@/lib/toast'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  FileText, Download, Calendar, Filter, BarChart3, TrendingUp,
  Fuel, Truck, Wrench, ChevronDown, FileSpreadsheet, File
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type ReportType = 'vehicle' | 'driver' | 'fuel' | 'trip' | 'maintenance'
type FilterType = 'all' | 'critical' | 'warning' | 'info'

export default function ReportsPage() {
  const { vehicles, drivers, fuelEntries, trips, maintenance } = useFleetStore()
  const [reportType, setReportType] = useState<ReportType>('vehicle')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error('Please select date range')
      return
    }
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowPreview(true)
      toast.success('Report generated successfully')
    }, 1000)
  }

  const handleExportPDF = () => {
    // Generate a text/HTML report and download it
    const reportDate = new Date().toISOString().split('T')[0]
    const reportTitle = `${getReportTitle()} - ${reportDate}`

    // Generate HTML content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 40px;
      background: #f5f5f5;
    }
    h1 { color: #1e293b; margin-bottom: 20px; }
    .section { margin-bottom: 40px; }
    .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .data-table th, .data-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    .data-table th { background: #f97316; color: white; }
    .data-table tr:nth-child(even) { background: #f9fafb; }
    .data-table tr:hover { background: #ffffff; }
  </style>
</head>
<body>
  <h1>${reportTitle}</h1>
  <p>Generated on: ${new Date().toLocaleString()}</p>
  <section>
    <h2>Report Parameters</h2>
    <table class="data-table">
      <tr><th>Parameter</th><th>Value</th></tr>
      <tr><td>Report Type</td><td>${getReportTitle()}</td></tr>
      <tr><td>Start Date</td><td>${startDate || 'Not specified'}</td></tr>
      <tr><td>End Date</td><td>${endDate || 'Not specified'}</td></tr>
    </table>
  </section>
  <section>
    <h2>Summary</h2>
  ${renderChart()}
  </section>
</body>
</html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `report-${reportDate.replace(/-/g, '')}.html`
  a.click()
  window.URL.revokeObjectURL(url)

  toast.success(`Report exported successfully to ${reportDate.replace(/-/g, '')}.html`)
}

  const handleExportCSV = () => {
    let csvContent = ''
    const reportDate = new Date().toISOString().split('T')[0]

    if (reportType === 'vehicle') {
      csvContent = ['Vehicle Registration No, Model, Chassis, Engine, Driver, Status, KM Reading, Fuel Level, Location, Purchase Date'].join(',')
      csvContent += vehicles.map(v =>
        [v.regNo, v.model, v.chassis, v.engine, v.driver, v.status, v.kmReading, v.fuelLevel, v.location, v.purchaseDate].join(',')
      ).join('\n')
    } else if (reportType === 'driver') {
      csvContent = ['Employee ID, Name, Phone, License, License Expiry, Insurance, Insurance Expiry, Status, Vehicle, Join Date, Experience, Trips, KM Driven, Fuel Efficiency, Rating, Violations, Last Trip'].join(',')
      csvContent += drivers.map(d =>
        [d.empId, d.name, d.phone, d.license, d.licenseExpiry, d.insurance, d.insuranceExpiry, d.status, d.vehicle, d.joinDate, d.experience, d.trips, d.kmDriven, d.fuelEfficiency, d.rating, d.violations, d.lastTrip].join(',')
      ).join('\n')
    } else if (reportType === 'fuel') {
      csvContent = ['Date, Vehicle, Driver, Fuel (L), Cost (৳), KMPL, Vendor'].join(',')
      csvContent += fuelEntries.map(f =>
        [f.date, f.vehicle, f.driver, f.fuel, f.cost.toFixed(2), f.kmpl, f.vendor].join(',')
      ).join('\n')
    } else if (reportType === 'trip') {
      csvContent = ['From, To, Distance (KM), Freight (৳), Fuel Cost (৳), Toll Cost (৳), Other Cost (৳), Profit (৳)'].join(',')
      csvContent += trips.map(t =>
        [t.from, t.to, t.distance, t.freight, t.fuelCost, t.tollCost, t.otherCost, (t.freight - t.fuelCost - t.tollCost - t.otherCost).toFixed(2)].join(',')
      ).join('\n')
    } else if (reportType === 'maintenance') {
      csvContent = ['Vehicle, Work Done, Vendor, Cost (৳), VAT (৳), Total (৳)'].join(',')
      csvContent += maintenance.map(m =>
        [m.vehicle, m.work.substring(0, 20) + '...', m.vendor, m.cost, m.vat, (m.cost + m.vat).toLocaleString()].join(',')
      ).join('\n')
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType}-${reportDate.replace(/-/g, '')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success(`Report CSV exported successfully to ${reportType}-${reportDate.replace(/-/g, '')}.csv`)
  }

  // Vehicle Performance Data
  const vehiclePerformanceData = vehicles.slice(0, 5).map(v => ({
    name: v.regNo,
    km: v.kmReading,
    fuel: v.fuelLevel,
    trips: drivers.find(d => d.vehicle === v.regNo)?.trips || 0
  }))

  // Driver Performance Data
  const driverPerformanceData = drivers.slice(0, 5).map(d => ({
    name: d.name,
    trips: d.trips,
    km: d.kmDriven,
    rating: d.rating * 20,
    efficiency: parseFloat(d.fuelEfficiency)
  }))

  // Fuel Analysis Data
  const fuelAnalysisData = fuelEntries.map(f => ({
    date: f.date,
    fuel: f.fuel,
    cost: f.cost,
    kmpl: f.kmpl,
    vehicle: f.vehicle
  }))

  // Trip Summary Data
  const tripSummaryData = trips.map(t => ({
    from: t.from,
    to: t.to,
    distance: t.distance,
    freight: t.freight,
    fuelCost: t.fuelCost,
    profit: t.freight - t.fuelCost - t.tollCost - t.otherCost
  }))

  // Maintenance Summary Data
  const maintenanceSummaryData = maintenance.map(m => ({
    vehicle: m.vehicle,
    cost: m.cost,
    vat: m.vat,
    total: m.cost + m.vat,
    work: m.work.substring(0, 20) + '...'
  }))

  // Fuel Cost by Vehicle for Pie Chart
  const fuelByVehicle = vehicles.slice(0, 5).map(v => {
    const vehicleFuel = fuelEntries.filter(f => f.vehicle === v.regNo)
    const totalCost = vehicleFuel.reduce((sum, f) => sum + f.cost, 0)
    return { name: v.regNo, value: totalCost }
  })

  const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#eab308', '#ef4444']

  const renderChart = () => {
    switch (reportType) {
      case 'vehicle':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Distance Covered by Vehicle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehiclePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="km" fill="#f97316" name="KM Reading" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Fuel Level Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehiclePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fuel" fill="#22c55e" name="Fuel Level %" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )
      case 'driver':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Driver Trip Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={driverPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trips" fill="#f97316" name="Total Trips" />
                    <Bar dataKey="km" fill="#3b82f6" name="KM Driven" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Driver Ratings</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={driverPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rating" stroke="#22c55e" strokeWidth={2} name="Rating" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>
        )
      case 'fuel':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Fuel Cost by Vehicle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fuelByVehicle}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fuelByVehicle.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Fuel Efficiency Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fuelAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="kmpl" stroke="#f97316" strokeWidth={2} name="KMPL" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fuel Consumption Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Fuel (L)</TableHead>
                    <TableHead>Cost (৳)</TableHead>
                    <TableHead>KMPL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelAnalysisData.slice(0, 10).map((entry, i) => (
                    <TableRow key={i}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.vehicle}</TableCell>
                      <TableCell>{entry.fuel}</TableCell>
                      <TableCell>৳{entry.cost.toLocaleString()}</TableCell>
                      <TableCell>{entry.kmpl}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )
      case 'trip':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Distance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tripSummaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="from" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="distance" fill="#f97316" name="Distance (KM)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Profitability</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tripSummaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="from" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="profit" fill="#22c55e" name="Profit (৳)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Distance (KM)</TableHead>
                    <TableHead>Freight (৳)</TableHead>
                    <TableHead>Fuel Cost (৳)</TableHead>
                    <TableHead>Profit (৳)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tripSummaryData.slice(0, 10).map((trip, i) => (
                    <TableRow key={i}>
                      <TableCell>{trip.from}</TableCell>
                      <TableCell>{trip.to}</TableCell>
                      <TableCell>{trip.distance}</TableCell>
                      <TableCell>৳{trip.freight.toLocaleString()}</TableCell>
                      <TableCell>৳{trip.fuelCost.toLocaleString()}</TableCell>
                      <TableCell className={trip.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ৳{trip.profit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )
      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Maintenance Costs by Vehicle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={maintenanceSummaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="vehicle" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#f97316" name="Total Cost (৳)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Maintenance Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={maintenanceSummaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.vehicle}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {maintenanceSummaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Maintenance Records</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Work Done</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Cost (৳)</TableHead>
                    <TableHead>GST (৳)</TableHead>
                    <TableHead>Total (৳)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.vehicle}</TableCell>
                      <TableCell>{record.work}</TableCell>
                      <TableCell>{record.vendor}</TableCell>
                      <TableCell>৳{record.cost.toLocaleString()}</TableCell>
                      <TableCell>৳{record.vat.toLocaleString()}</TableCell>
                      <TableCell>৳{(record.cost + record.vat).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  const getReportTitle = () => {
    switch (reportType) {
      case 'vehicle': return 'Vehicle Performance Report'
      case 'driver': return 'Driver Performance Report'
      case 'fuel': return 'Fuel Analysis Report'
      case 'trip': return 'Trip Summary Report'
      case 'maintenance': return 'Maintenance Summary Report'
      default: return 'Report'
    }
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
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and analyze fleet performance reports</p>
          </div>
          <div className="flex items-center gap-3">
            {showPreview && (
              <>
                <Button variant="outline" onClick={handleExportPDF}>
                  <File className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Report Configuration */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(value: ReportType) => {
                setReportType(value)
                setShowPreview(false)
              }}>
                <SelectTrigger>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicle">Vehicle Performance</SelectItem>
                  <SelectItem value="driver">Driver Performance</SelectItem>
                  <SelectItem value="fuel">Fuel Analysis</SelectItem>
                  <SelectItem value="trip">Trip Summary</SelectItem>
                  <SelectItem value="maintenance">Maintenance Summary</SelectItem>
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
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isGenerating ? (
                  <>
                    <TrendingUp className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{getReportTitle()}</h2>
                  <Badge variant="outline" className="text-sm">
                    {startDate} to {endDate}
                  </Badge>
                </div>
                {renderChart()}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Report Generated</h3>
            <p className="text-muted-foreground">
              Select a report type and date range, then click "Generate Report" to view analytics
            </p>
          </motion.div>
        )}
      </motion.div>
  )
}

function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
