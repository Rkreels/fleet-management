import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Truck, Navigation, Wifi } from 'lucide-react';

interface VehiclePin {
  id: number;
  regNo: string;
  driver: string;
  lat: number;
  lng: number;
  speed: number;
  status: 'moving' | 'idle' | 'stopped';
}

const vehicles: VehiclePin[] = [
  { id: 1, regNo: 'TN 09 AB 1234', driver: 'Rajan Kumar', lat: 13.0827, lng: 80.2707, speed: 62, status: 'moving' },
  { id: 2, regNo: 'TN 09 CD 5678', driver: 'Suresh Babu', lat: 13.0569, lng: 80.2425, speed: 0, status: 'idle' },
  { id: 3, regNo: 'TN 09 EF 9012', driver: 'Murugan S', lat: 13.1067, lng: 80.2206, speed: 45, status: 'moving' },
  { id: 4, regNo: 'TN 09 GH 3456', driver: 'Vijay R', lat: 12.9716, lng: 80.2209, speed: 0, status: 'stopped' },
  { id: 5, regNo: 'TN 09 IJ 7890', driver: 'Karthik M', lat: 13.0358, lng: 80.2636, speed: 78, status: 'moving' },
];

const LiveMapView: React.FC = () => {
  const [selected, setSelected] = useState<VehiclePin | null>(null);
  const [positions, setPositions] = useState(vehicles);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setPositions(prev => prev.map(v => ({
        ...v,
        lat: v.status === 'moving' ? v.lat + (Math.random() - 0.5) * 0.002 : v.lat,
        lng: v.status === 'moving' ? v.lng + (Math.random() - 0.5) * 0.002 : v.lng,
        speed: v.status === 'moving' ? Math.floor(40 + Math.random() * 50) : 0,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusColor: Record<string, string> = {
    moving: 'bg-green-500',
    idle: 'bg-yellow-500',
    stopped: 'bg-red-500',
  };

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(15,25,35,0.85), rgba(15,25,35,0.85)),
          url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 z-10">
        <div className={`w-2 h-2 rounded-full bg-green-400 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity duration-500`}></div>
        <Wifi size={14} className="text-green-400" />
        <span className="text-white text-xs font-semibold">LIVE TRACKING</span>
      </div>

      {/* Vehicle pins */}
      {positions.map((v, i) => {
        const x = ((v.lng - 80.18) / 0.15) * 100;
        const y = ((13.12 - v.lat) / 0.18) * 100;
        return (
          <button
            key={v.id}
            onClick={() => setSelected(selected?.id === v.id ? null : v)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
            style={{ left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(5, Math.min(95, y))}%` }}
            aria-label={`Vehicle ${v.regNo}`}
          >
            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform duration-200 group-hover:scale-110 ${
              selected?.id === v.id ? 'bg-[#f97316] scale-110' : 'bg-[#0f1923]'
            }`}>
              <Truck size={14} className="text-white" />
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white ${statusColor[v.status]}`}></div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none">
              {v.regNo}
            </div>
          </button>
        );
      })}

      {/* Selected vehicle info */}
      {selected && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 z-20 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f97316] flex items-center justify-center">
                <Truck size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{selected.regNo}</p>
                <p className="text-slate-400 text-xs">{selected.driver}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Navigation size={12} className="text-[#f97316]" />
                <span className="text-white font-bold">{selected.speed} km/h</span>
              </div>
              <span className={`text-xs font-semibold ${selected.status === 'moving' ? 'text-green-400' : selected.status === 'idle' ? 'text-yellow-400' : 'text-red-400'}`}>
                {selected.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-slate-400 text-xs">
            <MapPin size={12} />
            <span>Lat: {selected.lat.toFixed(4)}, Lng: {selected.lng.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 z-10 space-y-1">
        {[{ color: 'bg-green-500', label: 'Moving' }, { color: 'bg-yellow-500', label: 'Idle' }, { color: 'bg-red-500', label: 'Stopped' }].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
            <span className="text-white text-xs">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMapView;