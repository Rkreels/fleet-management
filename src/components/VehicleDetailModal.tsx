import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, FileText, AlertTriangle, CheckCircle, Fuel, Wrench, MapPin, Calendar, Hash, User } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface Vehicle {
  id: number;
  regNo: string;
  model: string;
  chassis: string;
  engine: string;
  driver: string;
  gpsId: string;
  fuelCard: string;
  fastagId: string;
  status: 'active' | 'inactive';
  kmReading: number;
  fuelLevel: number;
  photo: string;
  documents: { name: string; expiry: string; status: 'ok' | 'expired' | 'due' }[];
  lastService: string;
  nextService: string;
  location: string;
  purchaseDate: string;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
}

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'service'>('overview');

  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="relative bg-gradient-to-r from-[#0f1923] to-[#1a2535] px-6 py-6">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center">
                  <Truck size={32} className="text-[#f97316]" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{vehicle.regNo}</h2>
                  <p className="text-slate-400 text-sm">{vehicle.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={vehicle.status} />
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin size={12} /> {vehicle.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-white font-bold">{vehicle.kmReading.toLocaleString()}</div>
                  <div className="text-slate-400 text-xs">KM Reading</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-white font-bold">{vehicle.fuelLevel}%</div>
                  <div className="text-slate-400 text-xs">Fuel Level</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-white font-bold">{vehicle.driver}</div>
                  <div className="text-slate-400 text-xs">Driver</div>
                </div>
              </div>

              <div className="flex gap-1 mt-4">
                {(['overview', 'documents', 'service'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                      activeTab === tab ? 'bg-[#f97316] text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Hash, label: 'Chassis No', value: vehicle.chassis },
                      { icon: Hash, label: 'Engine No', value: vehicle.engine },
                      { icon: User, label: 'Assigned Driver', value: vehicle.driver },
                      { icon: MapPin, label: 'GPS ID', value: vehicle.gpsId },
                      { icon: FileText, label: 'Fuel Card', value: vehicle.fuelCard },
                      { icon: FileText, label: 'FASTag ID', value: vehicle.fastagId },
                      { icon: Calendar, label: 'Purchase Date', value: vehicle.purchaseDate },
                      { icon: MapPin, label: 'Current Location', value: vehicle.location },
                    ].map(item => (
                      <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                        <item.icon size={16} className="text-[#f97316] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-700 mb-2">Fuel Level</h4>
                    <div className="bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 25 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${vehicle.fuelLevel}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{vehicle.fuelLevel}% remaining</p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-3">
                  {vehicle.documents.map(doc => (
                    <div key={doc.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        {doc.status === 'ok' ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={18} className={doc.status === 'expired' ? 'text-red-500' : 'text-orange-500'} />
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{doc.name}</p>
                          <p className="text-xs text-slate-500">Expiry: {doc.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status} />
                        <button className="text-xs text-[#f97316] hover:underline font-medium px-2 py-1 border border-[#f97316]/30 rounded">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'service' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <Wrench size={20} className="text-green-600 mb-2" />
                      <p className="text-xs text-green-600">Last Service</p>
                      <p className="font-bold text-green-700">{vehicle.lastService}</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <Wrench size={20} className="text-orange-600 mb-2" />
                      <p className="text-xs text-orange-600">Next Service</p>
                      <p className="font-bold text-orange-700">{vehicle.nextService}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-700 mb-3">Service History</h4>
                    <div className="space-y-2">
                      {[
                        { date: '2025-12-10', work: 'Engine oil change, Filter replacement', cost: '₹8,500' },
                        { date: '2025-09-05', work: 'Brake pad replacement, Wheel alignment', cost: '₹15,200' },
                        { date: '2025-06-20', work: 'Major service - 50,000 KM', cost: '₹32,000' },
                      ].map(s => (
                        <div key={s.date} className="flex justify-between items-start py-2 border-b border-slate-200 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{s.work}</p>
                            <p className="text-xs text-slate-500">{s.date}</p>
                          </div>
                          <span className="text-sm font-bold text-[#f97316]">{s.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleDetailModal;