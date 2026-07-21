import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  'Expected':        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Arrived':         'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Ready for Pickup':'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Delivered':       'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Cancelled':       'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const MyParcels = () => {
  const { apiFetch } = useAuth();
  const [parcels, setParcels]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter,  setFilter]    = useState('All');
  const [search,  setSearch]    = useState('');
  const [expanded, setExpanded] = useState(null);
  const [rating,  setRating]    = useState({});
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const load = () => {
    setLoading(true);
    apiFetch('/parcels/my-parcels').then(setParcels).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const statuses = ['All','Expected','Arrived','Ready for Pickup','Delivered','Cancelled'];
  const filtered = parcels.filter(p => {
    const matchStatus = filter === 'All' || p.status === filter;
    const matchSearch = !search || p.parcelName.toLowerCase().includes(search.toLowerCase()) || p.trackingNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCancel = async () => {
    try {
      await apiFetch(`/parcels/${cancelId}/cancel`, { method:'PUT', body: JSON.stringify({ reason: cancelReason }) });
      setCancelId(null); setCancelReason(''); load();
    } catch(e) { alert(e.message); }
  };

  const handleRate = async (shopId, r, feedback) => {
    try {
      await apiFetch(`/shops/${shopId}/rate`, { method:'POST', body: JSON.stringify({ rating: r, feedback }) });
      load();
    } catch(e) { alert(e.message); }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Parcels</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{parcels.length} total parcel{parcels.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/customer/add-parcel" className="btn-primary self-start sm:self-auto">＋ Add Parcel</Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or tracking…"
            className="input-field sm:max-w-xs" />
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card p-6 w-full max-w-sm animate-fade-in-scale">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cancel Parcel</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This cannot be undone. Please provide a reason.</p>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              className="input-field mb-4 resize-none" rows={3} placeholder="Reason for cancellation…" />
            <div className="flex gap-2">
              <button onClick={() => setCancelId(null)} className="btn-secondary flex-1">Keep It</button>
              <button onClick={handleCancel} className="btn-danger flex-1">Cancel Parcel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card p-5 animate-pulse"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-3"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-gray-900 dark:text-white">No parcels found</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">Try a different search or filter.</p>
          <Link to="/customer/add-parcel" className="btn-primary">Add First Parcel</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p._id} className="card overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-lg flex-shrink-0">📦</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.parcelName}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{p.trackingNumber}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📍 {p.shopId?.shopName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className={`badge ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{p.fee}</span>
                </div>
              </div>

              {expanded === p._id && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/30">
                  {/* OTP */}
                  {p.status === 'Ready for Pickup' && p.otp && (
                    <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4 mb-4 text-center">
                      <p className="text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wider mb-1">Your Pickup OTP</p>
                      <p className="text-4xl font-black text-violet-700 dark:text-violet-300 tracking-widest">{p.otp}</p>
                      <p className="text-xs text-violet-500 mt-1">Show this to the shopkeeper</p>
                    </div>
                  )}
                  {/* Timeline */}
                  {p.timeline?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline</p>
                      <div className="space-y-2">
                        {p.timeline.map((t, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"/>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{t.status}</p>
                              <p className="text-xs text-gray-400">{t.note} · {new Date(t.occurredAt).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex gap-2">
                    {p.status === 'Expected' && (
                      <button onClick={() => { setCancelId(p._id); setExpanded(null); }} className="btn-danger text-xs py-1.5">Cancel Parcel</button>
                    )}
                    {p.status === 'Delivered' && (
                      <RateShop parcel={p} onRate={handleRate}/>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RateShop = ({ parcel, onRate }) => {
  const [open, setOpen]       = useState(false);
  const [stars, setStars]     = useState(5);
  const [feedback, setFeedback] = useState('');
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary text-xs py-1.5">⭐ Rate Shop</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card p-6 w-full max-w-sm animate-fade-in-scale">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Rate {parcel.shopId?.shopName}</h3>
            <p className="text-sm text-gray-500 mb-4">How was your experience?</p>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setStars(n)}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= stars ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</button>
              ))}
            </div>
            <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
              className="input-field mb-4 resize-none" rows={2} placeholder="Optional feedback…" />
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => { onRate(parcel.shopId?._id, stars, feedback); setOpen(false); }} className="btn-primary flex-1">Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MyParcels;
