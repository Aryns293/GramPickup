import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatCard, EmptyState, PageHeader } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { greeting, formatDate } from '../../utils/format';

const CustomerDashboard = () => {
  const { user, apiFetch } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/parcels/my-parcels')
      .then(setParcels).catch(console.error).finally(() => setLoading(false));
  }, []);

  const counts = {
    total:     parcels.length,
    expected:  parcels.filter(p => p.status === 'Expected').length,
    arrived:   parcels.filter(p => ['Arrived', 'Ready for Pickup'].includes(p.status)).length,
    delivered: parcels.filter(p => p.status === 'Delivered').length,
  };

  const urgent = parcels.filter(p => p.status === 'Ready for Pickup');

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={greeting(user?.name)}
        subtitle="Here's what's happening with your parcels."
        action={<Link to="/customer/add-parcel" className="btn-primary">＋ Register Parcel</Link>}
      />

      {/* Urgent alert */}
      {urgent.length > 0 && (
        <div className="mb-6 card border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔑</span>
            <div>
              <p className="font-semibold text-violet-900 dark:text-violet-200 text-sm">
                {urgent.length === 1
                  ? `"${urgent[0].parcelName}" is ready for pickup!`
                  : `${urgent.length} parcels are ready for pickup!`}
              </p>
              <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                Visit your shop and show your pickup code to collect.
              </p>
            </div>
          </div>
          <Link to="/customer/parcels" className="btn-primary text-sm flex-shrink-0">View Code</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="All Parcels"    value={counts.total}     icon="📦" color="bg-indigo-50 dark:bg-indigo-900/30"/>
        <StatCard label="On The Way"     value={counts.expected}  icon="⏳" color="bg-blue-50 dark:bg-blue-900/30"/>
        <StatCard label="At The Shop"    value={counts.arrived}   icon="🏪" color="bg-amber-50 dark:bg-amber-900/30"/>
        <StatCard label="Collected"      value={counts.delivered} icon="✅" color="bg-green-50 dark:bg-green-900/30"/>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { to:'/customer/add-parcel', icon:'📦', title:'Register a Parcel',   desc:'Add a new expected delivery to track' },
          { to:'/customer/shops',      icon:'🏪', title:'Find a Pickup Shop',  desc:'Browse verified shops near you' },
          { to:'/customer/parcels',    icon:'📋', title:'My Parcel History',   desc:'See all your past and current parcels' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="text-2xl mb-2">{a.icon}</div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{a.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent parcels */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Parcels</h2>
          {parcels.length > 0 && (
            <Link to="/customer/parcels" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1,2,3].map(i => (
              <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0"/>
                <div className="flex-1">
                  <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-2"/>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3"/>
                </div>
              </div>
            ))}
          </div>
        ) : parcels.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No parcels yet"
            description="Register an expected parcel and we'll keep track of it for you."
            action="Register your first parcel"
            actionTo="/customer/add-parcel"
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {parcels.slice(0, 5).map(p => (
              <div key={p._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-sm flex-shrink-0">📦</div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{p.parcelName}</p>
                    <p className="text-xs text-gray-400 truncate">{p.shopId?.shopName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={p.status}/>
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">₹{p.fee}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
