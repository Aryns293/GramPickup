import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Bar = ({ value, max, color }) => (
  <div className="flex-1 flex flex-col items-center gap-1">
    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{value}</span>
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-sm" style={{ height: 80 }}>
      <div className={`w-full ${color} rounded-t-sm transition-all duration-500`} style={{ height: max ? `${(value/max)*80}px` : 0, marginTop: max ? `${80-(value/max)*80}px` : 80 }}/>
    </div>
  </div>
);

const AdminAnalytics = () => {
  const { apiFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { apiFetch('/analytics/dashboard')
      .then(res => setData({ ...res.summary, monthlyParcels: res.monthlyParcels, monthlyRevenue: res.monthlyRevenue }))
      .catch(console.error).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-48 mb-6"/><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="card p-6"><div className="h-8 bg-gray-100 dark:bg-gray-800 rounded mb-2"/></div>)}</div></div>;

  const maxParcels = Math.max(...(data?.monthlyParcels||[]).map(m=>m.count), 1);
  const maxRevenue = Math.max(...(data?.monthlyRevenue||[]).map(m=>m.revenue), 1);

  return (
    <div className="animate-fade-in">
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Platform performance overview</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Customers',    value: data?.totalCustomers||0,    icon:'👤', c:'bg-blue-50 dark:bg-blue-900/30' },
          { label:'Shopkeepers',  value: data?.totalShopkeepers||0,  icon:'🏪', c:'bg-violet-50 dark:bg-violet-900/30' },
          { label:'Total Shops',  value: data?.totalShops||0,        icon:'🏬', c:'bg-amber-50 dark:bg-amber-900/30' },
          { label:'Total Parcels',value: data?.totalParcels||0,      icon:'📦', c:'bg-indigo-50 dark:bg-indigo-900/30' },
        ].map(s => (
          <div key={s.label} className="card p-6">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">{s.label}</p><p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p></div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.c}`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Monthly parcels */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Monthly Parcels (last 6 months)</h2>
          {data?.monthlyParcels?.length > 0 ? (
            <div>
              <div className="flex items-end gap-2 mb-2" style={{ height: 88 }}>
                {data.monthlyParcels.map((m,i) => <Bar key={i} value={m.count} max={maxParcels} color="bg-indigo-500"/>)}
              </div>
              <div className="flex gap-2">{data.monthlyParcels.map((m,i) => <div key={i} className="flex-1 text-center text-xs text-gray-400">{m.label}</div>)}</div>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
        </div>

        {/* Monthly revenue */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Monthly Revenue (last 6 months)</h2>
          {data?.monthlyRevenue?.length > 0 ? (
            <div>
              <div className="flex items-end gap-2 mb-2" style={{ height: 88 }}>
                {data.monthlyRevenue.map((m,i) => <Bar key={i} value={m.revenue} max={maxRevenue} color="bg-green-500"/>)}
              </div>
              <div className="flex gap-2">{data.monthlyRevenue.map((m,i) => <div key={i} className="flex-1 text-center text-xs text-gray-400">{m.label}</div>)}</div>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet</p>}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Parcel Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(data?.statusBreakdown||{}).map(([k,v]) => {
            const colors = { 'Expected':'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300','Arrived':'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300','Ready for Pickup':'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300','Delivered':'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300','Cancelled':'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
            return (
              <div key={k} className={`rounded-xl p-4 text-center ${colors[k]}`}>
                <p className="text-2xl font-bold mb-1">{v}</p>
                <p className="text-xs font-semibold">{k}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AdminAnalytics;
