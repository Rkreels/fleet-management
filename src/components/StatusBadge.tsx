import React from 'react';

type Status = 'active' | 'inactive' | 'expired' | 'due' | 'ok' | 'warning' | 'critical' | 'pending' | 'approved';

const map: Record<Status, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
  due: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  ok: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-blue-100 text-blue-700 border-blue-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const StatusBadge: React.FC<{ status: Status; label?: string }> = ({ status, label }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`}>
    {label || status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;