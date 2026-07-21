import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui';

const ShopkeeperDashboard = () => {
  const { user, apiFetch } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [shop,    setShop]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/parcels/incoming').catch(() => []),
      apiFetch('/shops/mine').catch(() => null),
    ]).then(([p, s]) => { setParcels(p || []); setShop(s); })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    arrived:   parcels.filter(p => p.status === 'Arrived').length,
    ready:     parcels.filter(p => p.status === 'Ready for Pickup').length,
    delivered: parcels.filter(p => p.status === 'Delivered').length,
    revenue:   parcels.filter(p => p.status === 'Delivered').reduce((a, p) => a + (p.fee || 0), 0),
  };

  if (loading) return (
    <div className="animate-pulse space-y-4 mt-4">
      <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card p-6 h-28 bg-gray-100 dark:bg-gray-800"/>)}
      </div>
    </div>
  );

  if (!shop) return (
    <div className="animate-fade-in max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name?.split(' ')[0]}!
        </h1>
      </div>
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Set up your shop</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Register your shop details to start accepting parcels and earning income.
        </p>
        <Link to="/shopkeeper/profile" className="btn-primary">Register My Shop</Link>
      </div>
    </div>
  );

  if (shop.verificationStatus === 'pending') return (
    <div className="animate-fade-in max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Welcome, {user?.name?.split(' ')[0]}!</h1>
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your shop is under review</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          We are reviewing your shop details. This usually takes less than 24 hours.
          We will notify you as soon as it is approved.
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
          🏪 {shop.shopName} · {shop.city}
        </div>
      </div>
    </div>
  );

  if (shop.verificationStatus === 'rejected') return (
    <div className="animate-fade-in max-w-md">
      <div className="card p-8 text-center border-red-200 dark:border-red-800">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Application not approved</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Your shop was not approved at this time. Please update your shop details and resubmit.
        </p>
        <Link to="/shopkeeper/profile" className="btn-secondary">Update Details</Link>
      </div>
    </div>
  );

  const pendingAction = stats.arrived + stats.ready;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name?.split(' ')[0]}'s Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            🏪 <span className="font-medium text-gray-700 dark:text-gray-300">{shop.shopName}</span>
            {' '}·{' '}
            <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
          </p>
        </div>
        <Link to="/shopkeeper/incoming" className="btn-primary self-start sm:self-auto">
          Manage Parcels
        </Link>
      </div>

      {/* Action needed alert */}
      {pendingAction > 0 && (
        <div className="mb-6 card border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📥</span>
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                {pendingAction} parcel{pendingAction > 1 ? 's' : ''} need your attention
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                {stats.arrived > 0 && `${stats.arrived} arrived — mark ready. `}
                {stats.ready > 0 && `${stats.ready} waiting for pickup — verify OTP.`}
              </p>
            </div>
          </div>
          <Link to={stats.ready > 0 ? '/shopkeeper/pending-pickups' : '/shopkeeper/incoming'}
            className="btn-primary text-sm flex-shrink-0">
            Take Action
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Arrived"       value={stats.arrived}   icon="📥" color="bg-amber-50 dark:bg-amber-900/30"   to="/shopkeeper/incoming"/>
        <StatCard label="Ready to Hand" value={stats.ready}     icon="🔑" color="bg-violet-50 dark:bg-violet-900/30" to="/shopkeeper/pending-pickups"/>
        <StatCard label="Delivered"     value={stats.delivered} icon="✅" color="bg-green-50 dark:bg-green-900/30"   to="/shopkeeper/revenue"/>
        <StatCard label="Total Earned"  value={`₹${stats.revenue}`} icon="💰" color="bg-indigo-50 dark:bg-indigo-900/30"/>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { to:'/shopkeeper/incoming',        icon:'📥', title:'Incoming Parcels',  desc:'Mark parcels arrived or ready for pickup' },
          { to:'/shopkeeper/pending-pickups', icon:'🔑', title:'Verify OTP',         desc:'Hand over parcels to waiting customers' },
          { to:'/shopkeeper/revenue',         icon:'💰', title:'My Earnings',        desc:'Track all income from deliveries' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="text-2xl mb-2">{a.icon}</div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{a.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      {parcels.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Parcels</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {parcels.slice(0, 6).map(p => (
              <div key={p._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{p.parcelName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {p.customerId?.name} · {p.trackingNumber}
                  </p>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${
                  p.status === 'Delivered'        ? 'bg-green-50  text-green-700  dark:bg-green-900/30  dark:text-green-300'  :
                  p.status === 'Ready for Pickup' ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' :
                                                    'bg-amber-50  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;
