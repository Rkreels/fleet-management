import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scan, Download, Wrench, Search, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import AIScanModal from '../components/AIScanModal';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'react-toastify';

const initialRecords = [
  { id: 1, vehicle: 'TN 09 AB 1234', date: '2025-12-10', work: 'Engine oil change, Filter replacement', vendor: 'Sri Murugan Auto Works', cost: 8500, gst: 1530, status: 'approved' as const, nextKm: 50500 },
  { id: 2, vehicle: 'TN 09 CD 5678', date: '2025-11-05', work: 'Brake pad replacement, Wheel alignment', vendor: 'Vel Auto Service', cost: 15200, gst: 2736, status: 'approved' as const, nextKm: 65000 },
  { id: 3, vehicle: 'TN 09 EF 9012', date: '2026-01-02', work: 'AC service, Coolant flush', vendor: 'Ganesh Motors', cost: 6800, gst: 1224, status: 'pending' as const, nextKm: 35000 },
  { id: 4, vehicle: 'TN 09 GH 3456', date: '2025-09-15', work: 'Major service - 75,000 KM', vendor: 'Tata Authorized Service', cost: 32000, gst: 5760, status: 'approved' as const, nextKm: 80000 },
  { id: 5, vehicle: 'TN 09 IJ 7890', date: '2025-12-28', work: 'Tyre rotation, Battery check', vendor: 'Quick Fix Auto', cost: 3200, gst: 576, status: 'approved' as const, nextKm: 25000 },
];

const Maintenance: React.FC = () => {
  const [records, setRecords] = useState(initialRecords);
  const [scanOpen, setScanOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ vehicle: '', work: '', vendor: '', cost: '', gst: '', nextKm: '' });

  const filtered = records.filter(r =>
    r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
    r.vendor.toLowerCase().includes(search.toLowerCase()) ||
    r.work.toLowerCase().includes(search.toLowerCase())
  );

  const handleScanResult = (result: Record<string, string>) => {
    setForm(prev => ({
      ...prev,
      vendor: result.vendor || prev.vendor,
      work: result.workDesc || prev.work,
      cost: result.totalCost?.replace('₹', '').replace(',', '') || prev.cost,
      gst: result.gst?.replace('₹', '').replace(',', '') || prev.gst,
    }));
    setAddOpen(true);
  };

  const handleAdd = () => {
    if (!form.vehicle || !form.work || !form.cost) { toast.error('Fill required fields'); return; }
    setRecords(prev => [...prev, {
      id: prev.length + 1,
      vehicle: form.vehicle,
      date: new Date().toISOString().split('T')[0],
      work: form.work,
      vendor: form.vendor || '-',
      cost: parseFloat(form.cost) || 0,
      gst: parseFloat(form.gst) || 0,
      status: 'pending' as const,
      nextKm: parseInt(form.nextKm) || 0,
    }]);
    setForm({ vehicle: '', work: '', vendor: '', cost: '', gst: '', nextKm: '' });
    setAddOpen(false);
    toast.success('Maintenance record added!');
  };

  const handleApprove = (id: number) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    toast.success('Record approved!');
  };

  const handleDownload = () => {
    const csv = ['Vehicle,Date,Work,Vendor,Cost,GST,Status,Next KM', ...records.map(r => `${r.vehicle},${r.date},"${r.work}",${r.vendor},${r.cost},${r.gst},${r.status},${r.nextKm}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance_records.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Maintenance report downloaded!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Maintenance Management</h1>
            <p className="text-slate-500 text-sm">{records.length} service records</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
              <Download size={16} />Export
            </button>
            <button onClick={() => setScanOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1923] text-white rounded-lg hover:bg-[#1a2535] transition-all text-sm font-medium">
              <Scan size={16} />AI Scan Bill
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">
              <Plus size={16} />Add Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Maintenance Cost', value: '₹65,700', color: 'bg-[#f97316]' },
            { label: 'Pending Approvals', value: records.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
            { label: 'Service Due (30d)', value: '3', color: 'bg-red-500' },
            { label: 'Avg Cost/Vehicle', value: '₹13,140', color: 'bg-blue-600' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                <Wrench size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{k.value}</div>
                <div className="text-xs text-slate-500">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Vehicle', 'Date', 'Work Description', 'Vendor', 'Cost', 'GST', 'Next KM', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((record, i) => (
                  <motion.tr key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">{record.vehicle}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{record.date}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm max-w-xs">{record.work}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{record.vendor}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">₹{record.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">₹{record.gst.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{record.nextKm.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3">
                      {record.status === 'pending' && (
                        <button onClick={() => handleApprove(record.id)} className="flex items-center gap-1 text-xs text-green-600 font-semibold hover:underline">
                          <CheckCircle size={12} />Approve
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add Maintenance Record</h2>
              <div className="space-y-3">
                {[
                  { key: 'vehicle', label: 'Vehicle Reg No', placeholder: 'TN 09 AB 1234' },
                  { key: 'work', label: 'Work Description', placeholder: 'Engine oil change...' },
                  { key: 'vendor', label: 'Vendor / Workshop', placeholder: 'Sri Murugan Auto Works' },
                  { key: 'cost', label: 'Total Cost (₹)', placeholder: '8500' },
                  { key: 'gst', label: 'GST Amount (₹)', placeholder: '1530' },
                  { key: 'nextKm', label: 'Next Service KM', placeholder: '50500' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setAddOpen(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">Add Record</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AIScanModal open={scanOpen} onClose={() => setScanOpen(false)} mode="maintenance" onResult={handleScanResult} />
    </Layout>
  );
};

export default Maintenance;