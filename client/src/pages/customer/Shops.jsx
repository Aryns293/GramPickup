import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Stars = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`text-sm ${n <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</span>
      ))}
    </div>
    <span className="text-xs text-gray-400">{rating?.toFixed(1) || '—'} ({count || 0})</span>
  </div>
);

const CustomerShops = () => {
  const { apiFetch } = useAuth();
  const [shops, setShops]   = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    apiFetch('/shops/approved').then(setShops).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = shops.filter(s =>
    s.shopName.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verified Shops</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{shops.length} approved pickup points</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city…" className="input-field sm:max-w-64" />
      </div>

      {/* Shop Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="card p-6 w-full max-w-md animate-fade-in-scale" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selected.shopName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selected.city}</p>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-1.5 text-gray-400">✕</button>
            </div>
            {selected.shopPhoto && <img src={selected.shopPhoto} alt="" className="w-full h-40 object-cover rounded-xl mb-4"/>}
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><span className="text-gray-400">📍</span><span className="text-gray-700 dark:text-gray-300">{selected.address}</span></div>
              <div className="flex gap-2"><span className="text-gray-400">📞</span><span className="text-gray-700 dark:text-gray-300">{selected.phone}</span></div>
              <div className="flex gap-2"><span className="text-gray-400">👤</span><span className="text-gray-700 dark:text-gray-300">{selected.ownerName}</span></div>
              <div className="flex gap-2 items-center"><span className="text-gray-400">⭐</span><Stars rating={selected.averageRating} count={selected.ratings?.length}/></div>
            </div>
            {selected.ratings?.length > 0 && (
              <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Reviews</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selected.ratings.slice(-5).reverse().map((r, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{r.customerName}</span>
                        <div className="flex">{[1,2,3,4,5].map(n => <span key={n} className={`text-xs ${n <= r.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>)}</div>
                      </div>
                      {r.feedback && <p className="text-xs text-gray-500">{r.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card p-5 animate-pulse"><div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3"/><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-2"/><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"/></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-gray-900 dark:text-white">No shops found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s._id} className="card overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group" onClick={() => setSelected(s)}>
              {s.shopPhoto ? (
                <img src={s.shopPhoto} alt="" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"/>
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center text-4xl">🏪</div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-0.5 truncate">{s.shopName}</h3>
                <p className="text-xs text-gray-400 mb-2">📍 {s.city}</p>
                <Stars rating={s.averageRating} count={s.ratings?.length}/>
                <p className="text-xs text-gray-400 mt-2 truncate">👤 {s.ownerName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CustomerShops;
