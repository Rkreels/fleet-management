'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Truck, Clock, Fuel, Route, X, Eye, Map as MapIcon } from 'lucide-react'
import { useFleetStore } from '@/lib/store'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'


interface VehiclePosition {
  id: number
  regNo: string
  driver: string
  x: number
  y: number
  speed: number
  heading: number
  status: 'moving' | 'idle' | 'stopped'
}

export function LiveMapView() {
  const { vehicles } = useFleetStore()
  const [vehiclePositions, setVehiclePositions] = useState<VehiclePosition[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehiclePosition | null>(null)
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const mapRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0 })

  // Generate initial positions for vehicles (Bangladesh context)
  const initialPositions = useMemo(() => {
    return vehicles.slice(0, 8).map((vehicle, index) => ({
      id: vehicle.id,
      regNo: vehicle.regNo,
      driver: vehicle.driver,
      // Distribute vehicles around major Bangladeshi cities
      x: 20 + (index % 4) * 18 + Math.random() * 8,
      y: 20 + Math.floor(index / 4) * 25 + Math.random() * 8,
      speed: Math.floor(Math.random() * 60) + 20,
      heading: Math.floor(Math.random() * 360),
      status: ['moving', 'idle', 'stopped'][Math.floor(Math.random() * 3)] as 'moving' | 'idle' | 'stopped',
    }))
  }, [vehicles])

  // Initialize positions when vehicles change
  useEffect(() => {
    setVehiclePositions(initialPositions)
  }, [initialPositions])

  // Simulate vehicle movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehiclePositions(prev => prev.map(vehicle => {
        if (vehicle.status === 'stopped') return vehicle

        const moveSpeed = vehicle.status === 'moving' ? 0.5 : 0.1
        const rad = (vehicle.heading * Math.PI) / 180

        return {
          ...vehicle,
          x: Math.max(5, Math.min(95, vehicle.x + Math.cos(rad) * moveSpeed)),
          y: Math.max(5, Math.min(95, vehicle.y + Math.sin(rad) * moveSpeed)),
          speed: vehicle.status === 'moving' ? vehicle.speed + (Math.random() - 0.5) * 5 : 0,
          heading: (vehicle.heading + (Math.random() - 0.5) * 10 + 360) % 360,
        }
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true)
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPan = {
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      }
      // Limit panning range
      setPan({
        x: Math.max(-200, Math.min(200, newPan.x)),
        y: Math.max(-200, Math.min(200, newPan.y))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6))
  }

  const handleResetView = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  return (
    <div
      ref={mapRef}
      className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-[#1a2332]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Map Container with transform */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Simulated Map Features - Bangladesh Geography */}
        <div className="absolute inset-0">
          {/* Rivers - Buriganga, Padma, Meghna */}
          <svg className="h-full w-full">
            <path
              d="M 0 300 Q 200 280, 400 320 T 800 300 T 1200 350"
              stroke="#3b82f6"
              strokeWidth="10"
              fill="none"
              opacity="0.4"
            />
            <path
              d="M 50 0 Q 80 200, 60 400 T 120 600"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 800 0 Q 780 150, 820 300 T 750 600"
              stroke="#3b82f6"
              strokeWidth="6"
              fill="none"
              opacity="0.3"
            />
          </svg>

          {/* Major Roads - Dhaka-Chittagong Highway, Dhaka-Sylhet, etc. */}
          <svg className="h-full w-full">
            <line x1="0" y1="200" x2="1200" y2="200" stroke="#4b5563" strokeWidth="5" opacity="0.5" />
            <line x1="0" y1="400" x2="1200" y2="400" stroke="#4b5563" strokeWidth="4" opacity="0.4" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="#4b5563" strokeWidth="5" opacity="0.5" />
            <line x1="600" y1="0" x2="600" y2="600" stroke="#4b5563" strokeWidth="4" opacity="0.4" />
            <line x1="900" y1="0" x2="900" y2="600" stroke="#4b5563" strokeWidth="4" opacity="0.4" />
          </svg>

          {/* Bangladeshi Cities/Landmarks */}
          <div className="absolute left-[280px] top-[170px] text-xs text-white font-semibold">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-green-400" />
              Dhaka
            </div>
          </div>
          <div className="absolute left-[850px] top-[170px] text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-blue-400" />
              Chittagong
            </div>
          </div>
          <div className="absolute left-[600px] top-[80px] text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-purple-400" />
              Sylhet
            </div>
          </div>
          <div className="absolute left-[400px] top-[370px] text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-yellow-400" />
              Rajshahi
            </div>
          </div>
          <div className="absolute left-[100px] top-[320px] text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-red-400" />
              Khulna
            </div>
          </div>
        </div>

        {/* Vehicle Markers */}
        {vehiclePositions.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
            style={{
              left: `${vehicle.x}%`,
              top: `${vehicle.y}%`,
              transform: `translate(-50%, -50%) rotate(${vehicle.heading}deg)`,
            }}
            className={cn(
              'absolute cursor-pointer transition-all duration-500',
              selectedVehicle?.id === vehicle.id && 'z-20'
            )}
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <motion.div
              animate={{
                rotate: vehicle.heading,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg',
                vehicle.status === 'moving' ? 'bg-green-500 border-green-400' :
                vehicle.status === 'idle' ? 'bg-yellow-500 border-yellow-400' :
                'bg-red-500 border-red-400'
              )}>
                <Truck className="h-5 w-5 text-white" />

                {/* Pulse effect for moving vehicles */}
                {vehicle.status === 'moving' && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-green-500"
                  />
                )}
              </div>
            </motion.div>

            {/* Vehicle Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: selectedVehicle?.id === vehicle.id ? 1 : 0.7,
                y: selectedVehicle?.id === vehicle.id ? 10 : 10,
              }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white"
              style={{ transform: `translateX(-50%) rotate(${-vehicle.heading}deg)` }}
            >
              {vehicle.regNo}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Selected Vehicle Details Panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute right-4 top-4 w-72 rounded-xl border border-border bg-background/95 backdrop-blur-xl p-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{selectedVehicle.regNo}</h3>
                <p className="text-sm text-muted-foreground">{selectedVehicle.driver}</p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="rounded-full p-1 hover:bg-accent transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  Status
                </div>
                <StatusBadge
                  status={
                    selectedVehicle.status === 'moving' ? 'active' :
                    selectedVehicle.status === 'idle' ? 'warning' : 'inactive'
                  }
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Speed
                </div>
                <span className="font-semibold">
                  {Math.round(selectedVehicle.speed)} km/h
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Route className="h-4 w-4" />
                  Heading
                </div>
                <span className="font-semibold">
                  {Math.round(selectedVehicle.heading)}°
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Fuel className="h-4 w-4" />
                  Fuel Level
                </div>
                <span className="font-semibold">
                  {vehicles.find(v => v.id === selectedVehicle.id)?.fuelLevel || 0}%
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex gap-2"
            >
              <button
                onClick={() => router.push(`/vehicles`)}
                className="flex-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
              >
                <span className="flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" />
                  View Details
                </span>
              </button>
              <button
                onClick={() => router.push(`/gps`)}
                className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                <span className="flex items-center justify-center gap-1">
                  <Navigation className="h-3 w-3" />
                  Track
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border shadow-lg hover:bg-accent transition-colors"
        >
          <span className="font-semibold text-lg">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border shadow-lg hover:bg-accent transition-colors"
        >
          <span className="font-semibold text-lg">−</span>
        </button>
        <button
          onClick={handleResetView}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-background border border-border shadow-lg hover:bg-accent transition-colors"
          title="Reset View"
        >
          <Navigation className="h-5 w-5" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-16 rounded-lg bg-background/95 backdrop-blur-xl border border-border px-2 py-1 shadow-lg">
        <span className="text-xs font-medium text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-background/95 backdrop-blur-xl border border-border p-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">STATUS</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-xs">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="text-xs">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-xs">Stopped</span>
          </div>
        </div>
      </div>
    </div>
  )
}
