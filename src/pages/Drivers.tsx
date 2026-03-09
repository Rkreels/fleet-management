import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Download, Eye, Phone, Truck, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import DriverProfileModal, { Driver } from '../components/DriverProfileModal';
import AddDriverModal from '../components/AddDriverModal';
import { toast } from 'react-toastify';

const initialDrivers: Driver[] = [
  {
    id: 1, name: 'Rajan Kumar', empId: 'EMP-001', phone: '+91 98765 43210',
    license: 'TN0120240012345', licenseExpiry: '2026-01-25', insurance: 'HDFC-DRV-001', insuranceExpiry: '2026-08-15',
    status: 'active', vehicle: 'TN 09 AB 1234', joinDate: '2020-03-15', address: '12, Anna Nagar, Chennai - 600040',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    trips: 342, kmDriven: 48320, fuelEfficiency: '4.9', rating: 4.7, violations: 0, lastTrip: '2026-01-14', experience: '6 Years',
  },
  {
    id: 2, name: 'Suresh Babu', empId: 'EMP-002', phone: '+91 87654 32109',
    license: 'TN0220230023456', licenseExpiry: '2026-02-10', insurance: 'LIC-DRV-002', insuranceExpiry: '2026-09-20',
    status: 'active', vehicle: 'TN 09 CD 5678', joinDate: '2019-07-20', address: '45, RS Puram, Coimbatore - 641002',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    trips: 428, kmDriven: 62150, fuelEfficiency: '4.5', rating: 4.3, violations: 1, lastTrip: '2026-01-13', experience: '7 Years',
  },
  {
    id: 3, name: 'Murugan S', empId: 'EMP-003', phone: '+91 76543 21098',
    license: 'TN0320250034567', licenseExpiry: '2027-05-30', insurance: 'ICICI-DRV-003', insuranceExpiry: '2027-03-10',
    status: 'active', vehicle: 'TN 09 EF 9012', joinDate: '2022-01-10', address: '78, Meenakshi Nagar, Madurai - 625001',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    trips: 198, kmDriven: 31200, fuelEfficiency: '5.1', rating: 4.8, violations: 0, lastTrip: '2026-01-15', experience: '4 Years',
  },
  {
    id: 4, name: 'Vijay R', empId: 'EMP-004', phone: '+91 65432 10987',
    license: 'TN0420220045678', licenseExpiry: '2025-11-15', insurance: 'SBI-DRV-004', insuranceExpiry: '2026-05-25',
    status: 'inactive', vehicle: 'TN 09 GH 3456', joinDate: '2018-11-05', address: '23, Thillai Nagar, Trichy - 620018',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80',
    trips: 512, kmDriven: 78900, fuelEfficiency: '4.2', rating: 3.9, violations: 3, lastTrip: '2025-12-20', experience: '8 Years',
  },
  {
    id: 5, name: 'Karthik M', empId: 'EMP-005', phone: '+91 54321 09876',
    license: 'TN0520240056789', licenseExpiry: '2027-08-20', insurance: 'BAJAJ-DRV-005', insuranceExpiry: '2027-06-30',
    status: 'active', vehicle: 'TN 09 IJ 7890', joinDate: '2023-06-01', address: '56, Fairlands, Salem - 636016',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80',
    trips: 124, kmDriven: 22400, fuelEfficiency: '5.3', rating: 4.9, violations: 0, lastTrip: '2026-01-15', experience: '3 Years',
  },
  {
    id: 6, name: 'Selvam P', empId: 'EMP-006', phone: '+91 43210 98765',
    license: 'TN0620230067890', licenseExpiry: '2026-12-10', insurance: 'STAR-DRV-006', insuranceExpiry: '2026-10-15',
    status: 'active', vehicle: 'TN 09 KL 2345', joinDate: '2021-04-15', address: '89, Gandhipuram, Coimbatore - 641012',
    photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&q=80',
    trips: 267, kmDriven: 41800, fuelEfficiency: '4.7', rating: 4.5, violations: 0, lastTrip: '2026-01-12', experience: '5 Years',
  },
];

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.empId.toLowerCase().includes(search.toLowerCase()) || d.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || d.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (data: Record<string, string>) => {
    const newDriver: Driver = {
      id: drivers.length + 1,
      name: data.name || 'New Driver',
      empId: data.empId || `EMP-00${drivers.length + 1}`,
      phone: data.phone || '-',
      license: data.license || '-',
      licenseExpiry: data.licenseExpiry || '2027-01-01',
      insurance: 'New Insurance',
      insuranceExpiry: '2027-01-01',
      status: 'active',
      vehicle: data.vehicle || 'Unassigned',
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      address: data.address || '-',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      trips: 0, kmDriven: 0, fuelEfficiency: '0', rating: 0, violations: 0,
      lastTrip: '-', experience: data.experience || '0 Years',
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleDownload = () => {
    const csv = ['Name,Emp ID,Phone,License,Expiry,Vehicle,Status,Trips,KM Driven', ...drivers.map(d => `${d.name},${d.empId},${d.phone},${d.license},${d.licenseExpiry},${d.vehicle},${d.status},${d.trips},${d.kmDriven}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drivers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Driver list downloaded!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Driver Management</h1>
            <p className="text-slate-500 text-sm">{drivers.length} drivers registered</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
              <Download size={16} />Export
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">
              <Plus size={16} />Add Driver
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search drivers..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
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
          {filtered.map((driver, i) => {
            const licenseExpired = new Date(driver.licenseExpiry) < new Date();
            const licenseExpiringSoon = !licenseExpired && new Date(driver.licenseExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={() => { setSelected(driver); setProfileOpen(true); }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img src={driver.photo} alt={driver.name} width={52} height={52} className="w-13 h-13 rounded-full object-cover border-2 border-slate-200" style={{ width: 52, height: 52 }} />
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${driver.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800">{driver.name}</h3>
                      <p className="text-slate-500 text-xs">{driver.empId} · {driver.experience}</p>
                      <StatusBadge status={driver.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone size={12} className="text-slate-400" />
                      {driver.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Truck size={12} className="text-slate-400" />
                      {driver.vehicle}
                    </div>
                    <div><span className="text-slate-400">Trips:</span> <span className="font-semibold">{driver.trips}</span></div>
                    <div><span className="text-slate-400">KM:</span> <span className="font-semibold">{driver.kmDriven.toLocaleString()}</span></div>
                  </div>

                  {(licenseExpired || licenseExpiringSoon) && (
                    <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg mb-3 ${licenseExpired ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>
                      <AlertTriangle size={12} />
                      <span>DL {licenseExpired ? 'EXPIRED' : `expires ${driver.licenseExpiry}`}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} className={`w-2 h-2 rounded-full ${s <= Math.floor(driver.rating) ? 'bg-[#f97316]' : 'bg-slate-200'}`}></div>
                      ))}
                      <span className="text-xs text-slate-500 ml-1">{driver.rating}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(driver); setProfileOpen(true); }}
                      className="flex items-center gap-1 text-xs text-[#f97316] font-semibold hover:underline"
                    >
                      <Eye size={12} />View Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <DriverProfileModal driver={selected} open={profileOpen} onClose={() => setProfileOpen(false)} />
      <AddDriverModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </Layout>
  );
};

export default Drivers;