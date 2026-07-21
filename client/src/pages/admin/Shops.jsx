import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminShops = () => {
  const { apiFetch } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('pending');
  const [busy, setBusy]       = useState(null);

  const load = () => {
    setLoading(true);
    apiFetch('/shops').then(setShops).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatus = async (id, status) => {
    setBusy(id);
    try {
      await apiFetch(`/shops/${id}/status`, { method:'PUT', body: JSON.stringify({ status }) });
      load();
    } catch(e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const filtered = shops.filter(s => s.verificationStatus === filter);
  const counts = { pending: shops.filter(s=>s.verificationStatus==='pending').length, approved: shops.filter(s=>s.verificationStatus==='approved').length, rejected: shops.filter(s=>s.verificationStatus==='rejected').length };

  const tabColors = { pending:'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', approved:'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300', rejected:'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' };

  return (
    <div className="animate-fade-in">
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shops</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review and manage shop applications</p></div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
          {['pending','approved','rejected'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${filter === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              {t} <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{counts[t]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">{[1,2,3].map(i=><div key={i} className="p-5 animate-pulse"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/></div>)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><div className="text-4xl mb-3">✅</div><p className="font-medium text-gray-900 dark:text-white">No {filter} shops</p></div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(s => (
              <div key={s._id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {s.shopPhoto ? <img src={s.shopPhoto} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/> : <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">🏪</div>}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{s.shopName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">📍 {s.city} · {s.address}</p>
                    <p className="text-xs text-gray-400 mt-0.5">👤 {s.ownerName} · 📞 {s.phone}</p>
                    <span className={`badge mt-1 ${tabColors[s.verificationStatus]}`}>{s.verificationStatus}</span>
                  </div>
                </div>
                {s.verificationStatus === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button disabled={busy===s._id} onClick={() => handleStatus(s._id,'approved')} className="btn-primary text-sm py-1.5 disabled:opacity-50">Approve</button>
                    <button disabled={busy===s._id} onClick={() => handleStatus(s._id,'rejected')} className="btn-danger text-sm py-1.5 disabled:opacity-50">Reject</button>
                  </div>
                )}
                {s.verificationStatus === 'approved' && (
                  <button disabled={busy===s._id} onClick={() => handleStatus(s._id,'rejected')} className="btn-danger text-sm py-1.5 disabled:opacity-50">Revoke</button>
                )}
                {s.verificationStatus === 'rejected' && (
                  <button disabled={busy===s._id} onClick={() => handleStatus(s._id,'approved')} className="btn-primary text-sm py-1.5 disabled:opacity-50">Re-approve</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminShops;
