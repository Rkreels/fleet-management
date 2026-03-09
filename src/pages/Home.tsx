import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, Fuel, AlertTriangle, TrendingUp, MapPin, Wrench, CreditCard, Smartphone, BarChart3, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout';
import KpiCard from '../components/KpiCard';
import LiveMapView from '../components/LiveMapView';
import DriverAppView from '../components/DriverAppView';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const fuelData = [
  { month: 'Aug', kmpl: 4.2, cost: 82000 },
  { month: 'Sep', kmpl: 4.5, cost: 78000 },
  { month: 'Oct', kmpl: 4.1, cost: 91000 },
  { month: 'Nov', kmpl: 4.8, cost: 74000 },
  { month: 'Dec', kmpl: 4.6, cost: 79000 },
  { month: 'Jan', kmpl: 4.9, cost: 71000 },
];

const expenseData = [
  { name: 'Fuel', value: 71000 },
  { name: 'Maintenance', value: 28000 },
  { name: 'Toll', value: 12000 },
  { name: 'Tyre', value: 18000 },
  { name: 'Other', value: 8000 },
];

const recentAlerts = [
  { type: 'critical', msg: 'TN 09 AB 1234 — Insurance expires in 5 days', time: '2h ago' },
  { type: 'warning', msg: 'Driver Rajan Kumar — DL expires in 12 days', time: '4h ago' },
  { type: 'warning', msg: 'TN 09 CD 5678 — FASTag balance low (₹450)', time: '6h ago' },
  { type: 'info', msg: 'TN 09 EF 9012 — Service due at 50,000 KM', time: '1d ago' },
];

const Home: React.FC = () => {
  const [driverAppOpen, setDriverAppOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fleet Dashboard</h1>
            <p className="text-slate-500 text-sm mt-0.5">SKM Transportation — Real-time Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDriverAppOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1923] text-white rounded-lg hover:bg-[#1a2535] transition-all duration-200 text-sm font-medium"
            >
              <Smartphone size={16} />
              Driver App Preview
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-xs font-semibold">Live Tracking Active</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Vehicles" value="24" sub="18 active, 6 idle" icon={Truck} color="bg-[#f97316]" trend="+2 this month" trendUp />
          <KpiCard title="Active Drivers" value="21" sub="3 on leave" icon={Users} color="bg-blue-600" trend="+1 this week" trendUp />
          <KpiCard title="Monthly Fuel Cost" value="₹71K" sub="Avg 4.9 KMPL" icon={Fuel} color="bg-green-600" trend="-8% vs last" trendUp />
          <KpiCard title="Pending Alerts" value="7" sub="2 critical, 5 warnings" icon={AlertTriangle} color="bg-red-500" trend="3 new today" trendUp={false} />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Active Trips" value="12" sub="Across 5 routes" icon={TrendingUp} color="bg-purple-600" />
          <KpiCard title="GPS Vehicles" value="24/24" sub="All connected" icon={MapPin} color="bg-teal-600" trend="100%" trendUp />
          <KpiCard title="Service Due" value="3" sub="Next 30 days" icon={Wrench} color="bg-orange-500" />
          <KpiCard title="FASTag Balance" value="₹48K" sub="Avg ₹2,000/vehicle" icon={CreditCard} color="bg-indigo-600" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Fuel Efficiency Trend</h2>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={fuelData}>
                <defs>
                  <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="kmpl" stroke="#f97316" fill="url(#fuelGrad)" strokeWidth={2} name="KMPL" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-4">Monthly Expenses</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={expenseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Map + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 340 }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
              <h2 className="font-bold text-slate-800">Live Fleet Map</h2>
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </div>
            </div>
            <div style={{ height: 290 }}>
              <LiveMapView />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Recent Alerts</h2>
              <span className="text-xs text-[#f97316] font-semibold cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-200' :
                    alert.type === 'warning' ? 'bg-orange-50 border-orange-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${
                    alert.type === 'critical' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="text-xs font-medium text-slate-800">{alert.msg}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Documents Expiring (30d)', value: '5', icon: AlertTriangle, color: 'text-orange-500' },
            { label: 'Trips Completed (Month)', value: '142', icon: TrendingUp, color: 'text-green-500' },
            { label: 'Tyres Changed (Month)', value: '8', icon: CheckCircle, color: 'text-blue-500' },
            { label: 'Total KM (Month)', value: '48,320', icon: BarChart3, color: 'text-purple-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
              <stat.icon size={24} className={stat.color} />
              <div>
                <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DriverAppView open={driverAppOpen} onClose={() => setDriverAppOpen(false)} />
    </Layout>
  );
};

export default Home;