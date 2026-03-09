import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Search, Circle } from 'lucide-react';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';

const positions = ['Front LHS', 'Front RHS', 'Axle LHS Inner', 'Axle LHS Outer', 'Axle RHS Inner', 'Axle RHS Outer', 'Dummy'];

const initialTyres = [
  { id: 1, vehicle: 'TN 09 AB 1234', tyreNo: 'TYR-001', position: 'Front LHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-08-10', changeKm: 42000, currentKm: 48320, cost: 18500, mileage: 80000, cpkm: 0.23 },
  { id: 2, vehicle: 'TN 09 AB 1234', tyreNo: 'TYR-002', position: 'Front RHS', size: '295/80 R22.5', brand: 'MRF', changeDate: '2025-08-10', changeKm: 42000, currentKm: 48320, cost: 18500, mileage: 80000, cpkm: 0.23 },
  { id: 3, vehicle: 'TN 09 AB 1234', tyreNo: 'TYR-003', position: 'Axle LHS Inner', size: '295/80 R22.5', brand: 'Apollo', changeDate: '2025-06-15', changeKm: 38000, currentKm: 48320, cost: 17200, mileage: 80000, cpkm: 0.22 },
  { id: 4, vehicle: 'TN 09 CD 5678', tyreNo: 'TYR-007', position: 'Front LHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-09-20', changeKm: 55000, currentKm: 62150, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 5, vehicle: 'TN 09 CD 5678', tyreNo: 'TYR-008', position: 'Front RHS', size: '295/80 R22.5', brand: 'CEAT', changeDate: '2025-09-20', changeKm: 55000, currentKm: 62150, cost: 16800, mileage: 80000, cpkm: 0.21 },
  { id: 6, vehicle: 'TN 09 EF 9012', tyreNo: 'TYR-013', position: 'Front LHS', size: '295/80 R22.5', brand: 'Bridgestone', changeDate: '2025-11-05', changeKm: 25000, currentKm: 31200, cost: 22000, mileage: 100000, cpkm: 0.22 },
];

const Tyres: React.FC = () => {
  const [tyres, setTyres] = useState(initialTyres);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ vehicle: '', tyreNo: '', position: positions[0], size: '', brand: '', changeKm: '', cost: '', mileage: '' });

  const filtered = tyres.filter(t =>
    t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
    t.tyreNo.toLowerCase().includes(search.toLowerCase()) ||
    t.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.vehicle || !form.tyreNo || !form.cost) { toast.error('Fill required fields'); return; }
    const cost = parseFloat(form.cost) || 0;
    const mileage = parseFloat(form.mileage) || 80000;
    setTyres(prev => [...prev, {
      id: prev.length + 1,
      vehicle: form.vehicle,
      tyreNo: form.tyreNo,
      position: form.position,
      size: form.size || '295/80 R22.5',
      brand: form.brand || '-',
      changeDate: new Date().toISOString().split('T')[0],
      changeKm: parseInt(form.changeKm) || 0,
      currentKm: parseInt(form.changeKm) || 0,
      cost,
      mileage,
      cpkm: parseFloat((cost / mileage).toFixed(2)),
    }]);
    setForm({ vehicle: '', tyreNo: '', position: positions[0], size: '', brand: '', changeKm: '', cost: '', mileage: '' });
    setAddOpen(false);
    toast.success('Tyre entry added!');
  };

  const handleDownload = () => {
    const csv = ['Vehicle,Tyre No,Position,Size,Brand,Change Date,Change KM,Current KM,Cost,CPKM', ...tyres.map(t => `${t.vehicle},${t.tyreNo},${t.position},${t.size},${t.brand},${t.changeDate},${t.changeKm},${t.currentKm},${t.cost},${t.cpkm}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tyre_records.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Tyre report downloaded!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tyre Management</h1>
            <p className="text-slate-500 text-sm">{tyres.length} tyre records</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
              <Download size={16} />Export
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">
              <Plus size={16} />Add Tyre Entry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Tyres Tracked', value: tyres.length, color: 'bg-[#f97316]' },
            { label: 'Avg CPKM', value: '₹0.22', color: 'bg-blue-600' },
            { label: 'Total Tyre Cost', value: `₹${tyres.reduce((s, t) => s + t.cost, 0).toLocaleString()}`, color: 'bg-green-600' },
            { label: 'Due for Change', value: tyres.filter(t => (t.currentKm - t.changeKm) > t.mileage * 0.9).length, color: 'bg-red-500' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                <Circle size={18} className="text-white" />
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tyres..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Vehicle', 'Tyre No', 'Position', 'Size', 'Brand', 'Change Date', 'Change KM', 'KM Used', 'Cost', 'CPKM', 'Wear %'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tyre, i) => {
                  const kmUsed = tyre.currentKm - tyre.changeKm;
                  const wearPct = Math.min(100, Math.round((kmUsed / tyre.mileage) * 100));
                  return (
                    <motion.tr key={tyre.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">{tyre.vehicle}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{tyre.tyreNo}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{tyre.position}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{tyre.size}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{tyre.brand}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{tyre.changeDate}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{tyre.changeKm.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{kmUsed.toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 text-sm">₹{tyre.cost.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-[#f97316] text-sm">₹{tyre.cpkm}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-200 rounded-full h-1.5 w-16">
                            <div className={`h-1.5 rounded-full ${wearPct > 80 ? 'bg-red-500' : wearPct > 60 ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${wearPct}%` }} />
                          </div>
                          <span className={`text-xs font-semibold ${wearPct > 80 ? 'text-red-600' : wearPct > 60 ? 'text-orange-600' : 'text-green-600'}`}>{wearPct}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add Tyre Entry</h2>
              <div className="space-y-3">
                {[
                  { key: 'vehicle', label: 'Vehicle Reg No', placeholder: 'TN 09 AB 1234', type: 'text' },
                  { key: 'tyreNo', label: 'Tyre Number', placeholder: 'TYR-001', type: 'text' },
                  { key: 'size', label: 'Tyre Size', placeholder: '295/80 R22.5', type: 'text' },
                  { key: 'brand', label: 'Brand', placeholder: 'MRF / Apollo / CEAT', type: 'text' },
                  { key: 'changeKm', label: 'Change KM Reading', placeholder: '42000', type: 'number' },
                  { key: 'cost', label: 'Tyre Cost (₹)', placeholder: '18500', type: 'number' },
                  { key: 'mileage', label: 'Expected Mileage (KM)', placeholder: '80000', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                    <input type={f.type} value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Position</label>
                  <select value={form.position} onChange={e => setForm(prev => ({ ...prev, position: e.target.value }))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40">
                    {positions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setAddOpen(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">Add Tyre</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tyres;