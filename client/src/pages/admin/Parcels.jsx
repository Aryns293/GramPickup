import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = { 'Expected':'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300','Arrived':'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300','Ready for Pickup':'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300','Delivered':'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300','Cancelled':'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' };

const AdminParcels = () => {
  const { apiFetch } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');

  useEffect(() => { apiFetch('/parcels').then(setParcels).catch(console.error).finally(() => setLoading(false)); }, []);

  const statuses = ['All','Expected','Arrived','Ready for Pickup','Delivered','Cancelled'];
  const filtered = parcels.filter(p => {
    const ms = filter === 'All' || p.status === filter;
    const mq = !search || p.parcelName.toLowerCase().includes(search.toLowerCase()) || p.trackingNumber.toLowerCase().includes(search.toLowerCase()) || p.customerId?.name?.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Parcels</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{parcels.length} total parcels on platform</p></div>

      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, tracking, customer…" className="input-field sm:max-w-xs"/>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter===s ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{s}</button>)}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">{[1,2,3].map(i=><div key={i} className="p-5 animate-pulse"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><div className="text-4xl mb-3">📦</div><p className="font-medium text-gray-900 dark:text-white">No parcels found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="table-header">Parcel</th>
                <th className="table-header hidden md:table-cell">Customer</th>
                <th className="table-header hidden lg:table-cell">Shop</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Fee</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="table-cell"><p className="font-medium text-gray-900 dark:text-white text-sm">{p.parcelName}</p><p className="font-mono text-xs text-gray-400">{p.trackingNumber}</p></td>
                    <td className="table-cell hidden md:table-cell text-gray-500 text-sm">{p.customerId?.name}</td>
                    <td className="table-cell hidden lg:table-cell text-gray-500 text-sm">{p.shopId?.shopName}</td>
                    <td className="table-cell"><span className={`badge ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="table-cell text-right font-semibold text-gray-900 dark:text-white">₹{p.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminParcels;
