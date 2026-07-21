import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader, EmptyState, SkeletonTable } from '../../components/ui';

const IncomingParcels = () => {
  const { apiFetch } = useAuth();
  const toast = useToast();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('Arrived');
  const [search, setSearch]   = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const load = () => {
    setLoading(true);
    apiFetch('/parcels/incoming').then(setParcels).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = parcels.filter(p => {
    const matchTab = p.status === tab;
    const matchSearch = !search || p.parcelName.toLowerCase().includes(search.toLowerCase()) || p.trackingNumber.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const doAction = async (id, endpoint, label) => {
    setActionLoading(id);
    try {
      await apiFetch(`/parcels/${id}/${endpoint}`, { method:'PUT', body: JSON.stringify({}) });
      toast.success(`${label} updated successfully!`);
      load();
    } catch(e) { toast.error(e.message); }
    finally { setActionLoading(null); }
  };

  const tabs = [
    { label: 'Expected', count: parcels.filter(p => p.status === 'Expected').length },
    { label: 'Arrived',  count: parcels.filter(p => p.status === 'Arrived').length },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incoming Parcels</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage parcels at your shop</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map(t => (
              <button key={t.label} onClick={() => setTab(t.label)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${tab === t.label ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                {t.label} {t.count > 0 && <span className="ml-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search parcels…" className="input-field sm:max-w-52" />
        </div>

        {loading ? (
          <SkeletonTable rows={3} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium text-gray-900 dark:text-white">No {tab.toLowerCase()} parcels</p>
            <p className="text-sm text-gray-400 mt-1">Nothing to show here right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(p => (
              <div key={p._id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm flex-shrink-0">📦</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{p.parcelName}</p>
                    <p className="text-xs font-mono text-gray-400">{p.trackingNumber}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">👤 {p.customerId?.name} · 📞 {p.customerId?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{p.fee}</span>
                  {tab === 'Expected' && (
                    <button disabled={actionLoading === p._id} onClick={() => doAction(p._id, 'received', 'Parcel')}
                      className="btn-primary text-xs py-1.5 disabled:opacity-50">
                      {actionLoading === p._id ? '…' : 'Mark Arrived'}
                    </button>
                  )}
                  {tab === 'Arrived' && (
                    <button disabled={actionLoading === p._id} onClick={() => doAction(p._id, 'ready', 'OTP generated,')}
                      className="btn-primary text-xs py-1.5 disabled:opacity-50">
                      {actionLoading === p._id ? '…' : 'Generate OTP'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default IncomingParcels;
