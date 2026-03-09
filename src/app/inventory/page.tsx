'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Package, Download, AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { useFleetStore } from '@/lib/store';
import { toast } from 'sonner';

const InventoryPage = () => {
  const { inventory, addInventoryItem } = useFleetStore();
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'critical'>('all');
  const [form, setForm] = useState({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' });

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.status === filter;
    return matchSearch && matchFilter;
  });

  const lowStock = inventory.filter((i) => i.status === 'low' || i.status === 'critical').length;

  const handleAdd = () => {
    if (!form.name || !form.quantity) {
      toast.error('Fill required fields');
      return;
    }
    const quantity = parseInt(form.quantity) || 0;
    const minStock = parseInt(form.minStock) || 10;
    const status: 'ok' | 'low' | 'critical' = quantity <= minStock * 0.5 ? 'critical' : quantity < minStock ? 'low' : 'ok';
    addInventoryItem({
      name: form.name,
      category: form.category || 'General',
      quantity,
      unit: form.unit || 'pcs',
      minStock,
      location: form.location || 'Main Warehouse',
      lastUpdated: new Date().toISOString().split('T')[0],
      status,
    });
    setForm({ name: '', category: '', quantity: '', minStock: '', location: '', unit: '' });
    setAddOpen(false);
    toast.success('Item added to inventory!');
  };

  const handleDownload = () => {
    const csv = [
      'Name,Category,Quantity,Unit,Min Stock,Location,Status,Last Updated',
      ...inventory.map((i) => `${i.name},${i.category},${i.quantity},${i.unit},${i.minStock},${i.location},${i.status},${i.lastUpdated}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Inventory report downloaded!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
            <p className="text-slate-500 text-sm">{inventory.length} items in stock</p>
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
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white rounded-lg hover:bg-[#ea6c0a] transition-all text-sm font-medium"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Items', value: inventory.length, color: 'bg-blue-600', icon: Package },
            { label: 'Low Stock Items', value: lowStock, color: 'bg-orange-500', icon: AlertTriangle },
            { label: 'Categories', value: [...new Set(inventory.map((i) => i.category))].length, color: 'bg-purple-600', icon: Package },
            { label: 'Locations', value: [...new Set(inventory.map((i) => i.location))].length, color: 'bg-green-600', icon: Package },
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

        {lowStock > 0 && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-700">{lowStock} items running low on stock</p>
              <p className="text-orange-600 text-sm">Please replenish these items soon</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#f97316]/40"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'low', 'critical'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === f ? 'bg-[#f97316] text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Item Name', 'Category', 'Quantity', 'Unit', 'Min Stock', 'Location', 'Status', 'Last Updated'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{item.category}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{item.unit}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{item.minStock}</td>
                    <td className="px-4 py-3 text-slate-600 text-sm">{item.location}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          item.status === 'ok'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : item.status === 'low'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{item.lastUpdated}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-4">Add Inventory Item</h2>
              <div className="space-y-3">
                {[
                  { key: 'name', label: 'Item Name', placeholder: 'Engine Oil' },
                  { key: 'category', label: 'Category', placeholder: 'Lubricants' },
                  { key: 'quantity', label: 'Quantity', placeholder: '50' },
                  { key: 'unit', label: 'Unit', placeholder: 'L / pcs / sets' },
                  { key: 'minStock', label: 'Minimum Stock Level', placeholder: '20' },
                  { key: 'location', label: 'Storage Location', placeholder: 'Warehouse A' },
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
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default InventoryPage;
