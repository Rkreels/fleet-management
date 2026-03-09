import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, Award, AlertTriangle, CheckCircle, TrendingUp, Truck, Fuel, Route, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export interface Driver {
  id: number;
  name: string;
  empId: string;
  phone: string;
  license: string;
  licenseExpiry: string;
  insurance: string;
  insuranceExpiry: string;
  status: 'active' | 'inactive';
  vehicle: string;
  joinDate: string;
  address: string;
  photo: string;
  trips: number;
  kmDriven: number;
  fuelEfficiency: string;
  rating: number;
  violations: number;
  lastTrip: string;
  experience: string;
}

interface DriverProfileModalProps {
  driver: Driver | null;
  open: boolean;
  onClose: () => void;
}

const DriverProfileModal: React.FC<DriverProfileModalProps> = ({ driver, open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'performance' | 'documents'>('profile');

  if (!driver) return null;

  const licenseExpired = new Date(driver.licenseExpiry) < new Date();
  const licenseExpiringSoon = !licenseExpired && new Date(driver.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#0f1923] to-[#1a2535] px-6 py-6">
              <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    width={72}
                    height={72}
                    className="w-18 h-18 rounded-full object-cover border-3 border-[#f97316]"
                    style={{ width: 72, height: 72 }}
                  />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${driver.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">{driver.name}</h2>
                  <p className="text-slate-400 text-sm">{driver.empId} · {driver.experience} Experience</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={driver.status} />
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Truck size={12} /> {driver.vehicle}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mt-5">
                {(['profile', 'performance', 'documents'] as const).map(tab => (
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
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow icon={Phone} label="Phone" value={driver.phone} />
                    <InfoRow icon={MapPin} label="Address" value={driver.address} />
                    <InfoRow icon={Calendar} label="Join Date" value={driver.joinDate} />
                    <InfoRow icon={Route} label="Last Trip" value={driver.lastTrip} />
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="font-semibold text-slate-800 mb-3">License & Insurance</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500">License Number</p>
                          <p className="font-semibold text-slate-800">{driver.license}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Expiry</p>
                          <p className={`font-semibold text-sm ${licenseExpired ? 'text-red-600' : licenseExpiringSoon ? 'text-orange-600' : 'text-green-600'}`}>
                            {driver.licenseExpiry}
                          </p>
                        </div>
                        {licenseExpired ? (
                          <AlertTriangle size={18} className="text-red-500 ml-2" />
                        ) : licenseExpiringSoon ? (
                          <AlertTriangle size={18} className="text-orange-500 ml-2" />
                        ) : (
                          <CheckCircle size={18} className="text-green-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="text-xs text-slate-500">Insurance</p>
                          <p className="font-semibold text-slate-800">{driver.insurance}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Expiry</p>
                          <p className="font-semibold text-sm text-green-600">{driver.insuranceExpiry}</p>
                        </div>
                        <CheckCircle size={18} className="text-green-500 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <Route size={24} className="mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-blue-700">{driver.trips}</div>
                      <div className="text-xs text-blue-600">Total Trips</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <TrendingUp size={24} className="mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-green-700">{driver.kmDriven.toLocaleString()}</div>
                      <div className="text-xs text-green-600">KM Driven</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <Fuel size={24} className="mx-auto text-orange-600 mb-2" />
                      <div className="text-2xl font-bold text-orange-700">{driver.fuelEfficiency}</div>
                      <div className="text-xs text-orange-600">Avg KMPL</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <Award size={24} className="mx-auto text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-purple-700">{driver.rating}/5</div>
                      <div className="text-xs text-purple-600">Driver Rating</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <h4 className="font-semibold text-slate-700 mb-3">Performance Score</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Safety', score: 92 },
                        { label: 'Fuel Efficiency', score: 85 },
                        { label: 'Punctuality', score: 88 },
                        { label: 'Document Compliance', score: licenseExpired ? 40 : 95 },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-semibold text-slate-800">{item.score}%</span>
                          </div>
                          <div className="bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {driver.violations > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                      <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700">{driver.violations} Traffic Violations</p>
                        <p className="text-red-600 text-sm">Review required before next assignment</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-3">
                  {[
                    { name: 'Driving License', status: licenseExpired ? 'expired' : licenseExpiringSoon ? 'due' : 'ok', expiry: driver.licenseExpiry },
                    { name: 'Driver Insurance', status: 'ok', expiry: driver.insuranceExpiry },
                    { name: 'Medical Certificate', status: 'ok', expiry: '2026-08-20' },
                    { name: 'Police Verification', status: 'ok', expiry: '2027-01-10' },
                    { name: 'Address Proof', status: 'ok', expiry: 'N/A' },
                  ].map(doc => (
                    <div key={doc.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-medium text-slate-800">{doc.name}</p>
                        <p className="text-xs text-slate-500">Expiry: {doc.expiry}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={doc.status as 'ok' | 'expired' | 'due'} />
                        <button className="text-xs text-[#f97316] hover:underline font-medium">View</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
    <Icon size={16} className="text-[#f97316] mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

export default DriverProfileModal;