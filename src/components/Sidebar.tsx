'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Truck, 
  User, 
  MapPin, 
  Fuel, 
  CreditCard, 
  Wrench, 
  Circle, 
  Route, 
  Package, 
  FileText, 
  AlertTriangle, 
  FileDown, 
  Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/fleet-management/', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/fleet-management/vehicles', icon: Truck },
  { name: 'Drivers', href: '/fleet-management/drivers', icon: User },
  { name: 'GPS', href: '/fleet-management/gps', icon: MapPin },
  { name: 'Fuel', href: '/fleet-management/fuel', icon: Fuel },
  { name: 'FASTag', href: '/fleet-management/fastag', icon: CreditCard },
  { name: 'Maintenance', href: '/fleet-management/maintenance', icon: Wrench },
  { name: 'Tyres', href: '/fleet-management/tyres', icon: Circle },
  { name: 'Trips', href: '/fleet-management/trips', icon: Route },
  { name: 'Inventory', href: '/fleet-management/inventory', icon: Package },
  { name: 'Reports', href: '/fleet-management/reports', icon: FileText },
  { name: 'Alerts', href: '/fleet-management/alerts', icon: AlertTriangle },
  { name: 'SAP Export', href: '/fleet-management/sap-export', icon: FileDown },
  { name: 'Settings', href: '/fleet-management/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#0f1923] border-r border-white/10 flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <Truck className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold text-white">FleetPro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', isActive ? 'text-orange-500' : '')} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-2 w-2 rounded-full bg-orange-500"
                      />
                    )}
                  </motion.div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/5 p-3">
          <p className="text-xs text-gray-400">Fleet Management System</p>
          <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
        </div>
      </div>
    </motion.aside>
  )
}
