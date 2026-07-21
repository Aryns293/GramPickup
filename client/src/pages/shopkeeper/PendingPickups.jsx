import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EmptyState } from '../../components/ui';

const PendingPickups = () => {
  const { apiFetch } = useAuth();
  const toast = useToast();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [busy, setBusy] = useState(null);

  const load = () => {
    setLoading(true);
    apiFetch('/parcels/incoming')
      .then(data => setParcels((data || []).filter(p => p.status === 'Ready for Pickup')))
      .catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDeliver = async (id) => {
    const otp = otpInputs[id] || '';
    if (otp.length !== 6) return toast.warning('OTP must be exactly 6 digits');
    setBusy(id);
    try {
      await apiFetch(`/parcels/${id}/deliver`, { method: 'PUT', body: JSON.stringify({ otp }) });
      toast.success('Parcel delivered successfully!');
      load();
    } catch(e) {
      toast.error(e.message || 'Invalid OTP — please try again');
    } finally { setBusy(null); }
  };

  const handleDirect = async (id) => {
    if (!confirm('Bypass OTP verification? Only use in emergencies.')) return;
    setBusy(id);
    try {
      await apiFetch(`/parcels/${id}/deliver-direct`, { method: 'PUT', body: JSON.stringify({}) });
      toast.success('Direct handover recorded.');
      load();
    } catch(e) {
      toast.error(e.message);
    } finally { setBusy(null); }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Pickups</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {parcels.length} parcel{parcels.length !== 1 ? 's' : ''} waiting for customer
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/>
          </div>
        ))}</div>
      ) : parcels.length === 0 ? (
        <div className="card">
          <EmptyState icon="🎉" title="All clear!" description="No parcels waiting for pickup right now." />
        </div>
      ) : (
        <div className="space-y-4">
          {parcels.map(p => (
            <div key={p._id} className="card overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-lg flex-shrink-0">🔑</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{p.parcelName}</p>
                      <p className="text-xs font-mono text-gray-400">{p.trackingNumber}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>👤 {p.customerId?.name}</span>
                        <span>📞 {p.customerId?.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">₹{p.fee}</p>
                    <p className="text-xs text-gray-400">storage fee</p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-800/30">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Enter OTP from customer</p>
                <div className="flex gap-2">
                  <input
                    type="text" maxLength={6} placeholder="6-digit OTP"
                    value={otpInputs[p._id] || ''}
                    onChange={e => setOtpInputs({ ...otpInputs, [p._id]: e.target.value.replace(/\D/g,'').slice(0,6) })}
                    className="input-field max-w-[160px] font-mono text-center text-lg tracking-widest"
                  />
                  <button disabled={busy === p._id} onClick={() => handleDeliver(p._id)}
                    className="btn-primary disabled:opacity-50">
                    {busy === p._id ? '…' : 'Verify & Deliver'}
                  </button>
                  <button disabled={busy === p._id} onClick={() => handleDirect(p._id)}
                    className="btn-secondary text-xs disabled:opacity-50">
                    Direct
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PendingPickups;
