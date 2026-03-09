'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { KpiCard } from '@/components/KpiCard'
import { LiveMapView } from '@/components/LiveMapView'
import { DriverAppView } from '@/components/DriverAppView'
import { StatusBadge } from '@/components/StatusBadge'
import { useFleetStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  Truck, Users, Fuel, AlertTriangle, Bell, Smartphone,
  Calendar, TrendingUp, DollarSign, MoreHorizontal, CheckCircle,
  Clock, MapPin, Fuel as FuelIcon, Download
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
import { Button } from '@/components/ui/button'

// Dashboard main component
export default function Dashboard() {
  const { vehicles, drivers, fuelEntries, alerts, markAlertsRead } = useFleetStore()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate KPIs
  const totalVehicles = vehicles.length
  const activeDrivers = drivers.filter(d => d.status === 'active').length
  const monthlyFuelCost = fuelEntries.reduce((sum, entry) => sum + entry.cost, 0)
  const pendingAlerts = alerts.filter(a => !a.read).length

  // Fuel efficiency trend data
  const fuelEfficiencyData = [
    { month: 'Aug', efficiency: 4.2, cost: 75000 },
    { month: 'Sep', efficiency: 4.5, cost: 82000 },
    { month: 'Oct', efficiency: 4.3, cost: 78000 },
    { month: 'Nov', efficiency: 4.7, cost: 85000 },
    { month: 'Dec', efficiency: 4.9, cost: 91000 },
    { month: 'Jan', efficiency: 4.8, cost: 88000 },
  ]

  // Monthly expenses data
  const monthlyExpensesData = [
    { month: 'Aug', fuel: 75000, maintenance: 25000, toll: 15000, total: 115000 },
    { month: 'Sep', fuel: 82000, maintenance: 18000, toll: 12000, total: 112000 },
    { month: 'Oct', fuel: 78000, maintenance: 32000, toll: 18000, total: 128000 },
    { month: 'Nov', fuel: 85000, maintenance: 22000, toll: 14000, total: 121000 },
    { month: 'Dec', fuel: 91000, maintenance: 28000, toll: 16000, total: 135000 },
    { month: 'Jan', fuel: 88000, maintenance: 20000, toll: 13000, total: 121000 },
  ]

  const handleExportReport = () => {
    setIsLoading(true)
    toast({
      title: 'Generating Report',
      description: 'Please wait while we generate the report...',
    })

    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Report Exported',
        description: 'Dashboard report has been downloaded successfully',
      })
    }, 2000)
  }

  const handleMarkAllRead = () => {
    markAlertsRead()
    toast({
      title: 'Alerts Cleared',
      description: 'All alerts have been marked as read',
    })
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your fleet overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <DriverAppView driverId={1}>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Smartphone className="h-4 w-4 mr-2" />
                Driver App Preview
              </Button>
            </DriverAppView>
            <Button variant="outline" onClick={handleExportReport} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? 'Exporting...' : 'Export Report'}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <KpiCard
            title="Total Vehicles"
            value={totalVehicles}
            icon={Truck}
            color="orange"
            trend={{ value: 12, label: 'vs last month' }}
          />
          <KpiCard
            title="Active Drivers"
            value={activeDrivers}
            icon={Users}
            color="green"
            trend={{ value: 8, label: 'vs last month' }}
          />
          <KpiCard
            title="Monthly Fuel Cost"
            value={`৳${monthlyFuelCost.toLocaleString()}`}
            icon={DollarSign}
            color="blue"
            trend={{ value: -5, label: 'vs last month' }}
          />
          <KpiCard
            title="Pending Alerts"
            value={pendingAlerts}
            icon={AlertTriangle}
            color={pendingAlerts > 0 ? 'red' : 'green'}
            trend={{ value: -15, label: 'vs last month' }}
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fuel Efficiency Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border rounded-xl bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Fuel Efficiency Trend</h2>
                <p className="text-sm text-muted-foreground">Average KM/L over last 6 months</p>
              </div>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={fuelEfficiencyData}>
                <defs>
                  <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#f9fafb' }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEfficiency)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Expenses Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border rounded-xl bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Monthly Expenses</h2>
                <p className="text-sm text-muted-foreground">Breakdown by category</p>
              </div>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpensesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  itemStyle={{ color: '#f9fafb' }}
                />
                <Legend />
                <Bar dataKey="fuel" name="Fuel" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="maintenance" name="Maintenance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="toll" name="Toll" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Map and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Live Map View</h2>
                <p className="text-sm text-muted-foreground">Real-time vehicle tracking</p>
              </div>
              <StatusBadge status="active" size="sm" />
            </div>
            <div className="min-h-[500px]">
              <LiveMapView />
            </div>
          </motion.div>

          {/* Recent Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="border rounded-xl bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
              </div>
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium"
              >
                Mark All Read
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No alerts</p>
                </div>
              ) : (
                alerts.slice(0, 10).map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      !alert.read ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${
                        alert.type === 'critical' ? 'text-red-500' :
                        alert.type === 'warning' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>
                        {alert.type === 'critical' && <AlertTriangle className="h-4 w-4" />}
                        {alert.type === 'warning' && <Clock className="h-4 w-4" />}
                        {alert.type === 'info' && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!alert.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {alert.msg}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border rounded-xl bg-card p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <FuelIcon className="h-5 w-5 text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{fuelEntries.length}</p>
              <p className="text-xs text-muted-foreground">Fuel Entries</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold">
                {drivers.reduce((sum, d) => sum + d.trips, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold">
                {drivers.length > 0 ? (drivers.reduce((sum, d) => sum + parseFloat(d.fuelEfficiency), 0) / drivers.length).toFixed(1) : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg KM/L</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold">
                {drivers.reduce((sum, d) => sum + d.violations, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Violations</p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
              <p className="text-2xl font-bold">
                {vehicles.filter(v => v.documents.some(d => d.status === 'expired' || d.status === 'due')).length}
              </p>
              <p className="text-xs text-muted-foreground">Doc Alerts</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <Users className="h-5 w-5 text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">
                {vehicles.filter(v => v.status === 'active').length}
              </p>
              <p className="text-xs text-muted-foreground">Active Vehicles</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
