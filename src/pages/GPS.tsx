import React, { useState } from 'react';
import { MapPin, Truck, Navigation, Wifi, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import LiveMapView from '../components/LiveMapView';
import StatusBadge from '../components/StatusBadge';

const vehicles = [
  { id: 1, regNo: 'TN 09 AB 1234', driver: 'Rajan Kumar', speed: 62, status: 'active' as const, fuel: 72, temp: 82, idle: '0h 12m', distance: 284 },
  { id: 2, regNo: 'TN 09 CD 5678', driver: 'Suresh Babu', speed: 0, status: 'inactive' as const, fuel: 45, temp: 78, idle: '2h 35m', distance: 142 },
  { id: 3, regNo: 'TN 09 EF 9012', driver: 'Murugan S', speed: 45, status: 'active' as const, fuel: 88, temp: 80, idle: '0h 05m', distance: 198 },
  { id: 4, regNo: 'TN 09 GH 3456', driver: 'Vijay R', speed: 0, status: 'inactive' as const, fuel: 20, temp: 75, idle: '5h 10m', distance: 0 },
  { id: 5, regNo: 'TN 09 IJ 7890', driver: 'Karthik M', speed: 78, status: 'active' as const, fuel: 60, temp: 85, idle: '0h 02m', distance: 312 },
];

const GPS: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0]);

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
            <span className="text-green-700 text-xs font-semibold">All 24 Vehicles Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Vehicle list */}
          <div className="lg:col-span-1 space-y-2">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Fleet Status</h2>
            {vehicles.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${selectedVehicle.id === v.id ? 'border-[#f97316] bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">{v.regNo}</span>
                  <div className={`w-2 h-2 rounded-full ${v.speed > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                </div>
                <p className="text-xs text-slate-500">{v.driver}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Navigation size={10} className="text-[#f97316]" />
                  <span className="text-xs font-semibold text-slate-700">{v.speed} km/h</span>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 380 }}>
              <LiveMapView />
            </div>

            {/* Selected vehicle details */}
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
                  { icon: Navigation, label: 'Speed', value: `${selectedVehicle.speed} km/h`, color: 'text-blue-600' },
                  { icon: Activity, label: 'Fuel', value: `${selectedVehicle.fuel}%`, color: 'text-green-600' },
                  { icon: Activity, label: 'Engine Temp', value: `${selectedVehicle.temp}°C`, color: 'text-orange-600' },
                  { icon: MapPin, label: 'Idle Time', value: selectedVehicle.idle, color: 'text-yellow-600' },
                  { icon: Navigation, label: 'Distance Today', value: `${selectedVehicle.distance} km`, color: 'text-purple-600' },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-slate-50 rounded-lg">
                    <item.icon size={18} className={`mx-auto mb-1 ${item.color}`} />
                    <div className="font-bold text-slate-800 text-sm">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GPS;