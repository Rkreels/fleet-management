import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Truck, Users, Fuel, Wrench, Circle, CreditCard,
  MapPin, Route, Package, BarChart3, Bell, FileSpreadsheet,
  Settings, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Truck, label: 'Vehicles' },
  { to: '/drivers', icon: Users, label: 'Drivers' },
  { to: '/gps', icon: MapPin, label: 'GPS Tracking' },
  { to: '/fuel', icon: Fuel, label: 'Fuel Management' },
  { to: '/fastag', icon: CreditCard, label: 'FASTag' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance' },
  { to: '/tyres', icon: Circle, label: 'Tyre Management' },
  { to: '/trips', icon: Route, label: 'Trip Management' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/alerts', icon: Bell, label: 'Alerts' },
  { to: '/sap-export', icon: FileSpreadsheet, label: 'SAP Export' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, #0f1923 0%, #1a2535 60%, #0f1923 100%)' }}
    >
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>SKM</div>
            <div className="text-[#f97316] text-xs font-semibold tracking-widest">TRANSPORT</div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg mb-0.5 transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#f97316] text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex items-center justify-center w-full py-3 border-t border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  );
};

export default Sidebar;