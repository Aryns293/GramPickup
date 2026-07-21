import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui';

const AdminDashboard = () => {
  const { user, apiFetch } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/analytics/dashboard')
      .then(data => setStats({ ...data.summary, monthlyParcels: data.monthlyParcels, monthlyRevenue: data.monthlyRevenue }))
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Platform overview · Logged in as <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
        </p>
      </div>

      {/* Alert: pending shops */}
      {!loading && stats?.shopBreakdown?.pending > 0 && (
        <div className="mb-6 card border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                {stats.shopBreakdown.pending} shop{stats.shopBreakdown.pending > 1 ? 's' : ''} waiting for approval
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Review and approve or reject pending applications.</p>
            </div>
          </div>
          <Link to="/admin/shops" className="btn-primary text-sm flex-shrink-0">Review Now</Link>
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="card p-6 h-28 animate-pulse bg-gray-100 dark:bg-gray-800"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Customers"     value={stats?.totalCustomers || 0}    icon="👤" color="bg-blue-50   dark:bg-blue-900/30"   to="/admin/users"/>
          <StatCard label="Shops"         value={stats?.totalShops || 0}        icon="🏪" color="bg-amber-50  dark:bg-amber-900/30"  to="/admin/shops"/>
          <StatCard label="Total Parcels" value={stats?.totalParcels || 0}      icon="📦" color="bg-violet-50 dark:bg-violet-900/30" to="/admin/parcels"/>
          <StatCard label="Delivered"     value={stats?.statusBreakdown?.Delivered || 0} icon="✅" color="bg-green-50  dark:bg-green-900/30"  to="/admin/analytics"/>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { to:'/admin/shops',     icon:'🏪', title:'Manage Shops',  desc:'Approve or reject applications',             badge: stats?.shopBreakdown?.pending },
          { to:'/admin/users',     icon:'👥', title:'Users',          desc:'View and manage all users' },
          { to:'/admin/parcels',   icon:'📦', title:'Parcels',        desc:'Platform-wide parcel overview' },
          { to:'/admin/analytics', icon:'📊', title:'Analytics',      desc:'Revenue and monthly trends' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group relative">
            {a.badge > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {a.badge}
              </span>
            )}
            <div className="text-2xl mb-3">{a.icon}</div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{a.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Status breakdown */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Parcel Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(stats.statusBreakdown || {}).map(([k, v]) => {
                const total = stats.totalParcels || 1;
                const pct   = Math.round((v / total) * 100);
                const colors = {
                  'Expected':        'bg-blue-500',
                  'Arrived':         'bg-amber-500',
                  'Ready for Pickup':'bg-violet-500',
                  'Delivered':       'bg-green-500',
                  'Cancelled':       'bg-red-500',
                };
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{k}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{v}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[k] || 'bg-gray-400'} transition-all duration-500`} style={{ width: `${pct}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Shop Status</h2>
            <div className="space-y-4">
              {[
                { label:'Approved', value: stats.shopBreakdown?.approved || 0, color:'bg-green-500',  text:'text-green-600 dark:text-green-400' },
                { label:'Pending',  value: stats.shopBreakdown?.pending  || 0, color:'bg-amber-500',  text:'text-amber-600 dark:text-amber-400' },
                { label:'Rejected', value: stats.shopBreakdown?.rejected || 0, color:'bg-red-500',    text:'text-red-600 dark:text-red-400' },
              ].map(s => {
                const total = stats.totalShops || 1;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{s.label}</span>
                      <span className={`font-bold ${s.text}`}>{s.value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all duration-500`} style={{ width: `${Math.round((s.value/total)*100)}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Total shops: <strong className="text-gray-900 dark:text-white">{stats.totalShops}</strong></span>
              <Link to="/admin/shops" className="text-indigo-500 hover:underline">Manage →</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
