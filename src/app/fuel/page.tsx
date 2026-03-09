'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scan, Download, TrendingUp, Fuel as FuelIcon, Search } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { AIScanModal } from '@/components/AIScanModal';
import { useFleetStore } from '@/lib/store';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Sep', cost: 78000, kmpl: 4.5 },
  { month: 'Oct', cost: 91000, kmpl: 4.1 },
  { month: 'Nov', cost: 74000, kmpl: 4.8 },
  { month: 'Dec', cost: 79000, kmpl: 4.6 },
  { month: 'Jan', cost: 71000, kmpl: 4.9 },
];

const FuelPage = () => {
  const { fuelEntries, addFuelEntry } = useFleetStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    vehicle: '',
    driver: '',
    km: '',
    fuel: '',
    cost: '',
    vendor: '',
  });

  const filtered = fuelEntries.filter(
    (e) =>
      e.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      e.driver.toLowerCase().includes(search.toLowerCase())
  );

  const handleScanResult = (result: Record<string, string>) => {
    setForm((prev) => ({
      ...prev,
      km: result.kmReading || prev.km,
      fuel: result.fuelAmount?.replace(' L', '') || prev.fuel,
      cost: result.fuelCost?.replace('৳', '').replace(',', '') || prev.cost,
      vendor: result.vendor || prev.vendor,
      vehicle: result.vehicleNo || prev.vehicle,
    }));
    setAddOpen(true);
  };

  const handleAdd = () => {
    if (!form.vehicle || !form.km || !form.fuel || !form.cost) {
      toast.error('Fill all required fields');
      return;
    }
    const newEntry = {
      vehicle: form.vehicle,
      driver: form.driver || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      km: parseInt(form.km) || 0,
      fuel: parseFloat(form.fuel) || 0,
      cost: parseFloat(form.cost) || 0,
      kmpl:
        parseFloat(form.km) > 0 && parseFloat(form.fuel) > 0
          ? parseFloat((parseFloat(form.km) / parseFloat(form.fuel)).toFixed(1))
          : 0,
      vendor: form.vendor || '-',
    };
    addFuelEntry(newEntry);
    setForm({ vehicle: '', driver: '', km: '', fuel: '', cost: '', vendor: '' });
    setAddOpen(false);
    toast.success('Fuel entry added!');
  };

  const handleDownload = () => {
    const csv = [
      'Vehicle,Driver,Date,KM,Fuel(L),Cost(৳),KMPL,Vendor',
      ...fuelEntries.map(
        (e) =>
          `${e.vehicle},${e.driver},${e.date},${e.km},${e.fuel},${e.cost},${e.kmpl},${e.vendor}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fuel_entries.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fuel report downloaded!');
  };

  const totalCost = fuelEntries.reduce((s, e) => s + e.cost, 0);
  const avgKmpl =
    fuelEntries.length > 0
      ? (fuelEntries.reduce((s, e) => s + e.kmpl, 0) / fuelEntries.length).toFixed(1)
      : '0';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fuel Management</h1>
            <p className="text-slate-500 text-sm">{fuelEntries.length} fuel entries</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setScanOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1923] text-white rounded-lg hover:bg-[#1a2535] transition-all text-sm font-medium"
            >
              <Scan size={16} />
              AI Scan Bill
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium"
            >
              <Plus size={16} />
              Add Entry
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Monthly Fuel Cost', value: `৳${totalCost.toLocaleString()}`, icon: FuelIcon, color: 'bg-orange-500' },
            { label: 'Avg KMPL', value: avgKmpl, icon: TrendingUp, color: 'bg-green-600' },
            {
              label: 'Total Fuel (L)',
              value: fuelEntries.reduce((s, e) => s + e.fuel, 0).toLocaleString(),
              icon: FuelIcon,
              color: 'bg-blue-600',
            },
            { label: 'Entries This Month', value: fuelEntries.length, icon: FuelIcon, color: 'bg-purple-600' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                <k.icon size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{k.value}</div>
                <div className="text-xs text-slate-500">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Monthly Fuel Cost Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `৳${Number(v).toLocaleString()}`} />
              <Bar dataKey="cost" fill="#f97316" radius={[4, 4, 0, 0]} name="Cost (৳)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Vehicle', 'Driver', 'Date', 'KM Reading', 'Fuel (L)', 'Cost (৳)', 'KMPL', 'Vendor'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{entry.vehicle}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{entry.driver}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{entry.date}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{entry.km.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{entry.fuel}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">৳{entry.cost.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`font-bold ${
                          entry.kmpl >= 5 ? 'text-green-600' : entry.kmpl >= 4.5 ? 'text-orange-600' : 'text-red-600'
                        }`}
                      >
                        {entry.kmpl}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{entry.vendor}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Entry Modal */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add Fuel Entry</h2>
              <div className="space-y-3">
                {[
                  { key: 'vehicle', label: 'Vehicle Reg No', placeholder: 'TN 09 AB 1234' },
                  { key: 'driver', label: 'Driver Name', placeholder: 'Driver name' },
                  { key: 'km', label: 'KM Reading', placeholder: '48320' },
                  { key: 'fuel', label: 'Fuel Amount (L)', placeholder: '85' },
                  { key: 'cost', label: 'Fuel Cost (৳)', placeholder: '8415' },
                  { key: 'vendor', label: 'Vendor / Pump', placeholder: 'HP Petrol Pump' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setAddOpen(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium"
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AIScanModal open={scanOpen} onClose={() => setScanOpen(false)} mode="fuel" onResult={handleScanResult} />
    </Layout>
  );
};

export default FuelPage;
