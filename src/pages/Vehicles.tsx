import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Download, Eye, Edit, Truck } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import VehicleDetailModal, { Vehicle } from '../components/VehicleDetailModal';
import AddVehicleModal from '../components/AddVehicleModal';
import { toast } from 'react-toastify';

const initialVehicles: Vehicle[] = [
  {
    id: 1, regNo: 'TN 09 AB 1234', model: 'Tata Prima 4028.S', chassis: 'MAT445103K2B12345', engine: '4928CRDL12345',
    driver: 'Rajan Kumar', gpsId: 'GPS-001', fuelCard: 'FC-2024-001', fastagId: 'FT-TN-001',
    status: 'active', kmReading: 48320, fuelLevel: 72, photo: '',
    documents: [
      { name: 'RC', expiry: '2028-06-15', status: 'ok' },
      { name: 'FC', expiry: '2026-03-20', status: 'ok' },
      { name: 'Insurance', expiry: '2026-01-20', status: 'due' },
      { name: 'Permit', expiry: '2026-08-10', status: 'ok' },
      { name: 'National Permit', expiry: '2026-05-30', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-04-15', status: 'ok' },
    ],
    lastService: '2025-12-10', nextService: '50,500 KM', location: 'Chennai, TN', purchaseDate: '2022-03-15',
  },
  {
    id: 2, regNo: 'TN 09 CD 5678', model: 'Ashok Leyland 3518', chassis: 'MAT445103K2B67890', engine: '4928CRDL67890',
    driver: 'Suresh Babu', gpsId: 'GPS-002', fuelCard: 'FC-2024-002', fastagId: 'FT-TN-002',
    status: 'active', kmReading: 62150, fuelLevel: 45, photo: '',
    documents: [
      { name: 'RC', expiry: '2027-09-20', status: 'ok' },
      { name: 'FC', expiry: '2025-12-15', status: 'expired' },
      { name: 'Insurance', expiry: '2026-06-30', status: 'ok' },
      { name: 'Permit', expiry: '2026-11-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-07-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-02-28', status: 'ok' },
    ],
    lastService: '2025-11-05', nextService: '65,000 KM', location: 'Coimbatore, TN', purchaseDate: '2021-08-20',
  },
  {
    id: 3, regNo: 'TN 09 EF 9012', model: 'Eicher Pro 6031', chassis: 'MAT445103K2B11111', engine: '4928CRDL11111',
    driver: 'Murugan S', gpsId: 'GPS-003', fuelCard: 'FC-2024-003', fastagId: 'FT-TN-003',
    status: 'active', kmReading: 31200, fuelLevel: 88, photo: '',
    documents: [
      { name: 'RC', expiry: '2029-01-10', status: 'ok' },
      { name: 'FC', expiry: '2026-07-25', status: 'ok' },
      { name: 'Insurance', expiry: '2026-09-15', status: 'ok' },
      { name: 'Permit', expiry: '2027-02-28', status: 'ok' },
      { name: 'National Permit', expiry: '2026-12-10', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-06-20', status: 'ok' },
    ],
    lastService: '2026-01-02', nextService: '35,000 KM', location: 'Madurai, TN', purchaseDate: '2023-01-10',
  },
  {
    id: 4, regNo: 'TN 09 GH 3456', model: 'Tata LPT 3118', chassis: 'MAT445103K2B22222', engine: '4928CRDL22222',
    driver: 'Vijay R', gpsId: 'GPS-004', fuelCard: 'FC-2024-004', fastagId: 'FT-TN-004',
    status: 'inactive', kmReading: 78900, fuelLevel: 20, photo: '',
    documents: [
      { name: 'RC', expiry: '2026-04-30', status: 'ok' },
      { name: 'FC', expiry: '2026-02-15', status: 'due' },
      { name: 'Insurance', expiry: '2026-03-10', status: 'due' },
      { name: 'Permit', expiry: '2026-05-20', status: 'ok' },
      { name: 'National Permit', expiry: '2026-04-15', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2025-12-31', status: 'expired' },
    ],
    lastService: '2025-09-15', nextService: '80,000 KM', location: 'Trichy, TN', purchaseDate: '2020-06-05',
  },
  {
    id: 5, regNo: 'TN 09 IJ 7890', model: 'BharatBenz 3523R', chassis: 'MAT445103K2B33333', engine: '4928CRDL33333',
    driver: 'Karthik M', gpsId: 'GPS-005', fuelCard: 'FC-2024-005', fastagId: 'FT-TN-005',
    status: 'active', kmReading: 22400, fuelLevel: 60, photo: '',
    documents: [
      { name: 'RC', expiry: '2030-02-20', status: 'ok' },
      { name: 'FC', expiry: '2027-08-10', status: 'ok' },
      { name: 'Insurance', expiry: '2026-11-30', status: 'ok' },
      { name: 'Permit', expiry: '2027-06-15', status: 'ok' },
      { name: 'National Permit', expiry: '2027-01-20', status: 'ok' },
      { name: 'Road Tax', expiry: '2027-03-31', status: 'ok' },
      { name: 'PUC', expiry: '2026-08-25', status: 'ok' },
    ],
    lastService: '2025-12-28', nextService: '25,000 KM', location: 'Salem, TN', purchaseDate: '2024-02-14',
  },
];

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = vehicles.filter(v => {
    const matchSearch = v.regNo.toLowerCase().includes(search.toLowerCase()) || v.model.toLowerCase().includes(search.toLowerCase()) || v.driver.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || v.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (data: Record<string, string>) => {
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      regNo: data.regNo || 'NEW-001',
      model: data.model || 'Unknown',
      chassis: data.chassis || '-',
      engine: data.engine || '-',
      driver: data.driver || 'Unassigned',
      gpsId: data.gpsId || '-',
      fuelCard: data.fuelCard || '-',
      fastagId: data.fastagId || '-',
      status: 'active',
      kmReading: 0,
      fuelLevel: 100,
      photo: '',
      documents: [],
      lastService: '-',
      nextService: '5,000 KM',
      location: 'Chennai, TN',
      purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const handleDownload = () => {
    const csv = ['Reg No,Model,Driver,Status,KM Reading,Location', ...vehicles.map(v => `${v.regNo},${v.model},${v.driver},${v.status},${v.kmReading},${v.location}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehicles.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Vehicle list downloaded!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Vehicle Management</h1>
            <p className="text-slate-500 text-sm">{vehicles.length} vehicles registered</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
              <Download size={16} />Export
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">
              <Plus size={16} />Add Vehicle
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? 'bg-[#f97316] text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((vehicle, i) => {
            const expiredDocs = vehicle.documents.filter(d => d.status === 'expired').length;
            const dueDocs = vehicle.documents.filter(d => d.status === 'due').length;
            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-[#0f1923] to-[#1a2535] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f97316]/20 border border-[#f97316]/40 flex items-center justify-center">
                      <Truck size={20} className="text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{vehicle.regNo}</p>
                      <p className="text-slate-400 text-xs">{vehicle.model}</p>
                    </div>
                  </div>
                  <StatusBadge status={vehicle.status} />
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-500">Driver:</span> <span className="font-semibold text-slate-800">{vehicle.driver}</span></div>
                    <div><span className="text-slate-500">KM:</span> <span className="font-semibold text-slate-800">{vehicle.kmReading.toLocaleString()}</span></div>
                    <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-800">{vehicle.location}</span></div>
                    <div><span className="text-slate-500">GPS:</span> <span className="font-semibold text-slate-800">{vehicle.gpsId}</span></div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Fuel Level</span>
                      <span className="font-semibold text-slate-700">{vehicle.fuelLevel}%</span>
                    </div>
                    <div className="bg-slate-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 25 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${vehicle.fuelLevel}%` }} />
                    </div>
                  </div>

                  {(expiredDocs > 0 || dueDocs > 0) && (
                    <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${expiredDocs > 0 ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                      <span>⚠</span>
                      <span>{expiredDocs > 0 ? `${expiredDocs} expired doc(s)` : `${dueDocs} doc(s) due soon`}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => { setSelected(vehicle); setDetailOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#0f1923] text-white rounded-lg hover:bg-[#1a2535] transition-all text-xs font-medium"
                    >
                      <Eye size={14} />View Details
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-all text-xs font-medium">
                      <Edit size={14} />Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <VehicleDetailModal vehicle={selected} open={detailOpen} onClose={() => setDetailOpen(false)} />
      <AddVehicleModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </Layout>
  );
};

export default Vehicles;