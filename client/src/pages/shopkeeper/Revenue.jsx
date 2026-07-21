import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Revenue = () => {
  const { apiFetch } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/parcels/revenue')
      .then(d => setParcels(d?.parcels || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = parcels.reduce((a, p) => a + (p.fee || 0), 0);
  const thisMonth = parcels.filter(p => {
    const d = new Date(p.pickupDate);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).reduce((a, p) => a + (p.fee || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Earnings from delivered parcels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Revenue',    value: `₹${total}`,      icon: '💰', color: 'bg-green-50 dark:bg-green-900/30' },
          { label: 'This Month',       value: `₹${thisMonth}`,  icon: '📅', color: 'bg-indigo-50 dark:bg-indigo-900/30' },
          { label: 'Total Deliveries', value: parcels.length,   icon: '📦', color: 'bg-amber-50 dark:bg-amber-900/30' },
        ].map(s => (
          <div key={s.label} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Delivery History</h2>
        </div>
        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1,2,3].map(i => <div key={i} className="p-5 animate-pulse"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/></div>)}
          </div>
        ) : parcels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📊</div>
            <p className="font-medium text-gray-900 dark:text-white">No deliveries yet</p>
            <p className="text-sm text-gray-400 mt-1">Revenue will appear here after parcels are delivered.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="table-header">Parcel</th>
                <th className="table-header">Customer</th>
                <th className="table-header hidden md:table-cell">Tracking</th>
                <th className="table-header hidden sm:table-cell">Pickup Date</th>
                <th className="table-header text-right">Fee</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[...parcels].reverse().map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="table-cell font-medium text-gray-900 dark:text-white">{p.parcelName}</td>
                    <td className="table-cell text-gray-500">{p.customerId?.name}</td>
                    <td className="table-cell hidden md:table-cell font-mono text-xs text-gray-400">{p.trackingNumber}</td>
                    <td className="table-cell hidden sm:table-cell text-gray-500 text-xs">{p.pickupDate ? new Date(p.pickupDate).toLocaleDateString() : '—'}</td>
                    <td className="table-cell text-right font-bold text-green-600 dark:text-green-400">₹{p.fee}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr className="bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-700">
                <td className="table-cell font-bold text-gray-900 dark:text-white" colSpan={3}>Total</td>
                <td className="table-cell hidden sm:table-cell"/>
                <td className="table-cell text-right font-bold text-green-600 dark:text-green-400 text-base">₹{total}</td>
              </tr></tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Revenue;
