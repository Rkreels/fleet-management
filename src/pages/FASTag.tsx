import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Plus, AlertTriangle, Download, Search, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'react-toastify';

const initialFastags = [
  { id: 1, fastagId: 'FT-TN-001', vehicle: 'TN 09 AB 1234', driver: 'Rajan Kumar', balance: 2450, threshold: 500, status: 'ok' as const, lastToll: '2026-01-15', monthlyToll: 4200, bank: 'HDFC Bank' },
  { id: 2, fastagId: 'FT-TN-002', vehicle: 'TN 09 CD 5678', driver: 'Suresh Babu', balance: 380, threshold: 500, status: 'warning' as const, lastToll: '2026-01-14', monthlyToll: 3800, bank: 'ICICI Bank' },
  { id: 3, fastagId: 'FT-TN-003', vehicle: 'TN 09 EF 9012', driver: 'Murugan S', balance: 1820, threshold: 500, status: 'ok' as const, lastToll: '2026-01-15', monthlyToll: 2900, bank: 'SBI' },
  { id: 4, fastagId: 'FT-TN-004', vehicle: 'TN 09 GH 3456', driver: 'Vijay R', balance: 120, threshold: 500, status: 'critical' as const, lastToll: '2025-12-20', monthlyToll: 1200, bank: 'Axis Bank' },
  { id: 5, fastagId: 'FT-TN-005', vehicle: 'TN 09 IJ 7890', driver: 'Karthik M', balance: 3100, threshold: 500, status: 'ok' as const, lastToll: '2026-01-15', monthlyToll: 5100, bank: 'HDFC Bank' },
  { id: 6, fastagId: 'FT-TN-006', vehicle: 'TN 09 KL 2345', driver: 'Selvam P', balance: 650, threshold: 500, status: 'ok' as const, lastToll: '2026-01-12', monthlyToll: 3400, bank: 'Kotak Bank' },
];

const tollHistory = [
  { date: '2026-01-15', vehicle: 'TN 09 AB 1234', plaza: 'Poonamallee Toll', amount: 85, balance: 2450 },
  { date: '2026-01-15', vehicle: 'TN 09 EF 9012', plaza: 'Walajapet Toll', amount: 120, balance: 1820 },
  { date: '2026-01-14', vehicle: 'TN 09 CD 5678', plaza: 'Sriperumbudur Toll', amount: 95, balance: 380 },
  { date: '2026-01-14', vehicle: 'TN 09 IJ 7890', plaza: 'Vandalur Toll', amount: 75, balance: 3100 },
  { date: '2026-01-13', vehicle: 'TN 09 AB 1234', plaza: 'Tambaram Toll', amount: 65, balance: 2535 },
];

const FASTag: React.FC = () => {
  const [fastags, setFastags] = useState(initialFastags);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [rechargeId, setRechargeId] = useState<number | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [form, setForm] = useState({ fastagId: '', vehicle: '', driver: '', bank: '', threshold: '500' });

  const filtered = fastags.filter(f =>
    f.vehicle.toLowerCase().includes(search.toLowerCase()) ||
    f.fastagId.toLowerCase().includes(search.toLowerCase()) ||
    f.driver.toLowerCase().includes(search.toLowerCase())
  );

  const handleRecharge = (id: number) => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) { toast.error('Enter valid amount'); return; }
    setFastags(prev => prev.map(f => {
      if (f.id !== id) return f;
      const newBalance = f.balance + amount;
      return { ...f, balance: newBalance, status: newBalance >= f.threshold ? 'ok' as const : 'warning' as const };
    }));
    toast.success(`FASTag recharged with ₹${amount.toLocaleString()}`);
    setRechargeId(null);
    setRechargeAmount('');
  };

  const handleAdd = () => {
    if (!form.fastagId || !form.vehicle) { toast.error('Fill required fields'); return; }
    setFastags(prev => [...prev, {
      id: prev.length + 1,
      fastagId: form.fastagId,
      vehicle: form.vehicle,
      driver: form.driver,
      balance: 1000,
      threshold: parseInt(form.threshold) || 500,
      status: 'ok' as const,
      lastToll: '-',
      monthlyToll: 0,
      bank: form.bank || 'HDFC Bank',
    }]);
    setForm({ fastagId: '', vehicle: '', driver: '', bank: '', threshold: '500' });
    setAddOpen(false);
    toast.success('FASTag added!');
  };

  const handleDownload = () => {
    const csv = ['FASTag ID,Vehicle,Driver,Balance,Bank,Monthly Toll', ...fastags.map(f => `${f.fastagId},${f.vehicle},${f.driver},${f.balance},${f.bank},${f.monthlyToll}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fastag_report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('FASTag report downloaded!');
  };

  const totalBalance = fastags.reduce((s, f) => s + f.balance, 0);
  const lowBalance = fastags.filter(f => f.balance < f.threshold).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">FASTag Management</h1>
            <p className="text-slate-500 text-sm">{fastags.length} FASTag accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">
              <Download size={16} />Export
            </button>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">
              <Plus size={16} />Add FASTag
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Balance', value: `₹${totalBalance.toLocaleString()}`, color: 'bg-green-600' },
            { label: 'Low Balance Alerts', value: lowBalance, color: 'bg-red-500' },
            { label: 'Monthly Toll Spend', value: '₹20,600', color: 'bg-blue-600' },
            { label: 'Active FASTags', value: fastags.length, color: 'bg-[#f97316]' },
          ].map(k => (
            <div key={k.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                <CreditCard size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800">{k.value}</div>
                <div className="text-xs text-slate-500">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {lowBalance > 0 && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-700">{lowBalance} FASTag(s) have low balance</p>
              <p className="text-red-600 text-sm">Recharge immediately to avoid toll delays</p>
            </div>
          </div>
        )}

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FASTag..." className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ft, i) => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#0f1923] to-[#1a2535] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-[#f97316]" />
                    <span className="text-white font-bold text-sm">{ft.fastagId}</span>
                  </div>
                  <StatusBadge status={ft.status} />
                </div>
                <p className="text-slate-400 text-xs">{ft.vehicle} · {ft.driver}</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Current Balance</p>
                    <p className={`text-2xl font-bold ${ft.balance < ft.threshold ? 'text-red-600' : 'text-green-600'}`}>₹{ft.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Monthly Toll</p>
                    <p className="font-bold text-slate-800">₹{ft.monthlyToll.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${ft.balance < ft.threshold ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (ft.balance / 5000) * 100)}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500">Bank:</span> <span className="font-semibold text-slate-700">{ft.bank}</span></div>
                  <div><span className="text-slate-500">Last Toll:</span> <span className="font-semibold text-slate-700">{ft.lastToll}</span></div>
                </div>

                {rechargeId === ft.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={rechargeAmount}
                      onChange={e => setRechargeAmount(e.target.value)}
                      placeholder="Amount (₹)"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
                    />
                    <button onClick={() => handleRecharge(ft.id)} className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-all">Recharge</button>
                    <button onClick={() => setRechargeId(null)} className="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition-all">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setRechargeId(ft.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium"
                  >
                    <RefreshCw size={14} />Recharge FASTag
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toll History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-bold text-slate-800">Recent Toll Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Date', 'Vehicle', 'Toll Plaza', 'Amount', 'Balance After'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tollHistory.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{t.date}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{t.vehicle}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{t.plaza}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-600">-₹{t.amount}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">₹{t.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add FASTag Modal */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add FASTag</h2>
              <div className="space-y-3">
                {[
                  { key: 'fastagId', label: 'FASTag ID', placeholder: 'FT-TN-007' },
                  { key: 'vehicle', label: 'Vehicle Reg No', placeholder: 'TN 09 MN 1234' },
                  { key: 'driver', label: 'Driver Name', placeholder: 'Driver name' },
                  { key: 'bank', label: 'Linked Bank', placeholder: 'HDFC Bank' },
                  { key: 'threshold', label: 'Low Balance Threshold (₹)', placeholder: '500' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                    <input value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setAddOpen(false)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm font-medium">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium">Add FASTag</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FASTag;