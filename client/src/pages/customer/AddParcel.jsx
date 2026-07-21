import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AddParcel = () => {
  const { apiFetch } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops]   = useState([]);
  const [form, setForm]     = useState({ parcelName:'', trackingNumber:'', shopId:'', expectedArrivalDate:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState('');

  useEffect(() => { apiFetch('/shops/approved').then(setShops).catch(console.error); }, []);

  const filteredShops = shops.filter(s =>
    s.shopName.toLowerCase().includes(shopSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(shopSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await apiFetch('/parcels', { method:'POST', body: JSON.stringify(form) });
      navigate('/customer/parcels');
    } catch(err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Register New Parcel</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a parcel you're expecting at a pickup shop.</p>
      </div>

      <div className="card p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Parcel Name</label>
            <input type="text" required value={form.parcelName}
              onChange={e => setForm({...form, parcelName: e.target.value})}
              className="input-field" placeholder="e.g. Running shoes, adidas" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Tracking Number</label>
            <input type="text" required value={form.trackingNumber}
              onChange={e => setForm({...form, trackingNumber: e.target.value})}
              className="input-field font-mono" placeholder="e.g. TRK37328432" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Pickup Shop</label>
            <input type="text" placeholder="Search shops by name or city…"
              value={shopSearch} onChange={e => setShopSearch(e.target.value)}
              className="input-field mb-2" />
            <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
              {filteredShops.length === 0 ? (
                <p className="text-sm text-gray-400 p-4 text-center">No approved shops found</p>
              ) : filteredShops.map(s => (
                <label key={s._id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${form.shopId === s._id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                  <input type="radio" name="shopId" value={s._id} checked={form.shopId === s._id}
                    onChange={e => setForm({...form, shopId: e.target.value})} className="accent-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.shopName}</p>
                    <p className="text-xs text-gray-400">{s.city} · ⭐ {s.averageRating?.toFixed(1) || 'New'}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Expected Arrival Date</label>
            <input type="date" required value={form.expectedArrivalDate}
              onChange={e => setForm({...form, expectedArrivalDate: e.target.value})}
              className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading || !form.shopId} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'Registering…' : 'Register Parcel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddParcel;
