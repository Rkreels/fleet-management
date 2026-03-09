import React, { useEffect, useState } from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 z-30 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-64'
      } ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}
    >
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Toggle menu">
          <Menu size={20} className="text-slate-600" />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicles, drivers..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/40 w-64 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-800">Super Admin</div>
            <div className="text-xs text-slate-500">SKM Transport</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;