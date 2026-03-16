'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scan, Download, Route, Search, TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '@/components/Layout';
import { AIScanModal } from '@/components/AIScanModal';
import { StatusBadge } from '@/components/StatusBadge';
import { useFleetStore } from '@/lib/store';
import { toast } from 'sonner';

const TripsPage = () => {
  const { trips, addTrip } = useFleetStore();
  const [scanOpen, setScanOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    vehicle: '',
    driver: '',
    from: '',
    to: '',
    distance: '',
    freight: '',
    fuelCost: '',
    tollCost: '',
    otherCost: '',
  });

  const filtered = trips.filter(
    (t) =>
      t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.vehicle || !form.from || !form.to) {
      toast.error('Fill required fields');
      return;
    }
    const freight = parseFloat(form.freight) || 0;
    const fuelCost = parseFloat(form.fuelCost) || 0;
    const tollCost = parseFloat(form.tollCost) || 0;
    const otherCost = parseFloat(form.otherCost) || 0;
    addTrip({
      vehicle: form.vehicle,
      driver: form.driver || '-',
      from: form.from,
      to: form.to,
      date: new Date().toISOString().split('T')[0],
      distance: parseInt(form.distance) || 0,
      freight,
      fuelCost,
      tollCost,
      otherCost,
      status: 'active',
    });
    setForm({
      vehicle: '',
      driver: '',
      from: '',
      to: '',
      distance: '',
      freight: '',
      fuelCost: '',
      tollCost: '',
      otherCost: '',
    });
    setAddOpen(false);
    toast.success('Trip added!');
  };

  const handleDownload = () => {
    const csv = [
      'Vehicle,Driver,From,To,Date,Distance,Freight,Fuel Cost,Toll,Other,Net P/L',
      ...trips.map((t) => {
        const total = t.fuelCost + t.tollCost + t.otherCost;
        const pl = t.freight - total;
        return `${t.vehicle},${t.driver},${t.from},${t.to},${t.date},${t.distance},${t.freight},${t.fuelCost},${t.tollCost},${t.otherCost},${pl}`;
      }),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Trip report downloaded!');
  };

  const totalFreight = trips.reduce((s, t) => s + t.freight, 0);
  const totalExpense = trips.reduce((s, t) => s + t.fuelCost + t.tollCost + t.otherCost, 0);
  const netPL = totalFreight - totalExpense;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Trip Management</h1>
            <p className="text-slate-500 text-sm">{trips.length} trips recorded</p>
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
              AI Scan Sheet
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium"
            >
              <Plus size={16} />
              Add Trip
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Freight',
              value: `৳${totalFreight.toLocaleString()}`,
              color: 'bg-green-600',
              icon: TrendingUp,
            },
            {
              label: 'Total Expenses',
              value: `৳${totalExpense.toLocaleString()}`,
              color: 'bg-red-500',
              icon: TrendingDown,
            },
            {
              label: 'Net P&L',
              value: `৳${netPL.toLocaleString()}`,
              color: netPL >= 0 ? 'bg-blue-600' : 'bg-red-600',
              icon: TrendingUp,
            },
            { label: 'Active Trips', value: trips.filter((t) => t.status === 'active').length, color: 'bg-[#f97316]', icon: Route },
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

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trips..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Vehicle', 'Driver', 'Route', 'Date', 'Distance', 'Freight', 'Expenses', 'Net P/L', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((trip, i) => {
                  const totalExp = trip.fuelCost + trip.tollCost + trip.otherCost;
                  const pl = trip.freight - totalExp;
                  return (
                    <motion.tr
                      key={trip.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800 text-sm whitespace-nowrap">{trip.vehicle}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{trip.driver}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">
                        {trip.from} → {trip.to}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-sm whitespace-nowrap">{trip.date}</td>
                      <td className="px-4 py-3 text-slate-600 text-sm">{trip.distance} km</td>
                      <td className="px-4 py-3 font-semibold text-green-700 text-sm">৳{trip.freight.toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-red-600 text-sm">৳{totalExp.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold text-sm">
                        <span className={pl >= 0 ? 'text-green-700' : 'text-red-600'}>{pl >= 0 ? '+' : ''}৳{pl.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={trip.status} />
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
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add Trip</h2>
              <div className="space-y-3">
                {[
                  { key: 'vehicle', label: 'Vehicle Reg No', placeholder: 'TN 09 AB 1234' },
                  { key: 'driver', label: 'Driver Name', placeholder: 'Driver name' },
                  { key: 'from', label: 'From Location', placeholder: 'Chennai' },
                  { key: 'to', label: 'To Location', placeholder: 'Bangalore' },
                  { key: 'distance', label: 'Distance (KM)', placeholder: '350' },
                  { key: 'freight', label: 'Freight Amount (৳)', placeholder: '28000' },
                  { key: 'fuelCost', label: 'Fuel Cost (৳)', placeholder: '9800' },
                  { key: 'tollCost', label: 'Toll Cost (৳)', placeholder: '1200' },
                  { key: 'otherCost', label: 'Other Expenses (৳)', placeholder: '800' },
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
                  Add Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AIScanModal open={scanOpen} onClose={() => setScanOpen(false)} mode="trip" onResult={() => {}} />
    </Layout>
  );
};

export default TripsPage;
