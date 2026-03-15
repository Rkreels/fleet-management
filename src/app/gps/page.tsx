'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Truck, Navigation, Wifi, Activity, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { LiveMapView } from '@/components/LiveMapView';
import { StatusBadge } from '@/components/StatusBadge';
import { useFleetStore } from '@/lib/store';

const GPSPage = () => {
  const { vehicles } = useFleetStore();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] || null);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">GPS Live Tracking</h1>
            <p className="text-slate-500 text-sm">Real-time fleet monitoring</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Wifi size={14} className="text-green-600" />
            <span className="text-green-700 text-xs font-semibold">All {vehicles.length} Vehicles Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vehicle list */}
          <div className="lg:col-span-1 space-y-2">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Fleet Status</h2>
            <div className="max-h-[500px] overflow-y-auto space-y-2 custom-scrollbar pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1' }}>
              {vehicles.slice(0, 10).map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                  selectedVehicle?.id === v.id
                    ? 'border-[#f97316] bg-orange-50'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">{v.regNo}</span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      v.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">{v.driver}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Navigation size={10} className="text-[#f97316]" />
                  <span className="text-xs font-semibold text-slate-700">Active</span>
                </div>
              </button>
                ))}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ height: 500 }}
            >
              <LiveMapView />
            </div>

            {/* Selected vehicle details */}
            {selectedVehicle && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f97316] flex items-center justify-center">
                      <Truck size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{selectedVehicle.regNo}</h3>
                      <p className="text-slate-500 text-xs">{selectedVehicle.driver}</p>
                    </div>
                  </div>
                  <StatusBadge status={selectedVehicle.status} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    {
                      icon: Navigation,
                      label: 'Status',
                      value: selectedVehicle.status,
                      color: selectedVehicle.status === 'active' ? 'text-green-600' : 'text-red-600',
                    },
                    {
                      icon: Activity,
                      label: 'Fuel',
                      value: `${selectedVehicle.fuelLevel}%`,
                      color:
                        selectedVehicle.fuelLevel > 50
                          ? 'text-green-600'
                          : selectedVehicle.fuelLevel > 25
                          ? 'text-orange-600'
                          : 'text-red-600',
                    },
                    {
                      icon: Activity,
                      label: 'KM Reading',
                      value: selectedVehicle.kmReading.toLocaleString(),
                      color: 'text-blue-600',
                    },
                    {
                      icon: MapPin,
                      label: 'Location',
                      value: selectedVehicle.location.split(',')[0].trim(),
                      color: 'text-purple-600',
                    },
                    {
                      icon: Truck,
                      label: 'Last Service',
                      value: selectedVehicle.lastService,
                      color: 'text-orange-600',
                    },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-slate-50 rounded-lg">
                      <item.icon size={18} className={`mx-auto mb-1 ${item.color}`} />
                      <div className="font-bold text-slate-800 text-sm capitalize">{item.value}</div>
                      <div className="text-xs text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GPSPage;
